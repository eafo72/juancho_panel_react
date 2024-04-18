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

const ProductosEditarEntrada = () => {
  const [isDark] = useDarkMode();
  
  const [producto, setProducto] = useState();
  const [talla, setTalla] = useState();
  const [color, setColor] = useState();
  const [fechaEntrada, setFechaEntrada] = useState();
  const [cantidad, setCantidad] = useState();
  const [cantidadAnterior, setCantidadAnterior] = useState();
  const [proveedor, setProveedor] = useState();
  const [estante, setEstante] = useState();

  const [allShelfs, setAllShelfs] = useState();
  const [allProductsInfo, setAllProductsInfo] = useState();  //contiene toda la informacion de productos
  const [allProducts, setAllProducts] = useState(); //contiene solo el value(codigo) y label(nombre) de productos
  const [allSuppliers, setAllSuppliers] = useState();

  const [allSizes, setAllSizes] = useState();
  const [allColors, setAllColors] = useState();
 

  const id_almacen = localStorage.getItem("ViewStorage");
  const nombre_almacen = localStorage.getItem("ViewStorageName");
  const id_producto = localStorage.getItem("EditStock");
  const id_entrada = localStorage.getItem("EditinStorage");

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

 
  const getEntrada = async () => {
    try {
      const res = await clienteAxios.get("/almacen/entrada-single/"+id_entrada);

      //console.log(res.data.single[0]);
      
      setProducto({
        "value":res.data.single[0].codigo_producto, "label":res.data.single[0].datos_producto.nombre
      });
      setTalla({
        "value":res.data.single[0].codigo_talla, "label":res.data.single[0].datos_talla.nombre
      });
      setColor({
        "value":res.data.single[0].codigo_color, "label":res.data.single[0].datos_color.nombre
      });
      setFechaEntrada(res.data.single[0].fechaEntrada.substr(0,10)); 
      setCantidad(res.data.single[0].cantidad); 
      setCantidadAnterior(res.data.single[0].cantidad); 
      setProveedor({
        "value":res.data.single[0].proveedor, "label":res.data.single[0].proveedor
      });
      setEstante({
        "value":res.data.single[0].estante, "label":res.data.single[0].estante
      });

      

    } catch (error) {
      console.log(error);
      mostrarMensaje(error.code);
    }
  };
  
  useEffect(() => {
    getShelfs();
    getProducts();
    getSuppliers();
    getEntrada();
    
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


  //es para jalar la lista de colores y tallas por primera vez aun no programo como jalarlo
  const setData = () => {
    
    //guardamos los colores y tallas disponibles para el producto actual
    for (let i = 0; i < allProductsInfo?.length; i++) {
      if(allProductsInfo[i].codigo == producto.value){
        setAllColors(allProductsInfo[i].color);
        setAllSizes(allProductsInfo[i].talla);
      }  
    }
    
  }


  const sendData = (event) => {
    event.preventDefault();

    //validamos campos
    const editinStorage = async (dataForm) => {
       try {
          const res = await clienteAxios.put("/almacen/entrada-editar", dataForm);
          //console.log(res);
          navigate("/almacenes/ver");
          
        } catch (error) {
          console.log(error);
          mostrarMensaje(error.response.data.msg);
        }
      };
      editinStorage({ id:id_entrada, producto:producto.value, talla:talla.value, color:color.value, fechaEntrada, cantidad, cantidadAnterior, proveedor:proveedor.value, id_almacen, nombre_almacen, estante:estante.value });
    
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
        <Card title="Editar Entrada">
          <form onSubmit={(e) => sendData(e)}>
            <div className="space-y-4">
            

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
                defaultValue={cantidad}
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

export default ProductosEditarEntrada;
