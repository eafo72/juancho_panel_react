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

const UsuariosEditar = () => {
  const [isDark] = useDarkMode();
  const [nombre, setNombre] = useState();
  const [tipo, setTipo] = useState();
  const [correo, setCorreo] = useState();
  const [direccion, setDireccion] = useState();
  const [telefono, setTelefono] = useState();
  const [cumpleanios, setCumpleanios] = useState();

  const [allUserTypes, setAllUserTypes] = useState([]);

    
  const id = localStorage.getItem("EditUser");

  const getUserTypes = async () => {
    try {
      let res = await clienteAxios.get(`/tipos_usuario/obtener`);

      //console.log(res.data.tipos_usuario);
      let array = [];
      for (let i = 0; i < res.data.tipos_usuario.length; i++) {
        //console.log(i);
        array.push({"value":res.data.tipos_usuario[i]["nombre"],"label":res.data.tipos_usuario[i]["nombre"]});
      }
      setAllUserTypes(array);
      
    } catch (error) {
      console.log(error);
    }
  };


  const getUser = async () => {
    try {
      const res = await clienteAxios.get("/usuario/single/"+id);
      //console.log(res.data.single);
      
      setNombre(res.data.single.nombre);
      if(res.data.single.tipo != null){
        setTipo({
          label: res.data.single.tipo,
          value: res.data.single.tipo,
        }); 
      }  
      setCorreo(res.data.single.correo);
      setDireccion(res.data.single.direccion);
      setTelefono(res.data.single.telefono);
      setCumpleanios(res.data.single.cumpleanios);

    } catch (error) {
      console.log(error);
      mostrarMensaje(error.code);
    }
  };

  useEffect(() => {
    getUserTypes();
    getUser();
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
    if(nombre == "" || nombre == undefined) {
      mostrarMensaje("Debes escribir al menos un nombre");
    }else if(tipo == "" || tipo == undefined) {
      mostrarMensaje("Debes seleccionar el tipo de usuario");
    }else if(correo == "" || correo == undefined) {
      mostrarMensaje("Debes escribir un correo");
    } else {
      const editUser = async () => {
        try {
          const res = await clienteAxios.put("/usuario/actualizar", {
            id:id,
            nombre, 
            tipo:tipo.value, 
            correo,
            direccion,
            telefono,
            cumpleanios
          });
          console.log(res);
          navigate("/usuarios");
          
        } catch (error) {
          console.log(error);
          mostrarMensaje(error.response.data.msg);
        }
      };
      editUser();
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
        <Card title="Editar Usuario">
          <form onSubmit={(e) => sendData(e)}>
            <div className="space-y-4">
            
             {/*Nombre*/}
             <Textinput
                onChange={(e) => setNombre(e.target.value)}
                label="Nombre Completo *"
                placeholder="Nombre Completo"
                id="nombre"
                type="text"
                defaultValue={nombre}
              />

              {/*Tipo Usuario*/}
              <label  className="block capitalize form-label  ">Tipo de Usuario *</label>
              <Select
                  styles={customStyles}
                  label="Tipo de usuario *"
                  placeholder="Seleccione"
                  id="tipo"
                  options={allUserTypes}
                  value={tipo}
                  onChange={setTipo}
                  isSearchable={true}
                ></Select>

              {/*Correo*/}
              <Textinput
                onChange={(e) => setCorreo(e.target.value)}
                label="Correo *"
                placeholder="Correo"
                id="correo"
                type="email"
                defaultValue={correo}
              />


              {/*direccion*/}
              <Textarea
                  onChange={(e) => setDireccion(e.target.value)}
                  label="Dirección"
                  placeholder="Dirección"
                  id="direccion"
                  type="text"
                  dValue={direccion}
                />


              {/*telefono*/}
              <Textinput
                onChange={(e) => setTelefono(e.target.value)}
                label="Teléfono"
                placeholder="Teléfono"
                id="telefono"
                type="tel"
                defaultValue={telefono}
              />


              {/*Cumpleaños*/}
              <Textinput
                onChange={(e) => setCumpleanios(e.target.value)}
                label="Cumpleaños "
                placeholder="Cumpleaños"
                id="cumpleanios"
                type="date"
                defaultValue={cumpleanios}
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

export default UsuariosEditar;
