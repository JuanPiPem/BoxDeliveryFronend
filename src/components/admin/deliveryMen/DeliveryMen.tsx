"use client";
import React, { useEffect, useRef, useState } from "react";
import s from "./deliveryMen.module.scss";
import Header from "commons/header/Header";
import ColorPoint from "assets/img/ColorPoint";
import VectorDown from "assets/img/VectorDown";
import Link from "next/link";
import VectorUp from "assets/img/VectorUp";
import PieChart from "commons/pieChart/PieChart";
import { userServiceGetDeliverymenWithPackagesQuantityByDate } from "services/user.service";

const DeliveryMen = () => {
  type deliveryman = {
    id: number;
    email: string;
    name: string;
    last_name: string;
    profile_photo: string;
    is_admin: boolean;
    is_confirmed: boolean;
    is_enabled: boolean;
    packagesQuantity: number;
    packagesDeliveredQuantity: number;
  };

  const [isScrollable, setIsScrollable] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const [deliverymen, setDeliverymen] = useState<deliveryman[]>([]);
  const packagesListRef = useRef<HTMLDivElement>(null);
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [currentDayOfMonth, setCurrentDayOfMonth] = useState("");
  const [currentMonth, setCurrentMonth] = useState("");

  const handleVectorContainerClick = () => {
    if (packagesListRef.current) {
      const currentScrollTop = packagesListRef.current.scrollTop;
      packagesListRef.current.scrollTop = currentScrollTop + 50;

      const atBottom =
        packagesListRef.current.scrollTop +
          packagesListRef.current.clientHeight >=
        packagesListRef.current.scrollHeight - 10;

      setAtBottom(atBottom);
    }
  };

  const handleVectorUpClick = () => {
    if (packagesListRef.current) {
      packagesListRef.current.scrollTo({
        top: 0,
        behavior: "auto",
      });

      setAtBottom(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentDate = new Date();
        const months = [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ];
        const days = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

        const monthIndex = currentDate.getMonth();
        const monthName = months[monthIndex];
        setCurrentMonth(monthName.toUpperCase());

        const dayIndex = currentDate.getDay();
        const dayName = days[dayIndex];
        setDayOfWeek(dayName);

        const dayOfMonth = currentDate.getDate();
        setCurrentDayOfMonth(dayOfMonth.toString());

        const monthNumberResult = currentDate.getMonth() + 1;
        const monthNumberFormat = String(monthNumberResult).padStart(2, "0");

        const yearResult = currentDate.getFullYear();

        const deliverymen =
          await userServiceGetDeliverymenWithPackagesQuantityByDate(
            yearResult.toString() +
              "-" +
              monthNumberFormat.toString() +
              "-" +
              dayOfMonth.toString()
          );
        setDeliverymen(deliverymen);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (packagesListRef.current) {
        const scrolled =
          packagesListRef.current.scrollHeight >
          packagesListRef.current.clientHeight;
        setIsScrollable(scrolled);

        const atBottom =
          packagesListRef.current.scrollTop +
            packagesListRef.current.clientHeight >=
          packagesListRef.current.scrollHeight - 1;
        setAtBottom(atBottom);
      }
    };
    const currentRef = packagesListRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
    }
    return () => {};
  }, [isScrollable, atBottom]);

  return (
    <>
      <div className={s.addPackagesContainer}>
        <div className={s.header}>
          <Header text="Repartidores" />
        </div>
        <div className={s.headList}>
          <div>
            <h1 className={s.month}>{currentMonth} </h1>
            <h1 className={s.day}>
              {" "}
              {dayOfWeek} <span className={s.bold}>/ {currentDayOfMonth}</span>
            </h1>
          </div>
        </div>
        <div
          className={`${s.packagesList} ${s.repartidores} ${
            isScrollable ? s.scrolled : ""
          }`}
          ref={packagesListRef}
        >
          {deliverymen &&
            deliverymen.map((deliveryman) => (
              <Link key={deliveryman.id} href={`/admin/delivery-man-profile/${deliveryman.id}`}>
                <div className={s.contentUser}>
                  <div className={s.percentage}>
                    {deliveryman.is_enabled === true ||
                    (deliveryman.packagesQuantity ===
                      deliveryman.packagesDeliveredQuantity &&
                      deliveryman.packagesQuantity !== 0) ? (
                      <PieChart
                        percent={Math.floor(
                          (deliveryman.packagesDeliveredQuantity /
                            deliveryman.packagesQuantity) *
                            100
                        )}
                      />
                    ) : (
                      <PieChart percent={0} />
                    )}
                  </div>
                  <div className={s.nameAndState}>
                    <div id={s.objetoName}>{deliveryman.name}</div>
                    <div className={s.profileState}>
                      {Math.floor(
                        (deliveryman.packagesDeliveredQuantity /
                          deliveryman.packagesQuantity) *
                          100
                      ) === 100 ? (
                        <div className={s.colorPoint}>
                          <ColorPoint state={"entregado"} />
                        </div>
                      ) : deliveryman.is_enabled === false ? (
                        <div className={s.colorPoint}>
                          <ColorPoint state={"deshabilitado"} />
                        </div>
                      ) : (
                        <div className={s.colorPoint}>
                          <ColorPoint state={"en curso"} />
                        </div>
                      )}
                      {(deliveryman.packagesDeliveredQuantity /
                        deliveryman.packagesQuantity) *
                        100 ===
                      100 ? (
                        <div>{"Entregado"}</div>
                      ) : deliveryman.is_enabled === false ? (
                        <div>{"Deshabilitado"}</div>
                      ) : (
                        <div>{"En curso"}</div>
                      )}
                    </div>
                  </div>
                  <div className={s.profilePicture}></div>
                </div>
              </Link>
            ))}
        </div>
        {deliverymen.length > 4 ? (
          <div
            className={s.vectorContainer}
            onClick={
              atBottom ? handleVectorUpClick : handleVectorContainerClick
            }
          >
            <hr className={s.lastHr} />
            <div className={s.vector}>
              {atBottom ? <VectorUp /> : <VectorDown />}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default DeliveryMen;
