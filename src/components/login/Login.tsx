"use client";
import React, { useEffect, useState } from "react";
import s from "./login.module.scss";
import LoginBoxLogo from "assets/img/LoginBoxLogo";
import ButtonDarkBlue from "commons/buttonDarkBlue/ButtonDarkBlue";
import Eye from "assets/img/Eye";
import ClosedEye from "assets/img/ClosedEye";
import Link from "next/link";
import { Toaster, toast } from "sonner";
import { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setUser } from "../../state/user";
import { userServiceLogin } from "services/user.service";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useRouter();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [_error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (user.id) {
      if (user.is_admin) {
        navigate.push("/admin/manage-orders");
      } else {
        navigate.push("/delivery-man/start-work-day");
      }
    }
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    if (!userData.email || !userData.password) {
      setError("Por favor, complete todos los campos.");
      return toast.warning("Por favor complete todos los campos");
    }
    setLoading(true);
    userServiceLogin(userData)
      .then((user) => {
        dispatch(setUser(user.data));
        return user.data;
      })
      .then((user) => {
        if (user.is_admin) {
          navigate.push("/admin/manage-orders");
          setLoading(false);
        } else if (!user.is_admin) {
          navigate.push("/delivery-man/start-work-day");
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        let errorMessage = "Error al intentar loguearse.";
        if (error.response?.data === "Please complete all the fields")
          return toast.warning("Por favor complete todos los campos");
        if (
          error.response?.data ===
          "Please confirm your account before trying to log in"
        )
          return toast.warning(
            "Por favor confirme su cuenta para iniciar sesion"
          );
        if (error.response?.data === "Incorrect email or password")
          return toast.warning("Correo o contraseña incorrectos");
        if (
          (error as AxiosError).response &&
          (error as AxiosError).response?.status === 412
        )
          errorMessage =
            "Esta cuenta todavía no está confirmada. Revise su correo.";
        setError(errorMessage);
      });
  };
  return (
    <div className={s.loginContainer}>
      <div className={s.loginContentContainer}>
        <div className={s.content}>
          <form action="submit" className="form">
            <input
              type="email"
              name="email"
              value={userData.email}
              className={s.input}
              id={s.margin1}
              placeholder="Correo electronico"
              autoFocus
              onChange={handleInputChange}
            />
            <div className={s.inputPasswordContainer}>
              <input
                type={showPassword ? `text` : `password`}
                name="password"
                value={userData.password}
                className={`${s.input}`}
                id={s.margin2}
                placeholder="Contraseña"
                onChange={handleInputChange}
              />
              <div
                className={s.eyeContainer}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <ClosedEye /> : <Eye />}
              </div>
            </div>
          </form>
          <div className={s.buttonLogin} onClick={handleSubmit}>
            <ButtonDarkBlue text="Ingresar" loading={loading} />
          </div>
          <Link href={"/register"}>
            <div style={{ width: "100%" }}>
              <button className={s.buttonSignUp}>Crear Cuenta</button>
            </div>
          </Link>
          <Link href={"/send-email"}>
            <button className={s.buttonRecoverPassword}>
              Olvidé mi contraseña
            </button>
          </Link>
        </div>
        <div className={s.logoContainer}>
          <LoginBoxLogo />
        </div>
      </div>
      <div className={s.background}></div>
      <Toaster richColors position="top-center" expand={true} />
    </div>
  );
};

export default Login;
