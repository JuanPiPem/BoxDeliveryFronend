"use client";
import React, { useState, ChangeEvent } from "react";
import Header from "commons/header/Header";
import ButtonDarkBlue from "commons/buttonDarkBlue/ButtonDarkBlue";
import s from "./swornDeclaration.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../state/store";
import { useRouter } from "next/navigation";
import { removeUser } from "../../../state/user";
import {
  userServiceEnableDeliveryman,
  userServiceLogout,
} from "services/user.service";
import { packageServiceAssignPackage } from "services/package.service";
import { Toaster, toast } from "sonner";
interface ApiError {
  response: {
    data: string;
  };
}
const SwornDeclaration = () => {
  const user = useSelector((state: RootState) => state.user);
  const navigate = useRouter();
  const dispatch = useDispatch();
  const router = useRouter();
  const [cuestionA, setCuestionA] = useState("");
  const [cuestionB, setCuestionB] = useState("");
  const [cuestionC, setCuestionC] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (
    event: ChangeEvent<HTMLInputElement>,
    cuestion: string
  ) => {
    const selectedOption = event.target.value;
    if (cuestion === "A") {
      setCuestionA(selectedOption);
    } else if (cuestion === "B") {
      setCuestionB(selectedOption);
    } else if (cuestion === "C") {
      setCuestionC(selectedOption);
    }
  };

  const handleLogout = () => {
    dispatch(removeUser());
    userServiceLogout()
      .then(() => navigate.push("/login"))
      .catch((err) => console.error(err));
  };
  const errorToast = () => {
    setTimeout(() => {
      return handleLogout();
    }, 8000);
    return toast.error(
      "Usted cumple con una condición, por ende se le restringe la jornada",
      {
        duration: 10000,
        action: {
          label: "Aceptar",
          onClick: () => handleLogout(),
        },
      }
    );
  };
  const checkDeclarations = () => {
    if (cuestionA === "si" || cuestionA === "") {
      localStorage.removeItem("selectedIds");
      return errorToast();
    }

    if (cuestionB === "si" || cuestionB === "") {
      localStorage.removeItem("selectedIds");
      return errorToast();
    }

    if (cuestionC === "si" || cuestionC === "") {
      localStorage.removeItem("selectedIds");
      return errorToast();
    }
  };
  const handleSumit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    checkDeclarations();

    try {
      await userServiceEnableDeliveryman(user.id!);
      const checkedPackageIds = localStorage.getItem("selectedIds");
      if (!user.id) throw new Error();
      if (!checkedPackageIds) return;
      const ids: string[] = JSON.parse(checkedPackageIds);
      const promises = ids.map((id) => {
        return packageServiceAssignPackage(id, user.id);
      });
      await Promise.all(promises);
      localStorage.removeItem("selectedIds");
      toast.success("Usted puede iniciar su jornada", {
        duration: 4000,
        action: {
          label: "Aceptar",
          onClick: () => navigate.push("/delivery-man/start-work-day"),
        },
        onAutoClose() {
          return router.push("/delivery-man/start-work-day");
        },
      });
    } catch (error) {
      const err =
        (error as ApiError).response.data ===
        "Error: You can't deliver more than 10 packages per day"
          ? "Limite maximo de 10 paquetes por dia"
          : (error as ApiError).response;
      toast.error("Error con la asignacion de paquetes", {
        duration: 3500,
        description: `${err}`,
        onAutoClose() {
          return router.push("/delivery-man/start-work-day");
        },
      });
      localStorage.removeItem("selectedIds");
    }
  };

  return (
    <>
      <div className={s.swornDeclarationContainer}>
        <Header text="declaración jurada" showArrow={false} />
        <div className={s.declarationContainer}>
          <div>
            <div className={s.span}>Requerido*</div>
            <form action="" className={s.cuestion}>
              <p className={s.text}>
                ¿Ha consumido bebidas alcohólicas en las últimas 12 horas?
              </p>
              <div className={s.line}></div>
              <div className={s.customRadio}>
                <label htmlFor="">
                  {" "}
                  <input
                    onChange={(e) => handleOptionChange(e, "A")}
                    type="radio"
                    name="response"
                    id=""
                    value="si"
                  />
                  si{" "}
                </label>

                <label htmlFor="">
                  {" "}
                  <input
                    onChange={(e) => handleOptionChange(e, "A")}
                    type="radio"
                    name="response"
                    id=""
                    value="no"
                  />
                  no{" "}
                </label>
              </div>
            </form>
          </div>

          <div>
            <div className={s.span}>Requerido*</div>
            <form action="" className={s.cuestion}>
              <p className={s.text}>
                ¿Usted está haciendo uso de algún tipo de medicamento
                psicoactivo?
              </p>
              <p>
                por ejemplo, tranquilizantes, antigripales, antialergicos o para
                insomnios
              </p>
              <div className={s.line}></div>
              <div className={s.customRadio}>
                <label htmlFor="">
                  {" "}
                  <input
                    onChange={(e) => handleOptionChange(e, "B")}
                    type="radio"
                    name="response"
                    id=""
                    value="si"
                  />
                  si{" "}
                </label>

                <label htmlFor="">
                  {" "}
                  <input
                    onChange={(e) => handleOptionChange(e, "B")}
                    type="radio"
                    name="response"
                    id=""
                    value="no"
                  />
                  no{" "}
                </label>
              </div>
            </form>
          </div>

          <div>
            <div className={s.span}>Requerido*</div>
            <form action="" className={s.cuestion}>
              <p className={s.text}>
                ¿Tiene usted algún problema familiar, emocional o de cualquier
                tipo que lo distraiga?
              </p>
              <div className={s.line}></div>
              <div className={s.customRadio}>
                <label htmlFor="">
                  {" "}
                  <input
                    onChange={(e) => handleOptionChange(e, "C")}
                    type="radio"
                    name="response"
                    id=""
                    value="si"
                  />
                  si{" "}
                </label>

                <label htmlFor="">
                  {" "}
                  <input
                    onChange={(e) => handleOptionChange(e, "C")}
                    type="radio"
                    name="response"
                    id=""
                    value="no"
                  />
                  no{" "}
                </label>
              </div>
            </form>
          </div>

          <div className={s.btnContinue} onClick={handleSumit}>
            <ButtonDarkBlue text="continuar" loading={loading} />
          </div>
        </div>
        <Toaster richColors expand={true} position="bottom-center" />
      </div>
    </>
  );
};
export default SwornDeclaration;
