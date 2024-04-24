"use client";
import React, { ReactNode, Suspense } from "react";
import Navbar from "commons/navbar/Navbar";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import Link from "next/link";
import Loading from "./loading";

export default function RootLayout({ children }: { children: ReactNode }) {
  const user = useSelector((state: RootState) => state.user);
  return (
    <>
      {user.id ? <Navbar /> : null}
      {user.is_admin ? (
        <Suspense fallback={<Loading />}>{children}</Suspense>
      ) : (
        <div className="unauthorizedDiv">
          <h3>Error 401:</h3>
          <p className="unathorizedP">
            No esta autorizado para acceder a esta pagina
          </p>
          <Link
            href={!user.is_admin ? "/delivery-man/start-work-day" : "/login"}
          >
            <button>Ir al {!user.is_admin ? "inicio" : "login"} </button>
          </Link>
        </div>
      )}
    </>
  );
}
