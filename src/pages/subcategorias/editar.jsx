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

const SubcategoriasEditar = () => {
  const [isDark] = useDarkMode();
  const [nombre, setNombre] = useState();
  const [categoria, setCategoria] = useState();
  
  const [allCategories, setAllCategories] = useState([]);
    
  const id = localStorage.getItem("EditSubcategory");

  const getCategories = async () => {
    try {
      let res = await clienteAxios.get(`/categoria/obtener`);

      //console.log(res.data.categorias);
      let array = [];
      for (let i = 0; i < res.data.categorias.length; i++) {
        //console.log(i);
        array.push({"value":res.data.categorias[i]["nombre"],"label":res.data.categorias[i]["nombre"]});
      }
      setAllCategories(array);
      
    } catch (error) {
      console.log(error);
    }
  };

  const getSubcategory = async () => {
    try {
      const res = await clienteAxios.get("/subcategoria/single/"+id);
      //console.log(res.data.single);
      
      setNombre(res.data.single.nombre);
      
      if(res.data.single.categoria != null){
        setCategoria({
          label: res.data.single.categoria,
          value: res.data.single.categoria,
        }); 
      }  

    } catch (error) {
      console.log(error);
      mostrarMensaje(error.code);
    }
  };

  useEffect(() => {
  getCategories();
  getSubcategory();
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
    }else if(categoria == "" || categoria == undefined) {
      mostrarMensaje("Debes seleccionar una categoría");
    } else {
      const editSubcategory = async () => {
        try {
          const res = await clienteAxios.put("/subcategoria/actualizar", {
            id:id,
            nombre, 
            categoria:categoria.value
          });
          //console.log(res);
          navigate("/subcategorias");
          
        } catch (error) {
          console.log(error);
          mostrarMensaje(error.response.data.msg);
        }
      };
      editSubcategory();
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
        <Card title="Editar Subcategoría">
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

             {/*Tipo Categorias*/}
             <label  className="block capitalize form-label  ">Categoría *</label>
              <Select
                  styles={customStyles}
                  label="Categoría *"
                  placeholder="Seleccione"
                  id="categoria"
                  options={allCategories}
                  value={categoria}
                  onChange={setCategoria}
                  isSearchable={true}
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

export default SubcategoriasEditar;
