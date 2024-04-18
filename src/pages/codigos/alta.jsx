import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Select from "react-select";
import Button from "@/components/ui/Button";
import useDarkMode from "@/hooks/useDarkMode";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";

import clienteAxios from "../../configs/axios";

const CodigosAlta = () => {
  const [isDark] = useDarkMode();
  const [codigo, setCodigo] = useState();
  const [porcentaje, setPorcentaje] = useState();
    
  const navigate = useNavigate();

  const mostrarMensaje = (mensaje) =>{
    toast.error(mensaje, {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "dark",
    });
  }

  const sendData = (event) => {
    event.preventDefault();

    //validamos campos
    if(codigo == "" || codigo == undefined) {
      mostrarMensaje("Debes escribir el código");
    }else if(porcentaje == "" || porcentaje == undefined) {
        mostrarMensaje("Debes escribir el porcentaje");
    } else {
      const createCode = async (dataForm) => {
        try {
          const res = await clienteAxios.post("/codigo/crear", dataForm);
          
          //console.log(res);
          navigate("/codigos");
          
        } catch (error) {
          console.log(error);
          mostrarMensaje(error.response.data.msg);
        }
      };
      createCode({ codigo, porcentaje });
    }
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      background: isDark
        ? "rgb(15 23 42 / var(--tw-bg-opacity))"
        : "transparent",
    }),
    singleValue: (base, state) => ({
      ...base,
      color: isDark ? "white" : "rgb(15 23 42 / var(--tw-text-opacity))",
    }), 
    multiValueRemove: (base, state) => ({
      ...base,
      color: "red",
    }), 
    option: (base, state) => {
      return {
        ...base,
        background: isDark ? "rgb(15 23 42 / var(--tw-bg-opacity))" : "",
        color: state.isFocused ? (isDark ? "white" : "black") : "grey",
      };
    },
  };

  return (
    <>
      <ToastContainer />
      <div className="grid xl:grid-cols-2 grid-cols-1 gap-5">
        <Card title="Alta de Código de descuento">
          <form onSubmit={(e) => sendData(e)}>
            <div className="space-y-4">

              {/*Codigo*/}
              <Textinput
                onChange={(e) => setCodigo(e.target.value)}
                label="Código *"
                placeholder="Código"
                id="codigo"
                type="text"
              />

              {/*Porcentaje*/}
              <Textinput
                onChange={(e) => setPorcentaje(e.target.value)}
                label="Porcentaje *"
                placeholder="Poorcentaje"
                id="porcentaje"
                type="number"
              />

              
              
              <div className=" space-y-4">
                <p>* Campos requeridos</p>
                <Button text="Guardar" type="submit" className="btn-dark" />
              </div>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
};

export default CodigosAlta;
