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

const PedidoPagar = () => {
  const [isDark] = useDarkMode();

  const [total, setTotal] = useState();
  const [total_parcialidades, setTotalParcialidades] = useState();

  const [cantidad, setCantidad] = useState();
  
  const id = localStorage.getItem("PaySale");

  const getOrder = async () => {
    try {
      const res = await clienteAxios.get("/pedido/single/"+id);
      //console.log(res.data.single);
      
      setTotal(res.data.single.total);

      let suma_parcialidades = 0;
      for(let i=0;i<res.data.single.parcialidades.length;i++){
        suma_parcialidades = suma_parcialidades + res.data.single.parcialidades[i].importe;
      }

      setTotalParcialidades(suma_parcialidades);
      

    } catch (error) {
      console.log(error);
      mostrarMensaje(error.code);
    }
  };

  useEffect(() => {
    getOrder();
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
    if(cantidad == "" || cantidad == undefined) {
      mostrarMensaje("Debes escribir una cantidad");
    } else {
      const payOrder = async () => {
        try {
          const res = await clienteAxios.put("/pedido/abonar", {
            id:id,
            cantidad
          });
          //console.log(res);
          navigate("/ventas/historial_pedidos");
          
        } catch (error) {
          console.log(error);
          mostrarMensaje(error.response.data.msg);
        }
      };
      payOrder();
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
        <Card title="Agregar Parcialidad">
          <form onSubmit={(e) => sendData(e)}>
            <div className="space-y-4">

             <h4>Pagado: $ {total_parcialidades}</h4> 
             <h4>Total: $ {total}</h4>
             <h4 style={{color:"red"}}>Resta: $ {total-total_parcialidades}</h4>

            
             {/*Nombre*/}
             <Textinput
                onChange={(e) => setCantidad(e.target.value)}
                label="Cantidad *"
                placeholder="Cantidad"
                id="cantidad"
                type="number"
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

export default PedidoPagar;
