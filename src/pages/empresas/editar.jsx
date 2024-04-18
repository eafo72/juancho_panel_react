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

const EmpresaEditar = () => {
  const [isDark] = useDarkMode();
  const [slogan, setSlogan] = useState();
  const [aviso, setAviso] = useState();
  const [terminos, setTerminos] = useState();
  
    
  const id = "658c57daea3c61d484acf6fb";  //id de empresa fijo

  const getEmpresa = async () => {
    try {
      const res = await clienteAxios.get("/empresa/single/"+id);
      //console.log(res.data.single);
      
      setSlogan(res.data.single.slogan);
      setAviso(res.data.single.aviso);
      setTerminos(res.data.single.terminos);
      

    } catch (error) {
      console.log(error);
      mostrarMensaje(error.code);
    }
  };

  useEffect(() => {
  getEmpresa();
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

   
    const editEmpresa = async (dataForm) => {
        try {

          const res = await clienteAxios.put("/empresa/actualizar", dataForm);  

          //console.log(res);
          //navigate("/faq");
          mostrarAviso("Datos guardados");

          
        } catch (error) {
          console.log(error);
          mostrarMensaje(error.response.data.msg);
        }
      };
      editEmpresa({
        id:id,
        slogan, 
        aviso,
        terminos
      });
   
  };

  return (
    <>
      <ToastContainer />
      <div className="grid xl:grid-cols-2 grid-cols-1 gap-5">
        <Card title="Editar Empresa">
          <form onSubmit={(e) => sendData(e)}>
            <div className="space-y-4">
            
              {/*slogan*/}
              <Textinput
                onChange={(e) => setSlogan(e.target.value)}
                label="Slogan"
                placeholder="Slogan"
                id="slogan"
                type="text"
                defaultValue={slogan}
              />
            
             {/*aviso
             <Textarea
                  onChange={(e) => setAviso(e.target.value)}
                  label="Aviso de Privacidad"
                  placeholder="Aviso de Privacidad"
                  id="aviso"
                  type="text"
                  dValue={aviso}
                />

              
              <Textarea
                  onChange={(e) => setTerminos(e.target.value)}
                  label="Términos y Condiciones"
                  placeholder="Términos y Condiciones"
                  id="terminos"
                  type="text"
                  dValue={terminos}
                />
                */}  
               

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

export default EmpresaEditar;
