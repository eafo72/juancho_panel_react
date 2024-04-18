import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Icon from "@/components/ui/Icon";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";

import clienteAxios from "../../configs/axios";

const FotosProductsBorrar = () => {
  const [foto, setFoto] = useState({});

  const id = localStorage.getItem("PhotoProduct");
  const photoindex = localStorage.getItem("DeletePhoto");

  const navigate = useNavigate();

  const getFoto = async () => {
    try {
      const res = await clienteAxios.get("/producto/single/"+id);
      //console.log(res.data.single.fotos_carrusel[photoindex]);
      
      setFoto(res.data.single.fotos_carrusel[photoindex]);

    } catch (error) {
      console.log(error);
      toast.error(error.code, {
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
  };

  useEffect(() => {
    getFoto();
  }, []);

  const deleteFoto = async () => {
    try {
      const res = await clienteAxios.post("/producto/borrar-foto", { id, photoindex });
      //console.log(res);
      toast.success("Foto borrada", {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "dark",
      });
      regresar();
    } catch (error) {
      console.log(error);
      toast.error(error.code, {
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
  };

  const regresar = () => {
    navigate("/productos/alta_foto");
  };

  return (
    <>
      <ToastContainer />
      <div className="grid xl:grid-cols-2 grid-cols-1 gap-5">
        <Card title="Foto">
          
          
              
                <img
                  alt={foto.image}
                  src={foto.image}
                  className="w-full h-full"
                />
              
          
        </Card>
        <Card title="Borrar Foto">
          <div className="space-y-4">
            <div className=" space-y-4 text-center">
              <p>¿Desea borrar la foto?</p>
              <Button
                text="Borrar"
                onClick={() => deleteFoto()}
                className="btn-danger m-5"
              />
              <Button
                text="Regresar"
                onClick={() => regresar()}
                className="btn-dark m-5"
              />
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default FotosProductsBorrar;
