import React, { useState, useEffect } from "react";
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

const ColoresEditar = () => {
  const [isDark] = useDarkMode();
  const [nombre, setNombre] = useState();
  const [colorhexa, setHexa] = useState();
      
  const id = localStorage.getItem("EditColor");

  
  const getColor = async () => {
    try {
      const res = await clienteAxios.get("/color/single/"+id);
      //console.log(res.data.single);
      
      setNombre(res.data.single.nombre);
      setHexa(res.data.single.colorhexa);
      
    } catch (error) {
      console.log(error);
      mostrarMensaje(error.code);
    }
  };

  useEffect(() => {
    getColor();
  }, []);

  const navigate = useNavigate();

  const mostrarMensaje = (mensaje) => {
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
  };

  const sendData = (event) => {
    event.preventDefault();

    //validamos campos
    if(nombre == "" || nombre == undefined) {
      mostrarMensaje("Debes escribir al menos un nombre");
    }else if(colorhexa == "" || colorhexa == undefined) {
      mostrarMensaje("Selecciona un color haciendo click en el cuadro");
    } else {
      const editColor = async () => {
        try {
          const res = await clienteAxios.put("/color/actualizar", {
            id:id,
            nombre,
            colorhexa
          });
          //console.log(res);
          navigate("/colores");
          
        } catch (error) {
          console.log(error);
          mostrarMensaje(error.response.data.msg);
        }
      };
      editColor();
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
        <Card title="Editar Color">
          <form onSubmit={(e) => sendData(e)}>
            <div className="space-y-4">
            
             {/*Nombre*/}
             <Textinput
                onChange={(e) => setNombre(e.target.value)}
                label="Nombre *"
                placeholder="Nombre"
                id="nombre"
                type="text"
                defaultValue={nombre}
              />


              {/*Hexa
              <Textinput
                onChange={(e) => setHexa(e.target.value)}
                label="Color hexadecimal *"
                placeholder="Color hexadecimal"
                id="colohexa"
                type="text"
                defaultValue={colorhexa}
              />
              */}
              
              <label  className="block form-label  ">Color * (Para seleccionar click en el cuadro)</label>
              <input
                onChange={(e) => setHexa(e.target.value)}
                placeholder="Color hexadecimal"
                id="colohexa"
                type="color"
              />
              <label  className="block capitalize form-label  ">Color Seleccionado:</label>
              <h6 style={{background:colorhexa, width:"100px", color:"black"}}>{colorhexa}</h6>

                           

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

export default ColoresEditar;
