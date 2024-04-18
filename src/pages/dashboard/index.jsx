import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import Card from "@/components/ui/Card";
import useDarkMode from "@/hooks/useDarkMode";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";

import { Chart } from "react-google-charts";

import { useNavigate } from "react-router-dom";

import clienteAxios from "../../configs/axios";
import { UserContext } from "../context/userContext";

import Datepicker from "react-tailwindcss-datepicker";

const Dashboard = () => {
  const [isDark] = useDarkMode();

  const options = [
    { value: "Todo", label: "Todo" },
    { value: "Tienda online", label: "Ecommerce" },
    { value: "Mostrador", label: "Punto de Venta" }
  ];

  const [opcionGeneral, setOpcionGeneral] = useState({ value: "Todo", label: "Todo" });

  //ojo rango de fechas fijo de 1 de Dic de 2023 al 31 Dic 2025

  const fechaEnRango = (fecha, fechaInicio, fechaFin) => {
    return (fecha >= fechaInicio && fecha <= fechaFin);
  }
  
  const [ventas2023, setVentas2023] = useState([]);
  const [ventas2024, setVentas2024] = useState([]);
  const [ventas2025, setVentas2025] = useState([]);

  const [numeroPedidosPagados, setNumeroPedidosPagados] = useState(0);
  const [numeroPedidosPendientes, setNumeroPedidosPendientes] = useState(0);


  const [ventasTotales, setVentasTotales] = useState(0);
  const [ventasPendientes, setVentasPendientes] = useState(0);

  const [ventasAPagosPendiente, setVentasAPagosPendiente] = useState(0);
  const [ventasAPagosAbonos, setVentasAPagosAbonos] = useState(0);

  
  const [productos, setVentasProducto] = useState([]);

  const userCtx = useContext(UserContext);
  const { user } = userCtx;

  const navigate = useNavigate();
  
  //datepicker setup
  const today = new Date();
     
  const [value, setValue] = useState({
    startDate: new Date(today.getFullYear(), today.getMonth(), "01"),
    endDate: new Date(today.getFullYear(), today.getMonth()+1, 0)
  });

  const handleValueChange = newValue => {
    //console.log("newValue:", newValue);
    setValue(newValue);
    getOrders(new Date(newValue.startDate), new Date(newValue.endDate));
  };

 
  const getOrders = async (inicio,final) => {
    setVentas2023([]);
    setVentas2024([]);
    setVentas2025([]);
    setVentasProducto([]);

    //const fecha_inicial = inicio.getFullYear() + "-" + ("0"+(inicio.getMonth()+1)).slice(-2) + "-" + ("0" + inicio.getDate()).slice(-2); 
    //const fecha_final = final.getFullYear() + "-" + ("0"+(final.getMonth()+1)).slice(-2) + "-" + ("0" + final.getDate()).slice(-2);     
    
    try {
      
      let res = await clienteAxios.get(`/pedido/ventas`);
      //console.log(res.data.ventas);

      //VENTAS
      let array_ventas2023 = [["2023", "Total", {role:"style"}]];
      let array_ventas2024 = [["2024", "Total", {role:"style"}]];
      let array_ventas2025 = [["2025", "Total", {role:"style"}]];

      //2023
      let suma_ventas_dic2023 = 0;

      //2024
      let suma_ventas_ene2024 = 0;
      let suma_ventas_feb2024 = 0;
      let suma_ventas_mar2024 = 0;
      let suma_ventas_abr2024 = 0;
      let suma_ventas_may2024 = 0;
      let suma_ventas_jun2024 = 0;
      let suma_ventas_jul2024 = 0;
      let suma_ventas_ago2024 = 0;
      let suma_ventas_sep2024 = 0;
      let suma_ventas_oct2024 = 0;
      let suma_ventas_nov2024 = 0;
      let suma_ventas_dic2024 = 0;

      //2025
      let suma_ventas_ene2025 = 0;
      let suma_ventas_feb2025 = 0;
      let suma_ventas_mar2025 = 0;
      let suma_ventas_abr2025 = 0;
      let suma_ventas_may2025 = 0;
      let suma_ventas_jun2025 = 0;
      let suma_ventas_jul2025 = 0;
      let suma_ventas_ago2025 = 0;
      let suma_ventas_sep2025 = 0;
      let suma_ventas_oct2025 = 0;
      let suma_ventas_nov2025 = 0;
      let suma_ventas_dic2025 = 0;


      let total_numero_pedidos_pagados = 0;
      let total_numero_pedidos_pendientes = 0;

      
      let suma_ventas_totales = 0;
      let suma_ventas_pendientes = 0;

      let suma_ventas_a_pagos_abonos = 0;
      let suma_ventas_a_pagos_restante = 0;

      for(let i=0;i<res.data.ventas.length;i++){

        //console.log(res.data.ventas[i]);
        //console.log(opcionGeneral);

        if(opcionGeneral.value == "Todo" || res.data.ventas[i]['tipo_venta'] == opcionGeneral.value){
        
          for(let ii=0;ii<res.data.ventas[i]['descripcion'].length;ii++){ 
          
          const fecha_pedido = new Date(res.data.ventas[i].fecha);

          //formateamos fecha a dd/mm/yyyy
          const combo_fecha = (res.data.ventas[i].fecha).split("-");
          
          const mes =  parseInt(combo_fecha[1]);
          const year = parseInt(combo_fecha[0]);

          //2023
          if((inicio.getTime() <= (fecha_pedido.getTime())) && (final.getTime() >= fecha_pedido.getTime()) && mes == 12 && year == 2023 && res.data.ventas[i].estatus_pago == "Pagado"){
            suma_ventas_dic2023 = suma_ventas_dic2023 + res.data.ventas[i]['descripcion'][ii].total;
          }  
          
          //2024
          if((inicio.getTime() <= (fecha_pedido.getTime())) && (final.getTime() >= fecha_pedido.getTime()) && mes == 1 && year == 2024 && res.data.ventas[i].estatus_pago == "Pagado"){
            suma_ventas_ene2024 = suma_ventas_ene2024 + res.data.ventas[i]['descripcion'][ii].total;
          }  

          if((inicio.getTime() <= (fecha_pedido.getTime())) && (final.getTime() >= fecha_pedido.getTime()) && mes == 2 && year == 2024 && res.data.ventas[i].estatus_pago == "Pagado"){
            suma_ventas_feb2024 = suma_ventas_feb2024 + res.data.ventas[i]['descripcion'][ii].total;
          }  

          if((inicio.getTime() <= (fecha_pedido.getTime())) && (final.getTime() >= fecha_pedido.getTime()) && mes == 3 && year == 2024 && res.data.ventas[i].estatus_pago == "Pagado"){
            suma_ventas_mar2024 = suma_ventas_mar2024 + res.data.ventas[i]['descripcion'][ii].total;
          }  

          if((inicio.getTime() <= (fecha_pedido.getTime())) && (final.getTime() >= fecha_pedido.getTime()) && mes == 4 && year == 2024 && res.data.ventas[i].estatus_pago == "Pagado"){
            suma_ventas_abr2024 = suma_ventas_abr2024 + res.data.ventas[i]['descripcion'][ii].total;
          }  


          if((inicio.getTime() <= (fecha_pedido.getTime())) && (final.getTime() >= fecha_pedido.getTime()) && mes == 5 && year == 2024 && res.data.ventas[i].estatus_pago == "Pagado"){
            suma_ventas_may2024 = suma_ventas_may2024 + res.data.ventas[i]['descripcion'][ii].total;
          }  

          if((inicio.getTime() <= (fecha_pedido.getTime())) && (final.getTime() >= fecha_pedido.getTime()) && mes == 6 && year == 2024 && res.data.ventas[i].estatus_pago == "Pagado"){
            suma_ventas_jun2024 = suma_ventas_jun2024 + res.data.ventas[i]['descripcion'][ii].total;
          }  

          if((inicio.getTime() <= (fecha_pedido.getTime())) && (final.getTime() >= fecha_pedido.getTime()) && mes == 7 && year == 2024 && res.data.ventas[i].estatus_pago == "Pagado"){
            suma_ventas_jul2024 = suma_ventas_jul2024 + res.data.ventas[i]['descripcion'][ii].total;
          }  

          if((inicio.getTime() <= (fecha_pedido.getTime())) && (final.getTime() >= fecha_pedido.getTime()) && mes == 8 && year == 2024 && res.data.ventas[i].estatus_pago == "Pagado"){
            suma_ventas_ago2024 = suma_ventas_ago2024 + res.data.ventas[i]['descripcion'][ii].total;
          }  

          if((inicio.getTime() <= (fecha_pedido.getTime())) && (final.getTime() >= fecha_pedido.getTime()) && mes == 9 && year == 2024 && res.data.ventas[i].estatus_pago == "Pagado"){
            suma_ventas_sep2024 = suma_ventas_sep2024 + res.data.ventas[i]['descripcion'][ii].total;
          }  

          if((inicio.getTime() <= (fecha_pedido.getTime())) && (final.getTime() >= fecha_pedido.getTime()) && mes == 10 && year == 2024 && res.data.ventas[i].estatus_pago == "Pagado"){
            suma_ventas_oct2024 = suma_ventas_oct2024 + res.data.ventas[i]['descripcion'][ii].total;
          }  
          
          if((inicio.getTime() <= (fecha_pedido.getTime())) && (final.getTime() >= fecha_pedido.getTime()) && mes == 11 && year == 2024 && res.data.ventas[i].estatus_pago == "Pagado"){
            suma_ventas_nov2024 = suma_ventas_nov2024 + res.data.ventas[i]['descripcion'][ii].total;
          }  

          if((inicio.getTime() <= (fecha_pedido.getTime())) && (final.getTime() >= fecha_pedido.getTime()) && mes == 12 && year == 2024 && res.data.ventas[i].estatus_pago == "Pagado"){
            suma_ventas_dic2024 = suma_ventas_dic2024 + res.data.ventas[i]['descripcion'][ii].total;
          } 
           

          //2025
          if((inicio.getTime() <= (fecha_pedido.getTime())) && (final.getTime() >= fecha_pedido.getTime()) && mes == 1 && year == 2025 && res.data.ventas[i].estatus_pago == "Pagado"){
            suma_ventas_ene2025 = suma_ventas_ene2025 + res.data.ventas[i]['descripcion'][ii].total;
          }  

          if((inicio.getTime() <= (fecha_pedido.getTime())) && (final.getTime() >= fecha_pedido.getTime()) && mes == 2 && year == 2025 && res.data.ventas[i].estatus_pago == "Pagado"){
            suma_ventas_feb2025 = suma_ventas_feb2025 + res.data.ventas[i]['descripcion'][ii].total;
          }  

          if((inicio.getTime() <= (fecha_pedido.getTime())) && (final.getTime() >= fecha_pedido.getTime()) && mes == 3 && year == 2025 && res.data.ventas[i].estatus_pago == "Pagado"){
            suma_ventas_mar2025 = suma_ventas_mar2025 + res.data.ventas[i]['descripcion'][ii].total;
          }  

          if((inicio.getTime() <= (fecha_pedido.getTime())) && (final.getTime() >= fecha_pedido.getTime()) && mes == 4 && year == 2025 && res.data.ventas[i].estatus_pago == "Pagado"){
            suma_ventas_abr2025 = suma_ventas_abr2025 + res.data.ventas[i]['descripcion'][ii].total;
          }  

          if((inicio.getTime() <= (fecha_pedido.getTime())) && (final.getTime() >= fecha_pedido.getTime()) && mes == 5 && year == 2025 && res.data.ventas[i].estatus_pago == "Pagado"){
            suma_ventas_may2025 = suma_ventas_may2025 + res.data.ventas[i]['descripcion'][ii].total;
          }  

          if((inicio.getTime() <= (fecha_pedido.getTime())) && (final.getTime() >= fecha_pedido.getTime()) && mes == 6 && year == 2025 && res.data.ventas[i].estatus_pago == "Pagado"){
            suma_ventas_jun2025 = suma_ventas_jun2025 + res.data.ventas[i]['descripcion'][ii].total;
          }  

          if((inicio.getTime() <= (fecha_pedido.getTime())) && (final.getTime() >= fecha_pedido.getTime()) && mes == 7 && year == 2025 && res.data.ventas[i].estatus_pago == "Pagado"){
            suma_ventas_jul2025 = suma_ventas_jul2025 + res.data.ventas[i]['descripcion'][ii].total;
          }  

          if((inicio.getTime() <= (fecha_pedido.getTime())) && (final.getTime() >= fecha_pedido.getTime()) && mes == 8 && year == 2025 && res.data.ventas[i].estatus_pago == "Pagado"){
            suma_ventas_ago2025 = suma_ventas_ago2025 + res.data.ventas[i]['descripcion'][ii].total;
          }  

          if((inicio.getTime() <= (fecha_pedido.getTime())) && (final.getTime() >= fecha_pedido.getTime()) && mes == 9 && year == 2025 && res.data.ventas[i].estatus_pago == "Pagado"){
            suma_ventas_sep2025 = suma_ventas_sep2025 + res.data.ventas[i]['descripcion'][ii].total;
          }  

          if((inicio.getTime() <= (fecha_pedido.getTime())) && (final.getTime() >= fecha_pedido.getTime()) && mes == 10 && year == 2025 && res.data.ventas[i].estatus_pago == "Pagado"){
            suma_ventas_oct2025 = suma_ventas_oct2025 + res.data.ventas[i]['descripcion'][ii].total;
          }  
          
          if((inicio.getTime() <= (fecha_pedido.getTime())) && (final.getTime() >= fecha_pedido.getTime()) && mes == 11 && year == 2025 && res.data.ventas[i].estatus_pago == "Pagado"){
            suma_ventas_nov2025 = suma_ventas_nov2025 + res.data.ventas[i]['descripcion'][ii].total;
          }  

          if((inicio.getTime() <= (fecha_pedido.getTime())) && (final.getTime() >= fecha_pedido.getTime()) && mes == 12 && year == 2025 && res.data.ventas[i].estatus_pago == "Pagado"){
            suma_ventas_dic2025 = suma_ventas_dic2025 + res.data.ventas[i]['descripcion'][ii].total;
          }



          if( (inicio.getTime() <= (fecha_pedido.getTime())) && (final.getTime() >= fecha_pedido.getTime()) && res.data.ventas[i].estatus_pago == "Pagado"){
            total_numero_pedidos_pagados++;
            suma_ventas_totales = suma_ventas_totales + res.data.ventas[i]['descripcion'][ii].total 
          }

          if( (inicio.getTime() <= (fecha_pedido.getTime())) && (final.getTime() >= fecha_pedido.getTime()) && res.data.ventas[i].estatus_pago == "Pendiente"){
            total_numero_pedidos_pendientes++;
            suma_ventas_pendientes = suma_ventas_pendientes + res.data.ventas[i]['descripcion'][ii].total 

            //suma de las parcialidades
            let total_parcialidades = 0;
            for(let x = 0; x < res.data.ventas[i]['parcialidades'].length; x++ ){

              total_parcialidades = total_parcialidades + res.data.ventas[i]['parcialidades'][x].importe
               
            }
            suma_ventas_a_pagos_abonos = suma_ventas_a_pagos_abonos + total_parcialidades
            suma_ventas_a_pagos_restante = suma_ventas_a_pagos_restante + (res.data.ventas[i]['descripcion'][ii].total - total_parcialidades)

           
          }

          }

        }
      }

      if(fechaEnRango(new Date('2023-12-01 00:00:01'),new Date(inicio),new Date(final)) == true && fechaEnRango(new Date('2023-12-31'),new Date(inicio),new Date(final)) == true){
        array_ventas2023.push(["Dic", parseFloat(suma_ventas_dic2023), "#3ea061"]);
      } 

      //2024
      if(fechaEnRango(new Date('2024-01-01 00:00:01'),new Date(inicio),new Date(final)) == true && fechaEnRango(new Date('2024-01-31'),new Date(inicio),new Date(final)) == true){
        array_ventas2024.push(["Ene",     parseFloat(suma_ventas_ene2024), "#3ea091"]);
      }  
      if(fechaEnRango(new Date('2024-02-01 00:00:01'),new Date(inicio),new Date(final)) == true && fechaEnRango(new Date('2024-02-29'),new Date(inicio),new Date(final)) == true){
        array_ventas2024.push(["Feb",   parseFloat(suma_ventas_feb2024), "#3ea091"]);
      }
      if(fechaEnRango(new Date('2024-03-01 00:00:01'),new Date(inicio),new Date(final)) == true && fechaEnRango(new Date('2024-03-31'),new Date(inicio),new Date(final)) == true){
        array_ventas2024.push(["Mar",     parseFloat(suma_ventas_mar2024), "#3ea091"]);
      }
      if(fechaEnRango(new Date('2024-04-01 00:00:01'),new Date(inicio),new Date(final)) == true && fechaEnRango(new Date('2024-04-30'),new Date(inicio),new Date(final)) == true){
        array_ventas2024.push(["Abr",     parseFloat(suma_ventas_abr2024), "#3ea091"]);
      }
      if(fechaEnRango(new Date('2024-05-01 00:00:01'),new Date(inicio),new Date(final)) == true && fechaEnRango(new Date('2024-05-31'),new Date(inicio),new Date(final)) == true){
        array_ventas2024.push(["May",      parseFloat(suma_ventas_may2024), "#3ea091"]);
      }
      if(fechaEnRango(new Date('2024-06-01 00:00:01'),new Date(inicio),new Date(final)) == true && fechaEnRango(new Date('2024-06-30'),new Date(inicio),new Date(final)) == true){
        array_ventas2024.push(["Jun",     parseFloat(suma_ventas_jun2024), "#3ea091"]);
      }  
      if(fechaEnRango(new Date('2024-07-01 00:00:01'),new Date(inicio),new Date(final)) == true && fechaEnRango(new Date('2024-07-31'),new Date(inicio),new Date(final)) == true){
        array_ventas2024.push(["Jul",     parseFloat(suma_ventas_jul2024), "#3ea091"]);
      }
      if(fechaEnRango(new Date('2024-08-01 00:00:01'),new Date(inicio),new Date(final)) == true && fechaEnRango(new Date('2024-08-31'),new Date(inicio),new Date(final)) == true){
        array_ventas2024.push(["Ago",    parseFloat(suma_ventas_ago2024), "#3ea091"]);
      }
      if(fechaEnRango(new Date('2024-09-01 00:00:01'),new Date(inicio),new Date(final)) == true && fechaEnRango(new Date('2024-09-30'),new Date(inicio),new Date(final)) == true){
        array_ventas2024.push(["Sep",parseFloat(suma_ventas_sep2024), "#3ea091"]);
      }
      if(fechaEnRango(new Date('2024-10-01 00:00:01'),new Date(inicio),new Date(final)) == true && fechaEnRango(new Date('2024-10-31'),new Date(inicio),new Date(final)) == true){
        array_ventas2024.push(["Oct",   parseFloat(suma_ventas_oct2024), "#3ea091"]);
      }
      if(fechaEnRango(new Date('2024-11-01 00:00:01'),new Date(inicio),new Date(final)) == true && fechaEnRango(new Date('2024-11-30'),new Date(inicio),new Date(final)) == true){
        array_ventas2024.push(["Nov", parseFloat(suma_ventas_nov2024), "#3ea091"]);
      }
      if(fechaEnRango(new Date('2024-12-01 00:00:01'),new Date(inicio),new Date(final)) == true && fechaEnRango(new Date('2024-12-31'),new Date(inicio),new Date(final)) == true){
        array_ventas2024.push(["Dic", parseFloat(suma_ventas_dic2024), "#3ea061"]);
      }  

      //2025
      if(fechaEnRango(new Date('2025-01-01 00:00:01'),new Date(inicio),new Date(final)) == true && fechaEnRango(new Date('2025-01-31'),new Date(inicio),new Date(final)) == true){
        array_ventas2025.push(["Ene",     parseFloat(suma_ventas_ene2025), "#3ea091"]);
      }  
      if(fechaEnRango(new Date('2025-02-01 00:00:01'),new Date(inicio),new Date(final)) == true && fechaEnRango(new Date('2025-02-28'),new Date(inicio),new Date(final)) == true){
        array_ventas2025.push(["Feb",   parseFloat(suma_ventas_feb2025), "#3ea091"]);
      }
      if(fechaEnRango(new Date('2025-03-01 00:00:01'),new Date(inicio),new Date(final)) == true && fechaEnRango(new Date('2025-03-31'),new Date(inicio),new Date(final)) == true){
        array_ventas2025.push(["Mar",     parseFloat(suma_ventas_mar2025), "#3ea091"]);
      }
      if(fechaEnRango(new Date('2025-04-01 00:00:01'),new Date(inicio),new Date(final)) == true && fechaEnRango(new Date('2025-04-30'),new Date(inicio),new Date(final)) == true){
        array_ventas2025.push(["Abr",     parseFloat(suma_ventas_abr2025), "#3ea091"]);
      }
      if(fechaEnRango(new Date('2025-05-01 00:00:01'),new Date(inicio),new Date(final)) == true && fechaEnRango(new Date('2025-05-31'),new Date(inicio),new Date(final)) == true){
        array_ventas2025.push(["May",      parseFloat(suma_ventas_may2025), "#3ea091"]);
      }
      if(fechaEnRango(new Date('2025-06-01 00:00:01'),new Date(inicio),new Date(final)) == true && fechaEnRango(new Date('2025-06-30'),new Date(inicio),new Date(final)) == true){
        array_ventas2025.push(["Jun",     parseFloat(suma_ventas_jun2025), "#3ea091"]);
      }
      if(fechaEnRango(new Date('2025-07-01 00:00:01'),new Date(inicio),new Date(final)) == true && fechaEnRango(new Date('2025-07-31'),new Date(inicio),new Date(final)) == true){
        array_ventas2025.push(["Jul",     parseFloat(suma_ventas_jul2025), "#3ea091"]);
      }
      if(fechaEnRango(new Date('2025-08-01 00:00:01'),new Date(inicio),new Date(final)) == true && fechaEnRango(new Date('2025-08-31'),new Date(inicio),new Date(final)) == true){
        array_ventas2025.push(["Ago",    parseFloat(suma_ventas_ago2025), "#3ea091"]);
      }
      if(fechaEnRango(new Date('2025-09-01 00:00:01'),new Date(inicio),new Date(final)) == true && fechaEnRango(new Date('2025-09-30'),new Date(inicio),new Date(final)) == true){
        array_ventas2025.push(["Sep",parseFloat(suma_ventas_sep2025), "#3ea091"]);
      }
      if(fechaEnRango(new Date('2025-10-01 00:00:01'),new Date(inicio),new Date(final)) == true && fechaEnRango(new Date('2025-10-31'),new Date(inicio),new Date(final)) == true){
        array_ventas2025.push(["Oct",   parseFloat(suma_ventas_oct2025), "#3ea091"]);
      }
      if(fechaEnRango(new Date('2025-11-01 00:00:01'),new Date(inicio),new Date(final)) == true && fechaEnRango(new Date('2025-11-30'),new Date(inicio),new Date(final)) == true){
        array_ventas2025.push(["Nov", parseFloat(suma_ventas_nov2025), "#3ea091"]);
      }
      if(fechaEnRango(new Date('2025-12-01 00:00:01'),new Date(inicio),new Date(final)) == true && fechaEnRango(new Date('2025-12-31'),new Date(inicio),new Date(final)) == true){
        array_ventas2025.push(["Dic", parseFloat(suma_ventas_dic2025), "#3ea061"]);
      }  
      

      //array_ventas.push(["Del: "+fecha_inicial+" al: "+fecha_final, parseFloat(suma_ventas_totales), "#3ea091"]);
      //array_ventas.push(["Pendientes", parseFloat(suma_ventas_pendientes), "#cb3234"]);

      if(array_ventas2023.length > 1){ 
        setVentas2023(array_ventas2023);
      }
      if(array_ventas2024.length > 1){ 
        setVentas2024(array_ventas2024);
      }
      if(array_ventas2025.length > 1){   
        setVentas2025(array_ventas2025);
      }  

      setNumeroPedidosPagados(total_numero_pedidos_pagados);
      setNumeroPedidosPendientes(total_numero_pedidos_pendientes);

      setVentasTotales(suma_ventas_totales);
      setVentasPendientes(suma_ventas_pendientes);

      setVentasAPagosPendiente(suma_ventas_a_pagos_restante)
      setVentasAPagosAbonos(suma_ventas_a_pagos_abonos)


      //PRODUCTOS
      let array_productos = [];
      //console.log(array_productos);
      const lista_productos = [];
      let númeroProductos;  //máximo 5 productos
      if(res.data.ventas.length > 5){
        númeroProductos = 5;
      }else{
        númeroProductos = res.data.ventas.length;
      }

      for(let i=0;i<númeroProductos;i++){
        if(opcionGeneral.value == "Todo" || res.data.ventas[i]['tipo_venta'] == opcionGeneral.value){
          for(let ii=0;ii<res.data.ventas[i]['descripcion'].length;ii++){ 
          
          const fecha_pedido = new Date(res.data.ventas[i].fecha);

          if( (inicio.getTime() <= (fecha_pedido.getTime())) && (final.getTime() >= fecha_pedido.getTime()) && res.data.ventas[i].estatus_pago == "Pagado"){

          //formateamos fecha a dd/mm/yyyy
          const olddate = (res.data.ventas[i].fecha).split("-");
          const newdate = olddate[0]+"/"+olddate[1]+"/"+olddate[2];

          lista_productos.push({
            "id":res.data.ventas[i]._id,
            "date":newdate,
            "producto":res.data.ventas[i]['descripcion'][ii].nombre_producto,
            "marca":res.data.ventas[i]['descripcion'][ii].marca,
            "categoria":res.data.ventas[i]['descripcion'][ii].categoria,
            "subcategoria":res.data.ventas[i]['descripcion'][ii].subcategoria,
            "talla":res.data.ventas[i]['descripcion'][ii].nombre_talla,
            "color":res.data.ventas[i]['descripcion'][ii].nombre_color,
            "cantidad":res.data.ventas[i]['descripcion'][ii].cantidad,
            "precio":res.data.ventas[i]['descripcion'][ii].precio,
            "total":res.data.ventas[i]['descripcion'][ii].total
          });
        }

          }
        }  
      }
      const groupByName = Map.groupBy(lista_productos, product => {
        return product.producto;
      });
      
      //console.log(lista_productos); 

      if(lista_productos.length > 0){
        array_productos.push(["Producto", "Total", {role:"style"}])

        for (const [key, value] of groupByName) {
          let suma = 0;
          for(let jj=0;jj<value.length;jj++){ 
            //suma = suma + parseFloat(value[jj].total);
            suma = suma + parseFloat(value[jj].cantidad);
          }
          array_productos.push([key, parseFloat(suma), "#3ea091"]);
        }
  
        //console.log(array_productos);
        setVentasProducto(array_productos);

      }else{
        array_productos.push(["Producto", "Total", {role:"style"}])
        array_productos.push(["", 0, ""]);
        setVentasProducto(array_productos);
      }

      
      
      
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {

    if(user && user.tipo == "Punto de venta"){
      navigate("/ventas/ventas_alta")      
    }else if(user && user.tipo == "Almacenista"){
      navigate("/almacenes")
    }else{
      (getOrders(value.startDate,value.endDate)) 
    }
     
  }, [user]);

  useEffect(() => {
    getOrders(new Date(value.startDate), new Date(value.endDate));
  }, [opcionGeneral]);

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
    <div>
      <ToastContainer />
      <div align="center">
        <div style={{width:"30vw"}}>
          <span>Periodo:
            <Datepicker
             value={value}
             onChange={handleValueChange} 
             inputClassName="w-full rounded-md focus:ring-0 font-normal bg-gray-300 dark:bg-gray-500 "
             /> 
          </span>
          <br/>
          <Select
            styles={customStyles}
            label="Opciones"
            placeholder="Seleccione"
            options={options}
            value={opcionGeneral}
            onChange={setOpcionGeneral}
            isSearchable={false}
          ></Select>
        </div>
      </div>
      <br/>
      <div className="grid xl:grid-cols-2 grid-cols-1 gap-5">
        <></>
        <Card title="Dashboard">
          <div className="grid xl:grid-cols-2 grid-cols-1 gap-5">
            <div>
              <p>Número total de pedidos pagados: {numeroPedidosPagados}</p>
              <p>Ventas totales: $ {ventasTotales.toFixed(2)}</p>
              <p>Venta promedio: $ {(ventasTotales / numeroPedidosPagados).toFixed(2)}</p>
            </div>  
          
            <div>
              <p>Número total de pedidos pendientes: {numeroPedidosPendientes}</p>
              <p>Ventas pendientes: $ {ventasPendientes.toFixed(2)}</p>
              <p>Ventas pendientes (abonos): $ {ventasAPagosAbonos.toFixed(2)}</p>
              <p>Ventas pendientes (restante): $ {ventasAPagosPendiente.toFixed(2)}</p>
            </div>  
          </div>                   

        </Card>
        <Card title="Resumen">
          
        <div className="grid xl:grid-cols-3 grid-cols-1 gap-5">

          <div>
            <h3>$ {(ventasTotales + ventasPendientes).toFixed(2)}</h3>
            <h4>Ventas<br/>Totales</h4>
          </div>

          <div>
            <h3>$ {(ventasTotales + ventasAPagosAbonos).toFixed(2)}</h3>
            <h4>Ingreso<br/>Total</h4>
          </div>

          <div>
            <h3>$ {ventasPendientes.toFixed(2)}</h3>
            <h4>Ingreso<br/>Pendiente</h4>
          </div>


        </div>  
                   

        </Card>

      </div>
      
      <div className="grid xl:grid-cols-2 grid-cols-1 gap-5 mt-4">
        
        <Card title="Mes vs Ventas">

          {ventas2023.length > 0 ?
          (<>
          <Chart 
            chartType="Bar"
            data={ventas2023} 
            width="100%" 
            options={{
              //width: 600,
              //height: 400,
              bar: { groupWidth: "95%" },
              legend: { position: "none" },
            }} />
            <br/>
          </>  
          ):(<></>)
          }  

          {ventas2024.length > 0 ?
          (<>
            <Chart 
            chartType="Bar"
            data={ventas2024} 
            width="100%" 
            options={{
              //title: "Density of Precious Metals, in g/cm^3",
              //width: 600,
              //height: 400,
              bar: { groupWidth: "95%" },
              legend: { position: "none" },
            }} />
            <br/>
            </>  
          ):(<></>)
          }    

          {ventas2025.length > 0 ?
          (<>
            <Chart 
            chartType="Bar"
            data={ventas2025} 
            width="100%" 
            options={{
              //title: "Density of Precious Metals, in g/cm^3",
              //width: 600,
              //height: 400,
              bar: { groupWidth: "95%" },
              legend: { position: "none" },
            }} />
            </>  
          ):(<></>)
          }      

        </Card>

        <Card title="Producto vs Pedidos">

        {productos.length > 0 ?
        (<>
        <Chart
            chartType="Bar"
            data={productos}
            width="100%"
            options={
              {
                chart: {
                  //title: "Company Performance",
                  subtitle: "* Número de piezas vendidas",
                },
              //title: "Número de piezas vendidas",
              //width: 600,
              //height: 400,
              //bar: { groupWidth: "95%" },
              legend: { position: "none" },
            }}
          />
           </>  
          ):(<></>)
          }   

        </Card>    



        </div>

        
     
    </div>
  );
};

export default Dashboard;

