"use client";
import React, { useState } from "react";
import s from "./confirmEmail.module.scss";
import { MdEmail } from "react-icons/md";
import { IconContext } from "react-icons";
import { FaCheckCircle } from "react-icons/fa";
import { BiSolidError } from "react-icons/bi";
import Header from "commons/header/Header";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  resendConfirmationEmail,
  userServiceConfirmEmail,
} from "services/user.service";
import Checked from "assets/img/Checked";

const ConfirmEmail = () => {
  const params = useParams();
  const [stepper, setStepper] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    userServiceConfirmEmail(params.token.toString())
      .then(() => setStepper(2))
      .catch((err) => {
        console.error(err);
        setStepper(3);
      });
  };

  const handleResend = () => {
    setStepper(4);
    resendConfirmationEmail(params.token.toString())
      .then(() => setStepper(5))
      .catch((err) => {
        console.error(err);
        setStepper(3);
      });
  };
  return (
    <div className={s.outerContainer}>
      <Header text="Confirmar cuenta" showArrow />
      <div
        className={`${s.contentContainer} ${
          stepper === 3 && s.contentContainerForError
        }`}
      >
        <div className={s.content}>
          {stepper === 1 ? (
            <>
              <IconContext.Provider value={{ size: "3.8em", color: "#ef7709" }}>
                <div className={s.svgContainer}>
                  <MdEmail />
                </div>
              </IconContext.Provider>
              <div className={s.textContainer}>
                <h2>Ya casi estamos!</h2>
                <p>Haz click en el siguiente boton</p>
              </div>
              <div className={s.buttonContainer}>
                <button className={s.button} onClick={handleSubmit}>
                  Confirmar correo
                </button>
              </div>
            </>
          ) : stepper === 2 ? (
            <>
              <IconContext.Provider value={{ size: "3.2em", color: "#ef7709" }}>
                <div
                  className={`${s.svgContainer} ${
                    stepper === 2 ? s.fadeInAnimation : ""
                  }`}
                >
                  <FaCheckCircle />
                </div>
              </IconContext.Provider>
              <div className={s.textContainer}>
                <h2>Todo listo!</h2>
                <p id={s.small}>Comenza a difrutar nuestra plataforma</p>
              </div>
              <div className={s.buttonContainer}>
                <Link href={`/login`}>
                  <button className={s.button}>Inciar sesion</button>
                </Link>
              </div>
            </>
          ) : stepper === 3 ? (
            <>
              <IconContext.Provider value={{ size: "4em", color: "#ef7709" }}>
                <div
                  className={`${s.svgContainer} ${
                    stepper === 3 ? s.fadeInAnimation : ""
                  }`}
                >
                  <BiSolidError />
                </div>
              </IconContext.Provider>
              <div className={s.textContainer}>
                <h2>Ocurrio un error!</h2>
                <p id={s.small}>Intente nuevamente por favor</p>
                <p id={s.small2}>¿No recibiste el correo de confirmacion?</p>
                <button className={s.sendEmailButton} onClick={handleResend}>
                  Reenviar
                </button>
              </div>
            </>
          ) : stepper === 4 ? (
            <div className={s.loaderContainer}>
              <header className={s.headerLoading}>
                <h4>Enviando email...</h4>
              </header>
              <div className={s.loader}></div>
            </div>
          ) : (
            <div className={s.successContainer}>
              <Checked width={60} height={60} />
              <header className={s.header}>
                <h4 className={s.title}>Email enviado con exito</h4>
                <p>
                  Revisa tu casilla de correo electronico y sigue las
                  instrucciones para confirmar tu cuenta
                </p>
              </header>
              <Link href={"/login"}>
                <button className={s.buttonGoToLogin}>Aceptar</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail;
