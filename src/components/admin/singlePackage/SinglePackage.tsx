"use client";

import PackageInfo from "commons/packageInfo/PackageInfo";
import { useParams } from "next/navigation";
import s from "./singlePackage.module.scss";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { packageServiceGetSingleById } from "services/package.service";
import { removePackage, setCurrentPackage } from "state/packages";
import Header from "commons/header/Header";

const SinglePackage = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const fetchPackage = async () => {
    return await packageServiceGetSingleById(params.id.toString())
      .then((singlePackage) => {
        dispatch(setCurrentPackage(singlePackage));
      })
      .catch(() => {});
  };

  useEffect(() => {
    dispatch(removePackage());
    fetchPackage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, params]);

  return (
    <div className={s.outerContainer}>
      <Header text="Detalles del paquete" />
      <PackageInfo />
    </div>
  );
};

export default SinglePackage;
