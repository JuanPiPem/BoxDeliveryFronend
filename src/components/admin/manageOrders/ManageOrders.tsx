"use client";
import React, { useEffect, useState } from "react";
import s from "./manageOrders.module.scss";
import Header from "commons/header/Header";
import DeployArrowDown from "assets/img/DeployArrowDown";
import DeployArrowRight from "assets/img/DeployArrowRight";
import Plus from "assets/img/Plus";
import { Saira } from "next/font/google";
import Link from "next/link";
import { formatDate } from "date-fns";
import { useSelector } from "react-redux";
import { userServiceGetNumberOfDeliverymenAndEnadledDeliverymen } from "services/user.service";
import PieChart from "commons/pieChart/PieChart";
import { RootState } from "../../../state/store";
import { packageServiceGetNumberOfPacakgesAndPackagesDeliveredByDate } from "services/package.service";

const saira = Saira({ subsets: ["latin"], weight: "700" });

const weekdays = ["lun", "mar", "mier", "jue", "vier"];
const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const ManageOrders = () => {
  const user = useSelector((state: RootState) => state.user);
  const [show, setShow] = useState(true);
  const [currentDay, setCurrentDay] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [deliverymenQuantity, setDeliverymenQuantity] = useState(0);
  const [deliverymenEnabledQuantity, setDeliverymenEnabledQuantity] =
    useState(0);
  const [percentDeliverymen, setPercentDeliverymen] = useState(0);
  const [packagesQuantity, setPackagesQuantity] = useState(0);
  const [deliveredPackagesQuantity, setDeliveredPackagesQuantity] = useState(0);
  const [percentPackages, setPercentPackages] = useState(0);
  const currentDateCaptured = new Date().toLocaleDateString("es-Ar", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  useEffect(() => {
    userServiceGetNumberOfDeliverymenAndEnadledDeliverymen().then(
      (response) => {
        setDeliverymenQuantity(response.deliverymenQuantity);
        setDeliverymenEnabledQuantity(response.enabledDeliverymenQuantity);
      }
    );
    packageServiceGetNumberOfPacakgesAndPackagesDeliveredByDate(
      formatDate(currentDate, "yyyy-MM-dd")
    )
      .then((response) => {
        setPackagesQuantity(response.packagesQuantity);
        setDeliveredPackagesQuantity(response.deliveredPackagesQuantity);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    setPercentDeliverymen(
      100 -
        ((deliverymenQuantity - deliverymenEnabledQuantity) /
          deliverymenQuantity) *
          100
    );
  }, [deliverymenQuantity, deliverymenEnabledQuantity]);

  useEffect(() => {
    setPercentPackages(
      100 -
        ((packagesQuantity - deliveredPackagesQuantity) / packagesQuantity) *
          100
    );
  }, [packagesQuantity, deliveredPackagesQuantity]);

  const toggle = () => {
    setShow((prevState) => !prevState);
  };

  const handlePreviousDay = () => {
    const prevDate = new Date(currentDate);
    let daysToSubtract = 1;

    if (weekdays[currentDay] === "lun") {
      daysToSubtract = 3;
    }

    prevDate.setDate(prevDate.getDate() - daysToSubtract);

    setCurrentDate(prevDate);
    setCurrentDay((prevDay) =>
      prevDay === 0 ? weekdays.length - 1 : prevDay - daysToSubtract
    );
  };

  const handleNextDay = () => {
    const nextDate = new Date(currentDate);
    let daysToAdd = 1;

    if (weekdays[currentDay] === "vier") {
      daysToAdd = 3;
    }

    nextDate.setDate(nextDate.getDate() + daysToAdd);

    setCurrentDate(nextDate);
    setCurrentDay((prevDay) =>
      prevDay === weekdays.length - 1 ? 0 : prevDay + daysToAdd
    );
  };

  return (
    <div className={s.outerContainer}>
      <Header text="Gestionar pedidos" showArrow={false} />
      <div className={s.welcomeCardContainer}>
        <div className={s.welcomeCard}>
          <div className={s.profileImage} />
          <div className={s.textContainer}>
            <h5>¡Hola {user.name}!</h5>
            <p>Estos son los pedidos del día</p>
          </div>
        </div>
      </div>
      <div className={s.calendarCard}>
        <div className={s.header}>
          <h5>{months[currentDate.getMonth()]}</h5>
        </div>
        <div className={s.dates}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="20"
            viewBox="0 0 19 20"
            fill="none"
            onClick={handlePreviousDay}
            style={{ cursor: "pointer" }}
          >
            <path
              d="M6.02937 10.7924C5.50936 10.3921 5.50936 9.6079 6.02937 9.20759L10.14 6.04322C10.7976 5.53703 11.75 6.00579 11.75 6.83563L11.75 13.1644C11.75 13.9942 10.7976 14.463 10.14 13.9568L6.02937 10.7924Z"
              stroke="#24424D"
              strokeLinejoin="round"
            />
            <rect
              x="0.5"
              y="0.5"
              width="18"
              height="19"
              rx="4.5"
              stroke="#24424D"
            />
          </svg>
          {weekdays.map((weekday, index) => {
            const currentDateCopy = new Date(currentDate);
            currentDateCopy.setDate(
              currentDateCopy.getDate() + index - currentDay
            );
            const dayOfMonth = currentDateCopy.getDate();

            return (
              <div
                key={index} 
                className={`${s.specificDate} ${
                  index === currentDay ? s.today : s.future
                }`}
              >
                <p className={s.day}>{weekday}</p>
                <p className={`${s.num} ${saira.className}`}>{dayOfMonth}</p>
              </div>
            );
          })}

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="20"
            viewBox="0 0 19 20"
            fill="none"
            onClick={handleNextDay}
            style={{
              cursor: "pointer",
              pointerEvents:
                formatDate(currentDate, "dd/MM/yyyy") === currentDateCaptured
                  ? "none"
                  : "auto",
            }}
          >
            <path
              d="M12.9706 10.7924C13.4906 10.3921 13.4906 9.6079 12.9706 9.20759L8.85999 6.04322C8.20243 5.53703 7.25 6.00579 7.25 6.83563L7.25 13.1644C7.25 13.9942 8.20243 14.463 8.85999 13.9568L12.9706 10.7924Z"
              stroke="#24424D"
              strokeLinejoin="round"
            />
            <rect
              x="-0.5"
              y="0.5"
              width="18"
              height="19"
              rx="4.5"
              transform="matrix(-1 0 0 1 18 0)"
              stroke="#24424D"
            />
          </svg>
        </div>
      </div>

      <div className={s.header} onClick={toggle}>
        <h5>Detalles</h5>
        <div className={s.dateContainer}>
          <h6>{formatDate(currentDate, "dd/MM/yyyy")}</h6>
        </div>
        <div className={s.arrow}>
          {show ? <DeployArrowDown /> : <DeployArrowRight />}
        </div>
      </div>
      {show ? (
        <div className={s.detailsContainer}>
          <div className={s.info}>
            <div className={s.deliveryCard}>
              <div>
                {formatDate(currentDate, "dd/MM/yyyy") ===
                  currentDateCaptured &&
                deliverymenQuantity &&
                deliverymenEnabledQuantity ? (
                  <PieChart percent={Math.floor(percentDeliverymen)} />
                ) : (
                  <PieChart percent={0} />
                )}
              </div>
              <div className={s.text}>
                <h6>Repartidores</h6>
                {formatDate(currentDate, "dd/MM/yyyy") ===
                currentDateCaptured ? (
                  <p>
                    {deliverymenEnabledQuantity}/{deliverymenQuantity}{" "}
                    Habilitados
                  </p>
                ) : null}
                <div className={s.circlesContainer}>
                  <div className={s.circle}></div>
                  <div className={s.circle}></div>
                </div>
              </div>
              <div className={s.button}>
                <Link href={"/admin/delivery-men"}>
                  <button className={s.button}>VER</button>
                </Link>
              </div>
            </div>
            <hr />
            <div className={s.deliveryCard}>
              {formatDate(currentDate, "dd/MM/yyyy") === currentDateCaptured &&
              packagesQuantity &&
              deliveredPackagesQuantity ? (
                <PieChart percent={Math.floor(percentPackages)} />
              ) : (
                <PieChart percent={0} />
              )}
              <div className={s.text}>
                <h6>Paquetes</h6>
                {formatDate(currentDate, "dd/MM/yyyy") ===
                currentDateCaptured ? (
                  <p>
                    {" "}
                    {deliveredPackagesQuantity}/{packagesQuantity} Repartidos
                  </p>
                ) : null}
                <div className={s.circlesContainer}>
                  <div className={s.circle}></div>
                  <div className={s.circle}></div>
                </div>
              </div>
              <div className={s.buttonContainer}>
                <Link href={"/admin/packages"}>
                  <button className={s.button}>VER</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <Link href={"/admin/add-packages"}>
        <button className={s.bottomButton}>
          Nuevo paquete <Plus />
        </button>
      </Link>
    </div>
  );
};

export default ManageOrders;
