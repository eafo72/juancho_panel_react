import React, { useState, useEffect } from "react";
import Barcode from 'react-barcode';
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

const ProductosEditar = () => {
  const [isDark] = useDarkMode();
  
  const [nombre, setNombre] = useState();
  const [codigo, setCodigo] = useState();
  const [talla, setTalla] = useState();
  const [color, setColor] = useState();

  const [availableSizes, setAvailableSizes] = useState();
  const [availableColors, setAvailableColors] = useState();

  const [barcode_value, setBarcodeValue] = useState(" ");
  const [barcode_status, setBarcodeStatus] = useState(false);

  const id = localStorage.getItem("BarcodeProduct");

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

  
  

  const getProduct = async () => {
    try {
      const res = await clienteAxios.get("/producto/single/"+id);
      //console.log(res.data.single);
      
      setNombre(res.data.single.nombre);
      setCodigo(res.data.single.codigo);
      setAvailableSizes(res.data.single.talla);
      setAvailableColors(res.data.single.color);
    

    } catch (error) {
      console.log(error);
      mostrarMensaje(error.code);
    }
  };
  
  useEffect(() => {
    getProduct();
  },[]);

  const onPrintBarcode = () => {
    var container = document.getElementById("div-svg");
    var mySVG = document.getElementById("barcode-canvas");
    var width = "100%";
    var height = "100%";
    //var printWindow = window.open('', 'PrintMap','width=' + width + ',height=' + height);
    var printWindow = window.open('', 'PrintMap');
    printWindow.document.writeln(container.innerHTML);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  }

  const sendData = (event) => {
    event.preventDefault();

    //validamos campos
    if(talla == "" || talla == undefined) {
      mostrarMensaje("Debes seleccionar una talla");        
    }else if(color == "" || color == undefined) {
      mostrarMensaje("Debes seleccionar un color");          
    } else {
     
      const  main_code = codigo+"-"+talla.value+"-"+color.value;
      setBarcodeValue(main_code);
      setBarcodeStatus(true);


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
        <Card title={"Generar Barcode de "+nombre}>
          <form onSubmit={(e) => sendData(e)}>
            <div className="space-y-4">
            

              {/*Talla*/}
              <label  className="block capitalize form-label  ">Talla *</label>
              <Select
                  styles={customStyles}
                  label="Talla *"
                  placeholder="Seleccione"
                  id="talla"
                  options={availableSizes}
                  value={talla}
                  onChange={setTalla}
                  isSearchable={true}
                ></Select>

              {/*Color*/}
              <label  className="block capitalize form-label  ">Color *</label>
              <Select
                  styles={customStyles}
                  label="Color *"
                  placeholder="Seleccione"
                  id="color"
                  options={availableColors}
                  value={color}
                  onChange={setColor}
                  isSearchable={true}
                ></Select>

             

              <div className=" space-y-4">
                <p>* Campos requeridos</p>
                <Button text="Generar" type="submit" className="btn-dark" />
              </div>
            </div>
          </form>
          <div style={barcode_status == true ? {display:"block"} : {display:"none"} } className="mt-4" >
            <div id="div-svg">
              <Barcode value={barcode_value} />
            </div>  
            <Button text="Imprimir" onClick={(e) => onPrintBarcode()} className="btn-dark mt-4" />
          </div>  
        </Card>
      </div>
    </>
  );
};

export default ProductosEditar;
