"use client";

import React, { useRef, useEffect, useState } from "react";
import s from "./pendingDeliveries.module.scss";
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

function PendingDeliveries(prop: CommonDeliveriesProps) {
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
      prop.openSection === "deliveriesHistory" &&
      prop.setOpenSection !== undefined
    ) {
      prop.setOpenSection("pendingDeliveries");
    } else if (prop.setOpenSection !== undefined) {
      prop.setOpenSection(
        prop.openSection === "pendingDeliveries" ? "" : "pendingDeliveries"
      );
    }
  };
  const checker = () => {
    if (!pathname.includes("/admin/delivery-man-profile")) {
      return show;
    } else return prop.openSection === "pendingDeliveries";
  };

  const packagesListRef = useRef<HTMLDivElement>(null);

  const handleVectorContainerClick = () => {
    if (packagesListRef.current) {
      packagesListRef.current.scrollTop += 50;

      const scrollBottom =
        packagesListRef.current.scrollHeight -
        (packagesListRef.current.scrollTop +
          packagesListRef.current.clientHeight);

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
        style={{
          marginTop: "10px",
          marginBottom: prop.openSection ? "0px" : "10px",
        }}
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
            className={`${s.packagesList} ${isScrollable ? s.scrolled : ""} ${
              prop.view === "home-repartidor"
                ? s.maxHeightViewDeliveryMan
                : s.maxHeightViewAdmin
            }`}
            ref={packagesListRef}
          >
            <div>
              {prop.arrayPackages.map((item: Package, index) => (
                <div key={index}>
                  <div className={s.boxTrash}>
                    {prop.view === "home-repartidor" &&
                    prop.section === "repartos-pendientes" &&
                    item.status === "ongoing" ? (
                      <TableListPackages
                        packageNumber={item.id}
                        address={item.address}
                        viewType={prop.view}
                        section={prop.section}
                        status={item.status}
                        onStartPackage={prop.onStartPackage}
                      />
                    ) : (
                      <TableListPackages
                        packageNumber={item.id}
                        address={item.address}
                        viewType={prop.view}
                        section={prop.section}
                        status={item.status}
                        onStartPackage={prop.onStartPackage}
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
              <hr
                className={s.lastHr}
                style={{ backgroundColor: "#24424d47" }}
              />
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
