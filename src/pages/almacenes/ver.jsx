import React  from "react";
import { Tab, Tabs } from "../tabs/tabs";

import { ToastContainer } from "react-toastify";

import Orden from "./orden"
import Stock from "./stock"
import Entradas from "./entradas"
import Salidas from "./salidas"
import Apartados from "./apartados"
import Estropeados from "./estropeados"


const Storage = () => {
  
  const id = localStorage.getItem("ViewStorage");
  const name = localStorage.getItem("ViewStorageName");

  
 
  return (
    <>
      <ToastContainer />
      <div align="center" className="mb-6">
        <h4 className="card-title"> {name} </h4>
      </div>

      <Tabs>
        {/*Orden del dia*/}
        <Tab label="Orden del día">
          <div className="py-4">
            <Orden></Orden>
          </div>
        </Tab>

        {/*Stock*/}
        <Tab label="Stock">
          <div className="py-4">
            <Stock></Stock>
          </div>
        </Tab>

        {/*Apartados*/}
        <Tab label="Apartados">
          <div className="py-4">
            <Apartados></Apartados>
          </div>
        </Tab>

        {/*Estropeados*/}
        <Tab label="Estropeados">
          <div className="py-4">
            <Estropeados></Estropeados>
          </div>
        </Tab>

        {/*Entradas*/}
        <Tab label="Entradas">
          <div className="py-4">
            <Entradas></Entradas>
          </div>
        </Tab>

        {/*Salidas*/}
        <Tab label="Salidas">
          <div className="py-4">
            <Salidas></Salidas>
          </div>
        </Tab>

        
      </Tabs>
    </>
  );
};

export default Storage;
