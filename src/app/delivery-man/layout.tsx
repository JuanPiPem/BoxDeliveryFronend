"use client";
import React, { ReactNode } from "react";
import Navbar from "commons/navbar/Navbar";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import Link from "next/link";

export default function RootLayout({ children }: { children: ReactNode }) {
  const user = useSelector((state: RootState) => state.user);

  return (
    <>
      {user.id ? <Navbar /> : null}
      {!user.is_admin ? (
        children
      ) : (
        <div className="unauthorizedDiv">
          <h3>Error 401:</h3>
          <p className="unathorizedP">
            No esta autorizado para acceder a esta pagina
          </p>
          <Link href={user.is_admin ? "/admin/manage-orders" : "/login"}>
            <button>Ir al {user.is_admin ? "inicio" : "login"} </button>
          </Link>
        </div>
      )}
    </>
  );
}
