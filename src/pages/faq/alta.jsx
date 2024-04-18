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

const FaqAlta = () => {
  const [isDark] = useDarkMode();
  const [pregunta,  setPregunta] = useState();
  const [respuesta, setRespuesta] = useState();
  
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
    if(pregunta == "" || pregunta == undefined) {
      mostrarMensaje("Debes escribir una pregunta");
    }else if(respuesta == "" || respuesta == undefined) {
      mostrarMensaje("Debes escribir una respuesta");
    } else {
      const createFaq = async (dataForm) => {
        try {
          const res = await clienteAxios.post("/faq/crear", dataForm);
          
          //console.log(res);
          navigate("/faq");
          
        } catch (error) {
          console.log(error);
          mostrarMensaje(error.response.data.msg);
        }
      };
      createFaq({ pregunta, respuesta });
    }
  };

  

  return (
    <>
      <ToastContainer />
      <div className="grid xl:grid-cols-2 grid-cols-1 gap-5">
        <Card title="Alta de Faq">
          <form onSubmit={(e) => sendData(e)}>
            <div className="space-y-4">


              {/*pregunta*/}
              <Textarea
                  onChange={(e) => setPregunta(e.target.value)}
                  label="Pregunta *"
                  placeholder="Pregunta"
                  id="pregunta"
                  type="text"
                />

              {/*respuesta*/}
              <Textarea
                  onChange={(e) => setRespuesta(e.target.value)}
                  label="Respuesta *"
                  placeholder="Respuesta"
                  id="respuesta"
                  type="text"
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

export default FaqAlta;
