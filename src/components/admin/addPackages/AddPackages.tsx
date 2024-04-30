"use client";

import React, { ChangeEvent, useState } from "react";
import s from "./addPackages.module.scss";
import ButtonDarkBlue from "commons/buttonDarkBlue/ButtonDarkBlue";
import Header from "commons/header/Header";
import { packageServiceAddPackage } from "services/package.service";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
// import { Autocomplete } from "@react-google-maps/api"; // Importa Autocomplete desde @react-google-maps/api
import { AddPackage } from "types/types";

const AddPackages = () => {
  const [formData, setFormData] = useState<AddPackage>({
    address: "",
    receiver_name: "",
    date: "",
    weight: 0,
  });
  const router = useRouter();
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    fieldName: keyof AddPackage
  ): void => {
    const { value } = e.target;
    setFormData((prevFormData) => {
      return { ...prevFormData, [fieldName]: value };
    });
  };
  const handleCalendarInput = (e: ChangeEvent<HTMLInputElement>) => {
    const day = e.target.value;
    const selectedDate = new Date(e.target.value);
    const dayOfWeek = selectedDate.getDay();

    // Si la fecha seleccionada es sábado (5) o domingo (6)
    if (dayOfWeek === 6 || dayOfWeek === 5) {
      toast.warning("Por favor, seleccione una fecha entre lunes y viernes.");
      e.target.value = ""; // Limpiar el input
    } else {
      setFormData((prevFormData) => {
        return { ...prevFormData, ["date"]: day };
      });
    }
  };
  const handleSumbit = async (e: React.FormEvent) => {
    e.preventDefault();

    const weight = parseFloat(formData.weight as string);
    if (weight <= 0 || weight >= 20) {
      return toast.warning(
        "El peso del paquete debe ser mayor o igual a 0 y menor que 20kg "
      );
    }
    if (
      formData.receiver_name === "" ||
      formData.address === "" ||
      formData.weight === "" ||
      formData.date === ""
    )
      return toast.warning("Complete todos los campos por favor");
    try {
      await packageServiceAddPackage(formData);
      toast.success("Paquete agregado exitosamente!", {
        duration: 1200,
        onAutoClose() {
          return router.push("/");
        },
      });
    } catch (error) {
      return toast.error("Error al intentar agregar el paquete");
    }
  };

  return (
    <div className={s.addPackagesContainer}>
      <div className={s.addPackagesContentContainer}>
        <Header text="Agregar Paquetes" />
        <div className={s.form}>
          <div className={s.content}>
            <form>
              {/* <Autocomplete onLoad={() => {}}> */}
              <input
                type="text"
                placeholder="Dirección"
                onBlur={(e) => handleInputChange(e, "address")}
                onChange={(e) => handleInputChange(e, "address")}
                className={s.input}
                autoFocus
              />
              {/* </Autocomplete> */}
              <input
                type="text"
                className={`${s.input}`}
                placeholder="Nombre de quien recibe"
                onChange={(e) => handleInputChange(e, "receiver_name")}
              />
              <input
                type="number"
                className={`${s.input}`}
                placeholder="Peso del paquete (Kg)"
                step="0.01"
                onChange={(e) => handleInputChange(e, "weight")}
              />
            </form>
          </div>
          <div className={`${s.content} ${s.divDate}`}>
            <label htmlFor="deadLine" className={`${s.labelInputDate}`}>
              Fecha de entrega
            </label>
            <input
              type="date"
              id="deadLine"
              className={`${s.inputDate}`}
              min={`${year}-${month}-${day}`}
              onChange={(e) => handleCalendarInput(e)}
            />
          </div>
        </div>
        <div className={`${s.button}`} onClick={handleSumbit}>
          <ButtonDarkBlue text="Agregar" />
        </div>
      </div>
      <Toaster richColors expand={false} position="top-center" />
    </div>
  );
};

export default AddPackages;
