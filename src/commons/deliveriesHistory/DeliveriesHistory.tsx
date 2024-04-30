"use client";

import React, { useRef, useEffect, useState } from "react";
import s from "./deliveriesHistory.module.scss";
import { Saira } from "next/font/google";
import TableListPackages from "commons/tableListPackages/TableListPackages";
import VectorDown from "assets/img/VectorDown";
import VectorUp from "assets/img/VectorUp";
import DeployArrowDown from "assets/img/DeployArrowDown";
import DeployArrowRight from "assets/img/DeployArrowRight";
import { usePathname } from "next/navigation";
import { Package } from "types/types";
import { CommonDeliveriesProps } from "types/types";

const saira = Saira({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

function DeliveriesHistory(prop: CommonDeliveriesProps) {
  const pathname = usePathname();
  const [show, setShow] = useState(true);
  const [isScrollable, setIsScrollable] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const [showGradient, setShowGradient] = useState(true);

  const toggle = () => {
    if (!pathname.includes("/admin/delivery-man-profile")) {
      return setShow((prevState) => !prevState);
    }
    if (
      prop.openSection === "pendingDeliveries" &&
      prop.setOpenSection !== undefined
    ) {
      prop.setOpenSection("deliveriesHistory");
    } else if (prop.setOpenSection !== undefined) {
      prop.setOpenSection(
        prop.openSection === "deliveriesHistory" ? "" : "deliveriesHistory"
      );
    }
  };
  const checker = () => {
    if (!pathname.includes("/admin/delivery-man-profile")) {
      return show;
    } else return prop.openSection === "deliveriesHistory";
  };
  const packagesListRef = useRef<HTMLDivElement>(null);

  const handleVectorContainerClick = () => {
    if (packagesListRef.current) {
      packagesListRef.current.scrollTop += 50;

      const scrollBottom = Math.round(
        packagesListRef.current.scrollHeight -
          (packagesListRef.current.scrollTop +
            packagesListRef.current.clientHeight)
      );

      const atBottom =
        scrollBottom <= 1 &&
        packagesListRef.current.scrollTop +
          packagesListRef.current.clientHeight >=
          packagesListRef.current.scrollHeight - 10;

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
        const atBottom =
          packagesListRef.current.scrollTop +
            packagesListRef.current.clientHeight >=
          packagesListRef.current.scrollHeight - 1;
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
            HISTORIAL DE REPARTOS
          </p>
          {!prop.arrayPackages.length ? (
            <p className={`${s.textDeliveryNotFound} ${saira.className}`}>
              sin historial
            </p>
          ) : null}
        </div>
        <div className={s.arrow}>
          {checker() && prop.arrayPackages.length ? (
            <DeployArrowDown />
          ) : (
            <DeployArrowRight />
          )}
        </div>
      </div>
      {checker() && prop.arrayPackages.length ? (
        <>
          <div className={s.backgronudPaddingTop}></div>
          <div
            id="start"
            className={`${s.packagesList} ${isScrollable ? s.scrolled : ""}`}
            ref={packagesListRef}
            style={{
              maxHeight: pathname.includes(`admin/delivery-man-profile`)
                ? "213px"
                : "145",
            }}
          >
            <div>
              <div className={s.packagesNumber}>
                {prop.arrayPackages.length} paquetes entregados
              </div>
              {prop.arrayPackages.map((item: Package, index) => (
                <div key={index + 1}>
                  <hr className={s.hr} />
                  <div className={s.boxTrash}>
                    <TableListPackages
                      packageNumber={item.id}
                      address={item.address}
                      viewType={prop.view}
                      section={prop.section}
                      status={item.status}
                      onStartPackage={prop.onStartPackage}
                    />
                  </div>
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
          {prop.arrayPackages.length > 3 &&
          prop.view === "perfil-repartidor" ? (
            <>
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
            </>
          ) : null}
        </>
      ) : null}
    </>
  );
}

export default DeliveriesHistory;
