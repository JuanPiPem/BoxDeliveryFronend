"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./deliveryInProgress.module.scss";
import Header from "commons/header/Header";
import ButtonDarkBlue from "commons/buttonDarkBlue/ButtonDarkBlue";
import Map from "../map/Map";
import { useParams, useRouter } from "next/navigation";
import {
  packageServiceCancelTrip,
  packageServiceFinishTrip,
  packageServiceGetSingleById,
  packageServiceStartTrip,
} from "services/package.service";
import { Toaster, toast } from "sonner";
import { RootState } from "state/store";
import { removePackage, setCurrentPackage } from "state/packages";
import { shortText } from "utils/textTrimmer";

const DeliveryInProgress = () => {
  const currentPackage = useSelector(
    (state: RootState) => state.currentPackage
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();

  const fetchPackage = async () => {
    return await packageServiceGetSingleById(params.id.toString()).then(
      (singlePackage) => {
        dispatch(setCurrentPackage(singlePackage));
      }
    );
  };
  useEffect(() => {
    dispatch(removePackage());
    fetchPackage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, params]);

  const handleClick = async () => {
    if (currentPackage.user_id === null) return router.back();
    if (currentPackage.status === "pending") {
      await packageServiceStartTrip(params.id.toString());
      try {
        toast.success("Comenzo el reparto", {
          duration: 1500,
          description: "Presta atencion al camino!",
        });
        return fetchPackage();
      } catch (error) {
        return toast.error("No se pudo iniciar el reparto", {
          description: "Refresque e intente nuevamente!",
        });
      }
    }
    if (currentPackage.status === `ongoing`) {
      await packageServiceFinishTrip(params.id.toString());
      try {
        toast.success("Finalizaste el viaje exitosamente", {
          description: "Al siguiente paquete -->",
        });
        return setTimeout(() => {
          router.push("/delivery-man/start-work-day");
        }, 2000);
      } catch (error) {
        return toast.error("No se pudo finalizar el viaje", {
          description: "Refresque e intente nuevamente!",
        });
      }
    }
    if (currentPackage.status === `delivered`)
      return router.push("/delivery-man/start-work-day");
  };

  const handleCancelClick = async () => {
    await packageServiceCancelTrip(currentPackage.id || "");
    try {
      return router.push("/delivery-man/start-work-day");
    } catch (error) {
      return toast.error(`${error}`);
    }
  };
  const packageStatus = () => {
    if (currentPackage.status === "pending") return "pendiente";
    if (currentPackage.status === "ongoing") return "en curso";
    else return "entregado";
  };
  return (
    <>
      <div className={s.inProgressConteiner}>
        <Header text={`reparto ${packageStatus()}`} />
        {currentPackage.status === "delivered" ? (
          <div>
            <div className={s.statusDeliveryDataContainer}>
              <div className={s.statusDeliveryData}>
                <span className={s.bold}>Destino: </span>
                {shortText(currentPackage.address)} <br />
                <span className={s.bold}> Número de paquete: </span> #
                {currentPackage.id} <br />
                <span className={s.bold}> Recibe: </span>
                {currentPackage.receiver_name}
              </div>
            </div>
          </div>
        ) : (
          <div className={s.inProgressMap}>
            <div className={s.map}>
              <Map destination={currentPackage.address} />
            </div>
            <div className={s.deliveryDataContainer}>
              <div className={s.deliveryData}>
                <span className={s.bold}>Destino: </span>
                {shortText(currentPackage.address)} <br />
                <span className={s.bold}> Número de paquete: </span> #
                {currentPackage.id} <br />
                <span className={s.bold}> Recibe: </span>
                {currentPackage.receiver_name}
              </div>
            </div>
          </div>
        )}

        <div className={s.inProgressBtn}>
          <div className="darkblue" onClick={handleClick}>
            <ButtonDarkBlue
              text={
                currentPackage.user_id === null
                  ? "volver"
                  : currentPackage.status === "ongoing"
                  ? "finalizar"
                  : currentPackage.status === "pending"
                  ? "comenzar"
                  : "volver"
              }
            />
          </div>
          <button
            className={s.btnCancelDelivery}
            onClick={handleCancelClick}
            style={{
              display: currentPackage.status === `ongoing` ? "block" : "none",
            }}
          >
            cancelar entrega
          </button>
        </div>
        <Toaster
          richColors
          position="top-center"
          expand={true}
          closeButton={true}
        />
      </div>
    </>
  );
};

export default DeliveryInProgress;
