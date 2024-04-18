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

const ProductosEditarStock = () => {
  const [isDark] = useDarkMode();
  
  
  const [codigo, setCodigo] = useState();
  const [stock, setStock] = useState();
  const [apartado, setApartado] = useState();
  const [estropeado, setEstropeado] = useState();
 
  
  const id_stock = localStorage.getItem("EditStock");
  
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


  const getStock = async () => {
    try {
      const res = await clienteAxios.get("/almacen/stock-single/"+id_stock);
      //console.log(res.data.single);
      
      setCodigo(res.data.single.codigo);
      setStock(res.data.single.stock);
      setApartado(res.data.single.apartado);
      setEstropeado(res.data.single.estropeado);
       


    } catch (error) {
      console.log(error);
      mostrarMensaje(error.code);
    }
  };
  
  useEffect(() => {
    getStock();
  },[]);


  const sendData = (event) => {
    event.preventDefault();

    //validamos campos
    const editStock = async () => {
       try {
          const res = await clienteAxios.put("/almacen/stock-editar", {
            id:id_stock,
            stock,
            apartado,
            estropeado
          });
          //console.log(res);
          navigate("/almacenes/ver");
          
        } catch (error) {
          console.log(error);
          mostrarMensaje(error.response.data.msg);
        }
      };
      editStock();
    
  };

   

  return (
    <>
      <ToastContainer />
      <div className="grid xl:grid-cols-2 grid-cols-1 gap-5">
        <Card title="Editar Stock">
          <form onSubmit={(e) => sendData(e)}>
            <div className="space-y-4">
            
              <label>Código: {codigo}</label>  
              {/*Stock*/}
              <Textinput
                onChange={(e) => setStock(e.target.value)}
                label="Stock"
                placeholder="Stock"
                id="stock"
                type="number"
                defaultValue={stock}
              />

              {/*Apartado*/}
              <Textinput
                onChange={(e) => setApartado(e.target.value)}
                label="Apartado"
                placeholder="Apartado"
                id="apartado"
                type="number"
                defaultValue={apartado}
              />

              {/*Estropeado*/}
              <Textinput
                onChange={(e) => setEstropeado(e.target.value)}
                label="Estropeado"
                placeholder="Estropeado"
                id="estropeado"
                type="number"
                defaultValue={estropeado}
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

export default ProductosEditarStock;
