import React from "react";
import s from "./header.module.scss";
import { Saira } from "next/font/google";
import LeftArrow from "assets/img/LeftArrow";
import Link from "next/link";
import { HeaderProps } from "types/types";
import { useRouter } from "next/navigation";

const saira = Saira({ weight: "700", subsets: ["latin"] });

const Header: React.FC<HeaderProps> = ({
  text,
  showArrow = true,
  link = "/",
}): JSX.Element => {
  const router = useRouter();
  const contentStyles = showArrow
    ? { justifyContent: "space-between" }
    : { justifyContent: "center" };
  return (
    <div className={`${s.headerContainer} ${saira.className}`}>
      <div className={s.contentContainer}>
        <div className={s.content} style={contentStyles}>
          {text}
          {showArrow &&
            (link !== "/" ? (
              <Link href={link}>
                <LeftArrow />
              </Link>
            ) : (
              <div onClick={() => router.back()}>
                <LeftArrow />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Header;
