"use client";

import React, { useEffect, useState } from "react";
import s from "./packageInfo.module.scss";
import { shortText } from "utils/textTrimmer";
import { formatDate } from "utils/dateHelpers";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import { statusTranslated } from "utils/translator";
import { GoTrash } from "react-icons/go";
import { GoPackageDependents } from "react-icons/go";
import { FaUserXmark } from "react-icons/fa6";
import {
  userServiceGetDeliverymen,
  userServiceGetSingle,
} from "services/user.service";
import {
  packageServiceAssignPackage,
  packageServiceDeletePacakge,
  packageServiceRemoveAssignPackage,
} from "services/package.service";
import { Toaster, toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { DeliveryMan } from "types/types";

const PackageInfo = ({ updatePackage }: { updatePackage?: () => void }) => {
  const router = useRouter();
  const pathname = usePathname();
  const currentPackage = useSelector(
    (state: RootState) => state.currentPackage
  );
  const initialState = () => {
    return {
      message: "",
      show: false,
      action: "",
    };
  };
  const [deliveryMan, setDeliveryMan] = useState("Sin asignar");
  const [deliverymen, setDeliverymen] = useState<DeliveryMan[]>([]);
  const [selectedDeliveryMan, setSelectedDeliveryMan] = useState("");
  const [showAlerts, setShowAlerts] = useState(false);
  const [confirmState, setConfirmState] = useState(initialState);
  const handleClick = (feature: string) => {
    if (feature === "release") {
      setConfirmState({
        message:
          currentPackage.user_id === null
            ? "Este paquete no está asignado a ningún repartidor"
            : "Si continúa, este paquete quedará libre de repartidor",
        show: false,
        action: currentPackage.user_id === null ? "noBtn" : "release",
      });
      if (confirmState.action !== "release") return setShowAlerts(true);
      else return setShowAlerts(!showAlerts);
    } else if (feature === "reassign") {
      fetchAllDeliveryMen();
      setConfirmState({
        message: "A continuacion se reasignara el paquete",
        show: false,
        action: "reassign",
      });
      if (confirmState.action !== "reassign") return setShowAlerts(true);
      else return setShowAlerts(!showAlerts);
    } else if (feature === "delete") {
      setConfirmState({
        message: "¿Estas seguro que quieres eliminar el paquete?",
        show: true,
        action: "delete",
      });
      if (confirmState.action !== "delete") return setShowAlerts(true);
      else return setShowAlerts(!showAlerts);
    }
  };

  const handleActionCancel = () => {
    setConfirmState(initialState);
    setShowAlerts(false);
  };
  const handleActionConfirm = () => {
    if (confirmState.action === "release") return releasePackage();
    if (confirmState.action === "reassign") return reassignPackage();
    if (confirmState.action === "delete") return deletePackage();
  };

  const releasePackage = async () => {
    if (currentPackage.id === null) return;
    await packageServiceRemoveAssignPackage(currentPackage.id);
    try {
      setShowAlerts(false);
      toast.success("Paquete liberado exitosamente", {
        duration: 1500,
        onAutoClose() {
          return setDeliveryMan("Sin asignar");
        },
        onDismiss() {
          return setDeliveryMan("Sin asignar");
        },
      });
    } catch (error) {
      toast.error("Ocurrio un error", {
        duration: 2000,
        description: "Refresque la pagina e intente nuevamente",
      });
    }
  };
  const reassignPackage = async () => {
    if (currentPackage.id === null) return;

    try {
      await packageServiceRemoveAssignPackage(currentPackage.id);

      const assignResponse = await packageServiceAssignPackage(
        currentPackage.id,
        selectedDeliveryMan
      );

      if (assignResponse.status === 200) {
        setShowAlerts(false);
        toast.success("Reasignado correctamente", {
          duration: 1500,
          onAutoClose() {
            if (!updatePackage) return;
            else return updatePackage();
          },
          onDismiss() {
            if (!updatePackage) return;
            else return updatePackage();
          },
        });
      } else {
        toast.error("Ocurrio un error", {
          description: "Refresque la pagina e intente nuevamente",
        });
        setShowAlerts(false);
      }
    } catch (error) {
      toast.error("Ocurrio un error", {
        description: "Refresque la pagina e intente nuevamente",
      });
      setShowAlerts(false);
    }
  };

  const deletePackage = async () => {
    if (currentPackage.id === null) return;
    if (currentPackage.status === "delivered") {
      toast.error("No se puede eliminar un paquete ya entregado");
      return setShowAlerts(false);
    }

    await packageServiceDeletePacakge(currentPackage.id);
    try {
      toast.success("Paquete eliminado exitosamente", {
        duration: 1500,
        onAutoClose() {
          return router.back();
        },
        onDismiss() {
          return router.back();
        },
      });
    } catch (error) {
      toast.error("Ocurrio un error", {
        duration: 2000,
        description: "Refresque la pagina e intente nuevamente",
      });
    }
  };

  const fetchDeliveryMan = async () => {
    try {
      if (!currentPackage.user_id) return;
      const deliveryman = await userServiceGetSingle(
        parseFloat(currentPackage.user_id)
      );
      return setDeliveryMan(deliveryman.name + " " + deliveryman.last_name);
    } catch (error) {
      return setDeliveryMan("Sin asignar");
    }
  };
  const fetchAllDeliveryMen = async () => {
    try {
      const deliveryMen = await userServiceGetDeliverymen();
      setDeliverymen(deliveryMen);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (currentPackage.user_id !== null) {
      fetchDeliveryMan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPackage.user_id]);
  return (
    <div>
      <div className={s.statusDeliveryDataContainer}>
        {currentPackage.id ? (
          <div className={s.statusDeliveryData}>
            <span> Número de paquete: </span> #{currentPackage.id} <br />
            <span>Estado: </span>
            {shortText(statusTranslated(currentPackage.status))} <br />
            <span> Recibe: </span>
            {currentPackage.receiver_name} <br />
            <span>Destino: </span>
            {shortText(currentPackage.address)} <br />
            <span> Fecha de entrega: </span>
            {formatDate(currentPackage.date)} <br />
            <span> Repartidor: </span>
            {deliveryMan} <br />
            {pathname.includes("admin") ? (
              <div className={s.functionalitiesContainer}>
                <div onClick={() => handleClick("release")}>
                  <p>
                    Liberar <FaUserXmark />
                  </p>
                </div>
                <div onClick={() => handleClick("reassign")}>
                  <p>
                    Reasignar <GoPackageDependents />
                  </p>
                </div>
                <div onClick={() => handleClick("delete")}>
                  <p>
                    Eliminar <GoTrash />
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className={s.notFoundContainer}>
            <div className={s.notFoundContentContainer}>
              <h2>
                El ID de paquete ingresado no corresponde a ningún paquete
              </h2>
              <p>Por favor verifique, e intente nuevamente</p>
            </div>
          </div>
        )}
      </div>
      <div className={`${s.alertsContainer} ${showAlerts ? s.visible : ""}`}>
        <div className={s.contentContainer}>
          <div className={s.textContainer}>
            <h4>{confirmState.message}</h4>
            <h6> {confirmState.show ? `(Esta accion es irreversible)` : ``}</h6>
          </div>
          <select
            name="deliverymen"
            className={s.select}
            style={{
              display: confirmState.action === "reassign" ? "block" : "none",
            }}
            onChange={(e) => setSelectedDeliveryMan(e.target.value)}
          >
            <option value="disabled">Seleccione un repartidor</option>
            {deliverymen &&
              deliverymen.map((deliveryman, index) => (
                <option value={deliveryman.id} key={index} className={s.option}>
                  {deliveryman.name + " " + deliveryman.last_name}
                </option>
              ))}
          </select>
          <div
            className={s.btnContainer}
            style={{
              display: confirmState.action === "noBtn" ? "none" : "flex",
            }}
          >
            <button className={s.cancelBtn} onClick={handleActionCancel}>
              Cancelar
            </button>
            <button className={s.confirmBtn} onClick={handleActionConfirm}>
              Confirmar
            </button>
          </div>
        </div>
      </div>
      <Toaster position="bottom-center" richColors closeButton />
    </div>
  );
};

export default PackageInfo;
