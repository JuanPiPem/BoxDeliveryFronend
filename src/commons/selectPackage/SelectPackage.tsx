import Unchecked from "assets/img/Unchecked";
import s from "./selectPackage.module.scss";
import React, { useEffect, useState } from "react";
import Checked from "assets/img/Checked";
import Link from "next/link";
import { shortText } from "utils/textTrimmer";
import { SelectPackageProp } from "types/types";

function SelectPackage(prop: SelectPackageProp) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const handleClick = () => {
    if (typeof window !== "undefined") {
      const storedIds = localStorage.getItem("selectedIds");
      const ids = storedIds ? JSON.parse(storedIds) : [];
      const index = ids.indexOf(prop.package.id);
      if (index !== -1) {
        ids.splice(index, 1);
      } else {
        ids.push(prop.package.id);
      }
      localStorage.setItem("selectedIds", JSON.stringify(ids));
      setSelectedIds(ids);
    }
  };
  // const shortText = (text: string) => {
  //   let parts = text.split(",");
  //   if (parts.length >= 3) {
  //     parts = parts.slice(0, 3);
  //     // Verificar si alguna parte contiene "Provincia de" y eliminarla
  //     parts = parts.map((part) =>
  //       part.trim().replace("Provincia de", "").trim()
  //     );
  //     return parts.join(", ").trim();
  //   } else {
  //     return text;
  //   }
  // };
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedIds = localStorage.getItem("selectedIds");
      if (!storedIds) {
        return setChecked(false);
      }
      const ids = JSON.parse(storedIds);
      const isChecked = ids.includes(prop.package.id);
      setChecked(isChecked);
    }
  }, [checked, prop.package.id, selectedIds]);

  return (
    <div className={s.addressListContainer}>
      <div className={s.addressList}>
        <div className={s.checkedContainer} onClick={handleClick}>
          {checked ? <Checked /> : <Unchecked />}
        </div>
        <Link href={`/delivery-man/delivery-in-progress/${prop.package.id}`}>
          <div className={s.address}>{shortText(prop.package.address, 2)}</div>
        </Link>
      </div>
    </div>
  );
}

export default SelectPackage;
