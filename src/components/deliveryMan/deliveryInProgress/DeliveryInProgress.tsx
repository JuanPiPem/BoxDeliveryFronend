import React from "react";
import s from "./deliveryInProgress.module.scss";
import Header from "commons/header/Header";
import ButtonDarkBlue from "commons/buttonDarkBlue/ButtonDarkBlue";
const DeliveryInProgress = ()=>{
  return(
    <>
    <div className={s.inProgressConteiner}>

      <Header text="reparto en curso"/>
      <div className={s.inProgressMap} >
        
        <div className={s.deliveryDataContainer}>
          <div className={s.deliveryData}>
            Destino: Amenabar 2100, CABA
            Número de paquete: #0A235
            Recibe: David Rodriguez
          </div>
        </div>
      </div>
      
      <div className={s.inProgressBtn}>
          <ButtonDarkBlue text="finalizado"/>

          <button className={s.btnCancelDelivery}>cancelar entrega </button>
      </div>
    </div>
    </>
  )
}

export default DeliveryInProgress