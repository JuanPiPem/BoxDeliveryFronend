"use client";

import React, { useRef, useEffect, useState } from "react";
import s from "./pendingDeliveries.module.scss";
import { Saira } from "next/font/google";
import TableListPackages from "commons/tableListPackages/TableListPackages";
import VectorDown from "assets/img/VectorDown";
import VectorUp from "assets/img/VectorUp";
import DeployArrowDown from "assets/img/DeployArrowDown";
import DeployArrowRight from "assets/img/DeployArrowRight";
import Link from "next/link";

const saira = Saira({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

type items = {
  id: string;
  address: string;
  status: string;
};

type Prop = {
  arrayPackages: Array<items>;
  view: string;
  section: string;
  pending: Array<items>;
  // onStartPackage: (packageId: string) => void;
};
//The viewType can be: "paquetes-admin", "perfil-repartidor" o "home-repartidor"
//The sections can be: "repartos-pendientes" "historial-repartos"

function PendingDeliveries(prop: Prop) {
  const [show, setShow] = useState(true);
  const [isScrollable, setIsScrollable] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const [showGradient, setShowGradient] = useState(true);

  const toggle = () => {
    setShow((prevState) => !prevState);
  };

  const packagesListRef = useRef<HTMLDivElement>(null);

  const handleVectorContainerClick = () => {
    if (packagesListRef.current) {
      packagesListRef.current.scrollTop += 50;

      const scrollBottom =
        packagesListRef.current.scrollHeight -
        (packagesListRef.current.scrollTop +
          packagesListRef.current.clientHeight);

      // Verifica si el scroll está cerca del final (ajustar el margen según sea necesario)
      const atBottom = scrollBottom <= 1;

      setAtBottom(atBottom);
    }
  };

  const handleVectorUpClick = () => {
    if (atBottom && packagesListRef.current) {
      packagesListRef.current.scrollTop = 0;
      setAtBottom(false);
    }
  };

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

        if (atBottom) {
          setShowGradient(false);
        } else {
          setShowGradient(true);
        }
      }
    };

    const currentRef = packagesListRef.current;

    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isScrollable, show, atBottom]);
  return (
    <>
      <div
        className={s.divDelivery}
        onClick={toggle}
        style={{ marginTop: "10px" }}
      >
        <div className={s.divDeliveryTexts}>
          <p className={`${s.textDelivery} ${saira.className}`}>
            REPARTOS PENDIENTES
          </p>
          {!prop.arrayPackages.length ? (
            <p className={`${s.textDeliveryNotFound} ${saira.className}`}>
              sin repartos
            </p>
          ) : null}
        </div>
        <div className={s.arrow}>
          {show && prop.arrayPackages.length ? (
            <DeployArrowDown />
          ) : (
            <DeployArrowRight />
          )}
        </div>
      </div>
      {show && prop.arrayPackages.length ? (
        <>
          <div className={s.backgronudPaddingTop}></div>
          <div
            id="start"
            className={`${s.packagesList} ${isScrollable ? s.scrolled : ""} ${
              prop.view === "home-repartidor"
                ? s.maxHeightViewDeliveryMan
                : s.maxHeightViewAdmin
            }`}
            ref={packagesListRef}
          >
            <div>
              {prop.arrayPackages.map((item: items, index) => (
                <div key={index}>
                  <div className={s.boxTrash}>
                    {prop.view === "home-repartidor" &&
                    prop.section === "repartos-pendientes" &&
                    item.status === "ongoing" ? (
                      <Link href={"/delivery-man/delivery-in-progress"}>
                        <TableListPackages
                          packageNumber={item.id}
                          address={item.address}
                          viewType={prop.view}
                          section={prop.section}
                          status={item.status}
                          // onStartPackage={prop.onStartPackage}
                        />
                      </Link>
                    ) : (
                      <TableListPackages
                        packageNumber={item.id}
                        address={item.address}
                        viewType={prop.view}
                        section={prop.section}
                        status={item.status}
                        // onStartPackage={prop.onStartPackage}
                      />
                    )}
                  </div>
                  {index < prop.arrayPackages.length - 1 && (
                    <hr className={s.hr} />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className={s.backgroundBorder}></div>
          {prop.arrayPackages.length > 3 && showGradient ? (
            <div className={s.gradient}></div>
          ) : (
            <div className={s.backgroundTransparent}></div>
          )}
          {prop.arrayPackages.length > 2 &&
          prop.view === "perfil-repartidor" ? (
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
        </>
      ) : null}
    </>
  );
}

export default PendingDeliveries;
