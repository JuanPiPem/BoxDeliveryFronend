"use client";
import React from "react";
import s from "./navbar.module.scss";
import Box from "assets/img/Box";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { userServiceLogout } from "services/user.service";
import { removeUser } from "../../state/user";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useRouter();
  const user = useSelector((state: RootState) => state.user);

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
              user.is_admin
                ? "/admin/manage-orders"
                : !user.is_admin && user.is_enabled
                ? "/delivery-man/start-work-day"
                : "/delivery-man/sworn-declaration"
            }
          >
            <Box />
          </Link>
          <button
            onClick={handleLogout}
            style={{ display: user.id ? `block` : `none` }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
