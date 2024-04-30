"use client";

import PackageInfo from "commons/packageInfo/PackageInfo";
import { useParams, useRouter } from "next/navigation";
import s from "./singlePackage.module.scss";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { packageServiceGetSingleById } from "services/package.service";
import { removePackage, setCurrentPackage } from "state/packages";
import Header from "commons/header/Header";
import ButtonDarkBlue from "commons/buttonDarkBlue/ButtonDarkBlue";

const SinglePackage = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const router = useRouter();

  const fetchPackage = async () => {
    try {
      const singlePackage = await packageServiceGetSingleById(
        params.id.toString()
      );
      dispatch(setCurrentPackage(singlePackage));
    } catch (error) {
      console.error("Error fetching package:", error);
    }
  };
  const updatePackage = async () => {
    dispatch(removePackage());
    await fetchPackage();
  };

  useEffect(() => {
    dispatch(removePackage());
    if (params.id) {
      fetchPackage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, fetchPackage(), params]);

  return (
    <div className={s.outerContainer}>
      <div className={s.contentContainer}>
        <Header text="Detalles del paquete" />
        <PackageInfo updatePackage={updatePackage} />
        <div className={s.buttonContainer} onClick={() => router.back()}>
          <ButtonDarkBlue text="volver" />
        </div>
      </div>
    </div>
  );
};

export default SinglePackage;
