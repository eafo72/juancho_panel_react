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

const ColoresAlta = () => {
  const [isDark] = useDarkMode();
  const [nombre, setNombre] = useState();
  const [codigo, setCodigo] = useState();
  const [colorhexa, setHexa] = useState();
    
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
    if(nombre == "" || nombre == undefined) {
      mostrarMensaje("Debes escribir el nombre");
    }else if(codigo == "" || codigo == undefined) {
      mostrarMensaje("Debes escribir el código");
    }else if(colorhexa == "" || colorhexa == undefined) {
      mostrarMensaje("Selecciona un color haciendo click en el cuadro");
    } else {
      const createColor = async (dataForm) => {
        try {
          const res = await clienteAxios.post("/color/crear", dataForm);
          
          //console.log(res);
          navigate("/colores");
          
        } catch (error) {
          console.log(error);
          mostrarMensaje(error.response.data.msg);
        }
      };
      createColor({ nombre, codigo, colorhexa });
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
        <Card title="Alta de Colores">
          <form onSubmit={(e) => sendData(e)}>
            <div className="space-y-4">

              {/*Nombre*/}
              <Textinput
                onChange={(e) => setNombre(e.target.value)}
                label="Nombre *"
                placeholder="Nombre"
                id="nombre"
                type="text"
              />

              {/*Codigo*/}
              <Textinput
                onChange={(e) => setCodigo(e.target.value)}
                label="Código *"
                placeholder="Código"
                id="codigo"
                type="text"
              />

              {/*Hexa
              <Textinput
                onChange={(e) => setHexa(e.target.value)}
                label="Color hexadecimal *"
                placeholder="Color hexadecimal"
                id="colorhexa"
                type="text"
              />
              */}

              <label  className="block form-label  ">Color * (Para seleccionar click en el cuadro)</label>
              <input
                onChange={(e) => setHexa(e.target.value)}
                placeholder="Color hexadecimal"
                id="colohexa"
                type="color"
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

export default ColoresAlta;
