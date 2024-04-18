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

const CategoriasEditar = () => {
  const [isDark] = useDarkMode();
  const [nombre, setNombre] = useState();
  const [image, setImage] = useState();

  const [indexViewUp, setIndexViewUp] = useState();
  const [indexViewDown, setIndexViewDown] = useState();

  const allViewOptions = [
    { value: "Sí", label: "Sí" },
    { value: "No", label: "No" }
  ];
  
    
  const id = localStorage.getItem("EditCategory");

  const getCategory = async () => {
    try {
      const res = await clienteAxios.get("/categoria/single/"+id);
      //console.log(res.data.single);
      
      setNombre(res.data.single.nombre);

      if(res.data.single.indexViewUp != null){
        setIndexViewUp({
          label: res.data.single.indexViewUp,
          value: res.data.single.indexViewUp,
        }); 
      }  

      if(res.data.single.indexViewDown != null){
        setIndexViewDown({
          label: res.data.single.indexViewDown,
          value: res.data.single.indexViewDown,
        }); 
      }  

      
      

    } catch (error) {
      console.log(error);
      mostrarMensaje(error.code);
    }
  };

  useEffect(() => {
  getCategory();
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
      mostrarMensaje("Debes escribir el nombre");
    }else if(indexViewUp == "" || indexViewUp == undefined) {
      mostrarMensaje("Debes seleccionar una opcion de la penúltima pregunta");
    }else if(indexViewDown == "" || indexViewDown == undefined) {
      mostrarMensaje("Debes seleccionar una opcion de la última pregunta");
    } else {
      const editCategory = async (dataForm) => {
        try {

          const res = await clienteAxios({
            method: "put",
            url: "/categoria/actualizar",
            data: dataForm,
            headers: { "Content-Type": "multipart/form-data" },
          });

          //console.log(res);
          navigate("/categorias");
          
        } catch (error) {
          console.log(error);
          mostrarMensaje(error.response.data.msg);
        }
      };
      editCategory({
        id:id,
        nombre, 
        image,
        indexViewUp:indexViewUp.value, 
        indexViewDown:indexViewDown.value
      });
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
        <Card title="Editar Categoría">
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

              {/*Imagen*/}
              <Textinput
                onChange={(e) => setImage(e.target.files[0])}
                label="Imagen *"
                placeholder="Imagen"
                id="imagen"
                type="file"
              />

              {/*indexViewUp*/}
              <label  className="block capitalize form-label  ">Aparece en categorías del index *</label>
              <Select
                  styles={customStyles}
                  placeholder="Seleccione"
                  id="indexViewUp"
                  options={allViewOptions}
                  value={indexViewUp}
                  onChange={setIndexViewUp}
              ></Select>

              {/*indexViewDown*/}
              <label  className="block capitalize form-label  ">Aparece en la sección del index arriba del footer *</label>
              <Select
                  styles={customStyles}
                  placeholder="Seleccione"
                  id="indexViewDown"
                  options={allViewOptions}
                  value={indexViewDown}
                  onChange={setIndexViewDown}
              ></Select>
               

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

export default CategoriasEditar;
