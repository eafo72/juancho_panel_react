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

const SeoEditar = () => {
  const [isDark] = useDarkMode();
  const [title, setTitle] = useState();
  const [words, setWords] = useState();
  const [description, setDescription] = useState();
  
    
  const id = "658db30b8b40c216d72c8278"; //id fijo

  const getSeo = async () => {
    try {
      const res = await clienteAxios.get("/seo/single/"+id);
      //console.log(res.data.single);
      
      setTitle(res.data.single.title);
      setWords(res.data.single.words);
      setDescription(res.data.single.description);
      

    } catch (error) {
      console.log(error);
      mostrarMensaje(error.code);
    }
  };

  useEffect(() => {
    getSeo();
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

  const mostrarAviso = (mensaje) => {
    toast.success(mensaje, {
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

    
    const editSeo = async (dataForm) => {
        try {

          const res = await clienteAxios.put("/seo/actualizar", dataForm);  

          //console.log(res);
          mostrarAviso("Datos guardados");
          
        } catch (error) {
          console.log(error);
          mostrarMensaje(error.response.data.msg);
        }
    };

      editSeo({
        id:id,
        title, 
        words,
        description
      });
    
  };

  return (
    <>
      <ToastContainer />
      <div className="grid xl:grid-cols-2 grid-cols-1 gap-5">
        <Card title="Editar Seo">
          <form onSubmit={(e) => sendData(e)}>
            <div className="space-y-4">
            
            
             {/*Title*/}
             <Textinput
                onChange={(e) => setTitle(e.target.value)}
                label="Título"
                placeholder="Título"
                id="titulo"
                type="text"
                defaultValue={title}
              />


              {/*Words*/}
             <Textinput
                onChange={(e) => setWords(e.target.value)}
                label="Palabras clave (separadas por coma)"
                placeholder="Palabras clave (separadas por coma)"
                id="words"
                type="text"
                defaultValue={words}
              />


              {/*Description*/}
             <Textinput
                onChange={(e) => setDescription(e.target.value)}
                label="Descripción"
                placeholder="Descripción"
                id="descripcion"
                type="text"
                defaultValue={description}
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

export default SeoEditar;
