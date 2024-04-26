import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Modal from "@/components/ui/Modal";
import Select from "react-select";
import Button from "@/components/ui/Button";
import useDarkMode from "@/hooks/useDarkMode";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";

import clienteAxios from "../../configs/axios";

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${year}-${month}-${date}`;
}

const AlmacenEntradaAlta = () => {
  const [isDark] = useDarkMode();

  const [producto, setProducto] = useState();
  const [talla, setTalla] = useState();
  const [color, setColor] = useState();
  const [fechaEntrada, setFechaEntrada] = useState(getDate());
  const [cantidad, setCantidad] = useState();
  const [proveedor, setProveedor] = useState();
  const [estante, setEstante] = useState();

  const [allShelfs, setAllShelfs] = useState();
  const [allProductsInfo, setAllProductsInfo] = useState();  //contiene toda la informacion de productos
  const [allProducts, setAllProducts] = useState(); //contiene solo el value(codigo) y label(nombre) de productos
  const [allSuppliers, setAllSuppliers] = useState();

  const [allSizes, setAllSizes] = useState();
  const [allColors, setAllColors] = useState();

  const [modalStatus, setModalStatus] = useState(false);
  

  const id_almacen = localStorage.getItem("ViewStorage");
  const nombre_almacen = localStorage.getItem("ViewStorageName");
  
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


  const getShelfs = async () => {
    try {

      const res = await clienteAxios.get("/almacen/single/"+id_almacen);
      //console.log(res.data.single);

      let array = [];
      for (let i = 0; i < res.data.single.estantes.length; i++) {
        //console.log(i);
        array.push({"value":res.data.single.estantes[i]["nombre"],"label":res.data.single.estantes[i]["nombre"]});
      }
      
      setAllShelfs(array);

    } catch (error) {
      console.log(error);
    }
  };


  const getProducts = async () => {
    try {
      let res = await clienteAxios.get(`/producto/obtener`);

      //console.log(res.data.productos);
      setAllProductsInfo(res.data.productos);

      let array = [];
      for (let i = 0; i < res.data.productos.length; i++) {
        //console.log(i);
        array.push({"value":res.data.productos[i]["codigo"],"label":res.data.productos[i]["nombre"]+"/"+res.data.productos[i]["marca"]});
      }
      setAllProducts(array);
      
    } catch (error) {
      console.log(error);
    }
  };

  const getSuppliers = async () => {
    try {
      let res = await clienteAxios.get(`/proveedor/obtener`);

      //console.log(res.data.proveedores);
      let array = [];
      for (let i = 0; i < res.data.proveedores.length; i++) {
        //console.log(i);
        array.push({"value":res.data.proveedores[i]["nombre"],"label":res.data.proveedores[i]["nombre"]});
      }
      setAllSuppliers(array);
      
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    getShelfs();
    getProducts();
    getSuppliers();
  }, []);


  const handleChange = (event) => {
    //console.log(event);
    setProducto({"value":event.value,"label":event.label});
    
    
    for (let i = 0; i < allProductsInfo.length; i++) {
        if(allProductsInfo[i].codigo == event.value){
          setAllColors(allProductsInfo[i].color);
          setAllSizes(allProductsInfo[i].talla);
        }  
    }
    

  };

  const clearForm = () =>{

    setModalStatus(false)

    document.getElementById("codigo").value = "";
    setProducto(null);
    setTalla(null);
    setColor(null);
    setCantidad(null);
    document.getElementById("cantidad").value = null;
    setProveedor(null);
    setEstante(null);
  }

  const setfillBlanks = (value) => {
    const combo = value.split("-");
    const product_code = combo[0];
    const size_code = combo[1];
    const color_code = combo[2];

    for (let i = 0; i < allProductsInfo.length; i++) {
      if(allProductsInfo[i].codigo == product_code){

        //producto
        setProducto({"value":product_code, "label": allProductsInfo[i].nombre+'/'+allProductsInfo[i].marca});
        
        for (let i = 0; i < allProductsInfo.length; i++) {
          if(allProductsInfo[i].codigo == product_code){
            setAllColors(allProductsInfo[i].color);
            setAllSizes(allProductsInfo[i].talla);
          }  
        }


        //talla
        for (let ii = 0; ii < allProductsInfo[i].talla.length; ii++) {
          if(allProductsInfo[i].talla[ii].value == size_code){
            setTalla({"value":size_code, "label": allProductsInfo[i].talla[ii].label });
          }
        }  

        //color
        for (let iii = 0; iii < allProductsInfo[i].color.length; iii++) {
          if(allProductsInfo[i].color[iii].value == color_code){
            setColor({"value":color_code, "label": allProductsInfo[i].color[iii].label });
          }
        }  
       
      }  
    }
    
  
  };

  

  const sendData = (event) => {
    event.preventDefault();

    //validamos campos
    if(producto == "" || producto == undefined) {
      mostrarMensaje("Debes seleccionar el producto");
    }else if(talla == "" || talla == undefined) {
      mostrarMensaje("Debes seleccionar una talla");
    }else if(color == "" || color == undefined) {
      mostrarMensaje("Debes seleccionar un color");  
    }else if(fechaEntrada == "" || fechaEntrada == undefined) {
        mostrarMensaje("Debes seleccionar una fecha");
    }else if(cantidad == "" || cantidad == undefined) {
        mostrarMensaje("Debes escribir una cantidad");
    }else if(proveedor == "" || proveedor == undefined) {
        mostrarMensaje("Debes seleccionar una proveedor");    
    }else if(estante == "" || estante == undefined) {
        mostrarMensaje("Debes seleccionar una estante");    
    } else {
      const createinStorage = async (dataForm) => {
        try {
          const res = await clienteAxios.post("/almacen/entrada-alta", dataForm);
          
          //console.log(res);
          //navigate("/almacenes/ver");
          setModalStatus(true);
          
          
        } catch (error) {
          console.log(error);
          mostrarMensaje(error.response.data.msg);
        }
      };
      createinStorage({ producto:producto.value, talla:talla.value, color:color.value, fechaEntrada, cantidad, proveedor:proveedor.value, id_almacen, nombre_almacen, estante:estante.value });
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
      <Modal
        title="¿Deseas dar de alta otra entrada?"
        labelclassName="btn-outline-dark"
        activeModal={modalStatus}
        onClose={() =>
          clearForm()
        }
      >
          <div className="ltr:text-right rtl:text-left">
            <button onClick={() => clearForm() } className="btn btn-success  text-center m-4">Sí</button>
            <button onClick={() => navigate("/almacenes/ver") } className="btn btn-danger  text-center m-4">No</button>
          </div>
        
      </Modal>

      <div className="grid xl:grid-cols-2 grid-cols-1 gap-5">
        <Card title="Alta de Entrada al Almacén">
          <form onSubmit={(e) => sendData(e)}>
            <div className="space-y-4">


              {/*Codigo*/}
              <Textinput
                onChange={(e) => setfillBlanks(e.target.value)}
                placeholder="Código"
                id="codigo"
                type="text"
              />


              {/*Producto*/}
              <label  className="block capitalize form-label  ">Producto *</label>
              <Select
                  styles={customStyles}
                  label="Producto *"
                  placeholder="Seleccione"
                  id="producto"
                  options={allProducts}
                  value={producto}
                  onChange={handleChange}
                  isSearchable={true}
              ></Select>

                <button onClick={() => 
                {
                  localStorage.setItem("addProductCallbackTo", "almacen");
                  navigate("/productos/alta")
                } } type="button" className="btn btn-success text-center">Nuevo Producto</button>

              {/*Talla*/}
              <label  className="block capitalize form-label  ">Talla *</label>
              <Select
                  styles={customStyles}
                  label="Talla *"
                  placeholder="Seleccione"
                  id="talla"
                  options={allSizes}
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
                  options={allColors}
                  value={color}
                  onChange={setColor}
                  isSearchable={true}
              ></Select>



              {/*Fecha de Entrada*/}
              <Textinput
                onChange={(e) => setFechaEntrada(e.target.value)}
                label="Fecha de Entrada *"
                placeholder="Fecha de Entrada"
                id="fechaEntrada"
                type="date"
                defaultValue={fechaEntrada}
              />

              {/*Cantidad*/}
              <Textinput
                onChange={(e) => setCantidad(e.target.value)}
                label="Cantidad*"
                placeholder="Cantidad"
                id="cantidad"
                type="number"
              />

              {/*Proveedor*/}
              <label  className="block capitalize form-label  ">Proveedor *</label>
                <Select
                  styles={customStyles}
                  label="Proveedor *"
                  placeholder="Seleccione"
                  id="proveedor"
                  options={allSuppliers}
                  value={proveedor}
                  onChange={setProveedor}
                  isSearchable={true}
              ></Select>

              {/*Estante*/}
              <label  className="block capitalize form-label  ">Estante *</label>
                <Select
                  styles={customStyles}
                  label="Estante *"
                  placeholder="Seleccione"
                  id="estante"
                  options={allShelfs}
                  value={estante}
                  onChange={setEstante}
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

export default AlmacenEntradaAlta;
