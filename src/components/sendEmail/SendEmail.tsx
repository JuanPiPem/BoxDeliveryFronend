"use client";
import React, {
  //  useEffect,
  useState,
} from "react";
import s from "./sendEmail.module.scss";
import ButtonDarkBlue from "commons/buttonDarkBlue/ButtonDarkBlue";
import Checked from "assets/img/Checked";
import Link from "next/link";
import Header from "commons/header/Header";
import { Toaster, toast } from "sonner";
import LeftArrow from "../../assets/img/LeftArrow";
import { useRouter } from "next/navigation";
import { userServiceRestorePassword } from "services/user.service";

const SendEmail = () => {
  const router = useRouter();
  const [stepper, setStepper] = useState<number>(1);
  const [email, setEmail] = useState("");
  const handleSubmit = () => {
    setStepper(2);
    return userServiceRestorePassword(email)
      .then(() => setStepper(3))
      .catch((err) => {
        toast.error(
          err.response.data === "Email does not exist"
            ? "No se encontró una cuenta asociada a ese correo electrónico."
            : err.response.data,
          {
            duration: 10000,
          }
        );
        return setStepper(1);
      });
  };
  return (
    <div className={s.loginContainer}>
      <Header text="Recuperar contraseña" showArrow={true} link="/login" />
      <div className={`${s.loginContentContainer}`}>
        <div className={s.content}>
          {stepper === 1 ? (
            <>
              <button className={s.backButton} onClick={() => router.back()}>
                <LeftArrow width={12} /> Volver
              </button>
              <header id={s.first} className={s.header}>
                <h4 className={s.title}>Recuperar contraseña</h4>
                <p>Ingrese el correo electronico asociado a su cuenta de Box</p>
              </header>
              <input
                type="email"
                className={`${s.input}`}
                placeholder="Correo electronico"
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
              <div className={s.buttonLogin} onClick={handleSubmit}>
                <ButtonDarkBlue text="Enviar email" />
              </div>
            </>
          ) : stepper === 2 ? (
            <div className={s.loaderContainer}>
              <header className={s.headerLoading}>
                <h4>Enviando email...</h4>
              </header>
              <div className={s.loader}></div>
            </div>
          ) : (
            stepper === 3 && (
              <div className={s.successContainer}>
                <Checked width={60} height={60} />
                <header className={s.header}>
                  <h4 className={s.title}>Email enviado con exito</h4>
                  <p>
                    Revisa tu casilla de correo electronico y sigue las
                    instrucciones para recuperar tu contraseña
                  </p>
                </header>
                <Link href={"/login"}>
                  <button className={s.buttonRecoverPassword}>Aceptar</button>
                </Link>
              </div>
            )
          )}
        </div>
      </div>
      <Toaster richColors expand={false} position="top-center" />
    </div>
  );
};

export default SendEmail;
