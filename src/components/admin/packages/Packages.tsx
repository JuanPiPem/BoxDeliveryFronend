"use client";

import React, { useEffect, useRef, useState } from "react";
import s from "./packages.module.scss";
import Header from "commons/header/Header";
import TableListPackages from "commons/tableListPackages/TableListPackages";
import VectorDown from "assets/img/VectorDown";
import VectorUp from "assets/img/VectorUp";
import { packageServiceGetByStatusAndDate } from "services/package.service";
import { getFormattedDate } from "utils/getFormattDate";
import { FullPackage } from "types/types";

const Packages = () => {
  const [packagesDelivered, setPackagesDelivered] = useState<FullPackage[]>([]);
  const [isScrollable, setIsScrollable] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const packagesListRef = useRef<HTMLDivElement>(null);
  const { month, day, dayOfWeek } = getFormattedDate();
  const currentDate = new Date();
  const dayNumber = currentDate.getDate();
  const monthNumber = currentDate.getMonth() + 1;
  const monthNumberFormartted = monthNumber.toString().padStart(2, "0");
  const year = currentDate.getFullYear();

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
      // Utiliza scrollTo para llevar al inicio del scroll
      packagesListRef.current.scrollTo({
        top: 0,
        behavior: "auto", // Cambiado a "auto" para un desplazamiento instantáneo
      });
      setAtBottom(false);
    }
  };

  useEffect(() => {
    packageServiceGetByStatusAndDate(
      "delivered",
      year + "-" + monthNumberFormartted + "-" + dayNumber
    )
      .then((packagesDelivered) => {
        setPackagesDelivered(packagesDelivered);
      })
      .catch((err) => console.error(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (packagesListRef.current) {
        const scrolled =
          packagesListRef.current.scrollHeight >
          packagesListRef.current.clientHeight;
        setIsScrollable(scrolled);

        // Verifica si el scroll está cerca del final
        const atBottom =
          packagesListRef.current.scrollTop +
            packagesListRef.current.clientHeight >=
          packagesListRef.current.scrollHeight - 1; // Cambiado a "-1" para que se considere inmediatamente al llegar al final

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
    <div className={s.addPackagesContainer}>
      <div className={s.addPackagesContentContainer}>
        <div className={s.header}>
          <Header text="Paquetes" />
        </div>
        <div className={s.headList}>
          <div>
            <h1 className={s.month}>{month} </h1>
            <h1 className={s.day}>
              {" "}
              {dayOfWeek} <span className={s.bold}>/ {day}</span>
            </h1>
          </div>
        </div>
        <div
          id="start"
          className={`${s.packagesList} ${isScrollable ? s.scrolled : ""}`}
          ref={packagesListRef}
        >
          <div>
            {packagesDelivered.length === 1 ? (
              <div className={s.packagesNumber}>1 paquete entregado</div>
            ) : (
              <div className={s.packagesNumber}>
                {packagesDelivered.length} paquetes entregados
              </div>
            )}
            {packagesDelivered.length > 0 &&
              packagesDelivered.map((item) => (
                <div key={item.id}>
                  <hr className={s.hr} />
                  <div className={s.boxTrash}>
                    <TableListPackages
                      packageNumber={item.id}
                      address={item.address}
                      viewType="paquetes-admin"
                      section=""
                      status={item.status}
                      onStartPackage={() => {}}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
        {packagesDelivered.length > 5 ? (
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
    </div>
  );
};

export default Packages;
