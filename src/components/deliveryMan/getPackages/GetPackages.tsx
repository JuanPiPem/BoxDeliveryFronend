"use client";

import React, { useEffect, useRef, useState } from "react";
import s from "./getPackages.module.scss";
import Header from "commons/header/Header";
import ButtonDarkBlue from "commons/buttonDarkBlue/ButtonDarkBlue";
import VectorDown from "assets/img/VectorDown";
import VectorUp from "assets/img/VectorUp";
import SelectPackage from "commons/selectPackage/SelectPackage";
import { packageServiceGetUnassigned } from "services/package.service";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import { FullPackage } from "types/types";

const GetPackages = () => {
  const router = useRouter();
  const [packages, setPackages] = useState<FullPackage[]>([]);
  const [isScrollable, setIsScrollable] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const packagesListRef = useRef<HTMLDivElement>(null);
  const user = useSelector((state: RootState) => state.user);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (packages.length === 0) return router.back();
    if (typeof window !== "undefined") {
      const checkedPackageIds = localStorage.getItem("selectedIds");
      if (!user.id) throw new Error();
      if (!checkedPackageIds)
        return toast.warning("Seleccione al menos un paquete");
      const ids: string[] = JSON.parse(checkedPackageIds);
      const idsCopy = [...ids];
      for (const packageId of idsCopy) {
        const index = ids.indexOf(packageId);
        if (index !== -1) {
          ids.splice(index, 1);
        }
      }
      return router.push("/delivery-man/sworn-declaration");
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
  }, [isScrollable, atBottom]);

  useEffect(() => {
    packageServiceGetUnassigned()
      .then((unassignedPackages) => setPackages(unassignedPackages))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className={s.addPackagesContainer}>
      <div className={s.addPackagesContentContainer}>
        <div className={s.header}>
          <Header text="Obtener Paquetes" />
        </div>
        {packages.length === 0 ? (
          <div className={s.outerContainer}>
            <div className={`${s.headList}`}>
              <h4>No hay mas paquetes para repartir</h4>
            </div>
            <div className={s.contentContainer}>
              <p>
                Puedes ir a descansar, <br /> o si coicideras que esto es un
                error, <br /> por favor{" "}
                <span> ponte en contacto con el administrador</span>
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className={`${s.headList}`}>
              <div>¿Cuantos paquetes repartiras hoy?</div>
            </div>
            <div
              className={`${s.packagesList} ${isScrollable ? s.scrolled : ""}`}
              ref={packagesListRef}
            >
              {packages.map((item: FullPackage, index: number) => (
                <React.Fragment key={item.id}>
                  <SelectPackage package={item} />
                  {index < packages?.length - 1 && <hr className={s.lastHr} />}
                </React.Fragment>
              ))}
            </div>
            {packages.length > 8 && (
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
            )}{" "}
          </>
        )}
        <div className={`${s.button}`} onClick={handleSubmit}>
          <ButtonDarkBlue
            text={packages.length !== 0 ? "Iniciar Jornada" : "volver"}
          />
        </div>
      </div>
      <Toaster richColors position="top-center" />
    </div>
  );
};

export default GetPackages;
