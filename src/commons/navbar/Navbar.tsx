"use client";
import React from "react";
import s from "./navbar.module.scss";
import Box from "assets/img/Box";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { userServiceLogout } from "services/user.service";
import { removeUser } from "../../state/user";
import { useDispatch } from "react-redux";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useRouter();
  const loggedIn = true;
  const isAdmin = true;
  const handleLogout = () => {
    dispatch(removeUser());
    userServiceLogout()
      .then(() => navigate.push("/login"))
      .catch((err) => console.error(err));
  };
  return (
    <div className={s.navbarContainer}>
      <div className={s.contentContainer}>
        <div className={s.content}>
          <Link
            href={
              isAdmin ? "/admin/manage-orders" : "/delivery-man/start-work-day"
            }
          >
            <Box />
          </Link>
          <button
            onClick={handleLogout}
            style={{ display: loggedIn ? `block` : `none` }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
