"use client";

import React, { useEffect, useState } from "react";
import s from "./deliveryManProfile.module.scss";
import Header from "commons/header/Header";
import { ChakraProvider } from "@chakra-ui/react";
import { Switch } from "@chakra-ui/react";
import PendingDeliveries from "commons/pendingDeliveries/PendingDeliveries";
import DeliveriesHistory from "commons/deliveriesHistory/DeliveriesHistory";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "state/store";
import { packageServiceGetPackagesByUserIdAndStatus } from "services/package.service";
import {
  userServiceDisableDeliveryman,
  userServiceEnableDeliveryman,
  userServiceGetSingle,
} from "services/user.service";
import { useParams } from "next/navigation";
import { removeCurrentDeliveryMen, setCurrentDeliveryMen } from "state/user";
import Link from "next/link";
import { AxiosError } from "axios";
import { FullPackage } from "types/types";

const DeliveryManProfile = () => {
  const params = useParams();
  const id = parseInt(params.id as string, 10);
  const dispatch = useDispatch();
  const [openSection, setOpenSection] = useState("");
  const [pendingPackages, setPendingPackages] = useState<FullPackage[]>([]);
  const [ongoingPackages, setOngoingPackages] = useState<FullPackage[]>([]);
  const [deliveredPackages, setDeliveredPackages] = useState<FullPackage[]>([]);
  const [noDeliveryMan, setNoDeliveryMan] = useState(false);
  const [deliveryManIdInvalid, setDeliveryManIdInvalid] = useState(false);
  const currentDeliveryMen = useSelector(
    (state: RootState) => state.currentDeliveryMen
  );

  useEffect(() => {
    const fetchDeliveryMan = async () => {
      try {
        const deliveryMan = await userServiceGetSingle(id);
        if (deliveryMan) {
          dispatch(removeCurrentDeliveryMen());
          dispatch(setCurrentDeliveryMen(deliveryMan));
        } else setNoDeliveryMan(true);
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.data === "Id de usuario no válido") {
          setDeliveryManIdInvalid(true);
        } else {
          console.error(error);
        }
      }
    };
    fetchDeliveryMan();
  }, [params, currentDeliveryMen.is_enabled, dispatch, id]);

  const toggleEnabled = async () => {
    if (currentDeliveryMen !== undefined && currentDeliveryMen.id !== null) {
      if (currentDeliveryMen.is_enabled) {
        const response = await userServiceDisableDeliveryman(
          currentDeliveryMen.id
        );
        dispatch(setCurrentDeliveryMen(response));
      } else if (!currentDeliveryMen.is_enabled) {
        const response = await userServiceEnableDeliveryman(
          currentDeliveryMen.id
        );
        dispatch(setCurrentDeliveryMen(response));
      }
    } else {
      return;
    }
  };

  useEffect(() => {
    if (currentDeliveryMen.id) {
      const fetchPendingPackages = async () => {
        try {
          if (currentDeliveryMen.id !== null) {
            const response = await packageServiceGetPackagesByUserIdAndStatus(
              currentDeliveryMen.id,
              "pending"
            );
            setPendingPackages(response);
          } else {
            return;
          }
        } catch (error) {
          console.error("Error fetching pending packages:", error);
        }
      };
      fetchPendingPackages();
    }
  }, [currentDeliveryMen]);

  useEffect(() => {
    if (currentDeliveryMen.id) {
      const fetchDeliveredPackages = async () => {
        try {
          if (currentDeliveryMen.id !== null) {
            const response = await packageServiceGetPackagesByUserIdAndStatus(
              currentDeliveryMen.id,
              "delivered"
            );
            setDeliveredPackages(response);
          } else {
            return;
          }
        } catch (error) {
          console.error("Error fetching delivered packages:", error);
        }
      };
      fetchDeliveredPackages();
    }
  }, [currentDeliveryMen]);

  useEffect(() => {
    if (currentDeliveryMen.id) {
      const fetchOngoingPackages = async () => {
        try {
          if (currentDeliveryMen.id !== null) {
            const response = await packageServiceGetPackagesByUserIdAndStatus(
              currentDeliveryMen.id,
              "ongoing"
            );
            setOngoingPackages(response);
          } else {
            return;
          }
        } catch (error) {
          console.error("Error fetching ongoing packages:", error);
        }
      };
      fetchOngoingPackages();
    }
  }, [currentDeliveryMen]);

  const combinedPackages = [...pendingPackages, ...ongoingPackages];
  return (
    <div className={s.addPackagesContainer}>
      <div className={s.addPackagesContentContainer}>
        <div className={s.header}>
          <Header text={noDeliveryMan ? "Error" : "Gestionar Pedidos"} />
        </div>
        <div className={s.welcomeCardContainer}>
          <div className={s.welcomeCard}>
            <div className={s.deliveryManData}>
              {noDeliveryMan ? (
                <p>No se encontro un repartidor asociado con ese id</p>
              ) : deliveryManIdInvalid ? (
                <p>Id de usuario no válido</p>
              ) : (
                <>
                  <div className={s.profileImage}></div>
                  <div className={s.textContainer}>
                    <h5>{currentDeliveryMen.name}</h5>
                    <p>
                      {currentDeliveryMen.is_enabled
                        ? "Habilitado"
                        : "deshabilitado"}
                    </p>
                  </div>
                </>
              )}
            </div>
            <div
              style={{
                display:
                  noDeliveryMan || deliveryManIdInvalid ? "none" : "block",
              }}
            >
              <ChakraProvider>
                <Switch
                  colorScheme="teal"
                  size="md"
                  isChecked={currentDeliveryMen.is_enabled}
                  onChange={toggleEnabled}
                />
              </ChakraProvider>
            </div>
          </div>
        </div>
        <Link href={"/admin/manage-orders"}>
          <button
            className={s.btnGoHome}
            style={{
              display: noDeliveryMan || deliveryManIdInvalid ? "block" : "none",
            }}
          >
            Ir al inicio
          </button>
        </Link>
        <>
          <div
            className={s.addPackagesContainer}
            style={{
              display: noDeliveryMan || deliveryManIdInvalid ? "none" : "block",
            }}
          >
            <div className={s.addPackagesContentContainer}>
              <PendingDeliveries
                arrayPackages={combinedPackages}
                view="perfil-repartidor"
                section="repartos-pendientes"
                openSection={openSection}
                setOpenSection={setOpenSection}
                onStartPackage={() => {}}
              />
              <DeliveriesHistory
                arrayPackages={deliveredPackages}
                view="perfil-repartidor"
                section="historial-repartos"
                openSection={openSection}
                setOpenSection={setOpenSection}
                onStartPackage={() => {}}
              />

              <hr className={s.packages} />
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

export default DeliveryManProfile;
