import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";

import clienteAxios from "../../configs/axios";

const AlmacenesStockBorrar = () => {
  const id = localStorage.getItem("DeleteStock");
  const nombre_producto = localStorage.getItem("DeleteStockName");
  
  const navigate = useNavigate();

  const deleteStock = async () => {
    try {
      const res = await clienteAxios.post("/almacen/stock-borrar", { id });
      //console.log(res.data);
      toast.success('Stock Borrado', {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "dark",
      });
      navigate("/almacenes/ver");
      
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
    navigate("/almacenes/ver");
  };

  return (
    <>
      <ToastContainer />
      <div className="grid xl:grid-cols-2 grid-cols-1 gap-5">
        <Card title="Borrar Entrada">
          <div className="space-y-4">
            <div className=" space-y-4 text-center">
              <p>¿Seguro que desea borrar la el stock: {id} del producto {nombre_producto}?</p>
              <Button
                text="Borrar"
                onClick={() => deleteStock()}
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

export default AlmacenesStockBorrar;
