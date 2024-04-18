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

const UsuariosAlta = () => {
  const [isDark] = useDarkMode();
  const [nombre, setNombre] = useState();
  const [tipo, setTipo] = useState();
  const [correo, setCorreo] = useState();
  const [password, setPassword] = useState();
  const [direccion, setDireccion] = useState();
  const [telefono, setTelefono] = useState();
  const [cumpleanios, setCumpleanios] = useState();

  
  const [allUserTypes, setAllUserTypes] = useState([]);

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

  
  useEffect(() => {
    getUserTypes();
  },[]);

  const sendData = (event) => {
    event.preventDefault();

    //validamos campos
    if(nombre == "" || nombre == undefined) {
      mostrarMensaje("Debes escribir el nombre");
    }else if(tipo == "" || tipo == undefined) {
      mostrarMensaje("Debes seleccionar el tipo de usuario");
    }else if(correo == "" || correo == undefined) {
      mostrarMensaje("Debes escribir un correo");
    }else if(password == "" || password == undefined) {
      mostrarMensaje("Debes escribir una contraseña");    
    } else {
      const createUser = async (dataForm) => {
        try {
          const res = await clienteAxios.post("/usuario/crear", dataForm);
          //console.log(res);
          navigate("/usuarios");
          
        } catch (error) {
          console.log(error);
          mostrarMensaje(error.response.data.msg);
        }
      };
      createUser({ nombre, tipo:tipo.value, correo, password, direccion, telefono, cumpleanios });
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
        <Card title="Alta de Usuarios">
          <form onSubmit={(e) => sendData(e)}>
            <div className="space-y-4">
              {/*Nombre*/}
              <Textinput
                onChange={(e) => setNombre(e.target.value)}
                label="Nombre Completo *"
                placeholder="Nombre Completo"
                id="nombre"
                type="text"
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
              />

              {/*Password*/}
              <Textinput
                onChange={(e) => setPassword(e.target.value)}
                label="Contraseña *"
                placeholder="Contraseña"
                id="passw"
                type="password"
              />

              {/*direccion*/}
              <Textarea
                  onChange={(e) => setDireccion(e.target.value)}
                  label="Dirección"
                  placeholder="Dirección"
                  id="direccion"
                  type="text"
                />


              {/*telefono*/}
              <Textinput
                onChange={(e) => setTelefono(e.target.value)}
                label="Teléfono"
                placeholder="Teléfono"
                id="telefono"
                type="tel"
              />


              {/*Cumpleaños*/}
              <Textinput
                onChange={(e) => setCumpleanios(e.target.value)}
                label="Cumpleaños "
                placeholder="Cumpleaños"
                id="cumpleanios"
                type="date"
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

export default UsuariosAlta;
