"use client";

import React, { useState } from "react";
import s from "./recoverPassword.module.scss";
import ClosedEye from "assets/img/ClosedEye";
import Eye from "assets/img/Eye";
import ButtonDarkBlue from "commons/buttonDarkBlue/ButtonDarkBlue";
import { Toaster, toast } from "sonner";
import LeftArrow from "assets/img/LeftArrow";
import { useParams, useRouter } from "next/navigation";
import Header from "commons/header/Header";
import axios from "axios";

const RecoverPassword = () => {
  const router = useRouter();
  const params = useParams();
  const [visitedInput1, setVisitedInput1] = useState(false);
  const [visitedInput2, setVisitedInput2] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState(String);
  const [confirmPassword, setConfirmPassword] = useState(String);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword)
      return toast.warning("Complete todos los campos");

    if (!/^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$/.test(password)) return;
    if (password !== confirmPassword) return;

    axios
      .put(
        `${process.env.NEXT_PUBLIC_API_LOCAL_URL}/users/overwrite-password/${params.token}`,
        { password },
        { withCredentials: true }
      )
      .then(() => {
        toast.success("Contraseña cambiada exitosamente!", {
          duration: 2000,
          onAutoClose() {
            return router.push("/login");
          },
        });
      })
      .catch((err) => {
        const errMessage =
          err.response.data.message === "Token has expired"
            ? "El token ha expirado"
            : err.response.data;
        toast.error(errMessage, {
          duration: 12000,
          action: {
            label: "Obtener nuevo token",
            onClick: () => router.push("/send-email"),
          },
          onAutoClose() {
            return router.push("/send-email");
          },
        });
      });
  };
  return (
    <div className={s.recoverPasswordContainer}>
      <Header text="Recuperar contraseña" showArrow={true} />
      <div className={s.recoverPasswordContentContainer}>
        <div className={s.content}>
          <button
            className={s.backButton}
            onClick={() => router.push("/login")}
          >
            <LeftArrow width={12} /> Volver
          </button>
          <header className={s.header}>Ingrese su nueva contraseña</header>
          <div className={s.inputPasswordContainer}>
            <input
              type={showPassword ? `text` : `password`}
              className={s.input}
              placeholder="Nueva contraseña"
              onChange={(e) => {
                setVisitedInput1(true);
                return setPassword(e.target.value);
              }}
              onClick={() => setVisitedInput1(true)}
              autoFocus
            />
            <div
              className={s.eyeContainer}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <ClosedEye /> : <Eye />}{" "}
            </div>
          </div>
          <div className={s.inputPasswordContainer}>
            <input
              type={showConfirmPassword ? `text` : `password`}
              className={s.input}
              placeholder="Confirmar contraseña"
              onChange={(e) => {
                setVisitedInput2(true);

                return setConfirmPassword(e.target.value);
              }}
              onClick={() => setVisitedInput2(true)}
            />
            <div
              className={s.eyeContainer}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <ClosedEye /> : <Eye />}
            </div>
          </div>
          {!/^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$/.test(password) &&
            visitedInput1 && (
              <div className={s.errorText}>
                La contraseña debe contener 8 caracteres,
                <br /> una Mayuscula, una minuscula y un numero.
              </div>
            )}
          {password !== confirmPassword && visitedInput2 && (
            <div className={s.errorText}>Las contraseñas no coinciden.</div>
          )}
          <div className={s.buttonLogin} onClick={handleSubmit}>
            <ButtonDarkBlue text="Cambiar contraseña" />
          </div>
        </div>
      </div>
      <Toaster richColors expand={true} position="top-center" />
    </div>
  );
};

export default RecoverPassword;
