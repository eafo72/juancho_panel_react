import React, { useEffect, useState, useMemo, useContext } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "../table/react-tables/GlobalFilter";

import { useNavigate } from "react-router-dom";
import clienteAxios from "../../configs/axios";
import { UserContext } from "../context/userContext";
import { downloadExcel } from "react-export-table-to-excel";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";

const SalesDetails = () => {

  const COLUMNS = [
   
    {
      Header: "Imagen",
      Cell: (row) => {
        return <img src={row.row.original.foto_principal} style={{width:"60px", height: "60px"}} />;
      },
    },
    {
      Header: "Producto",
      accessor: "nombre_producto",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Cantidad",
      accessor: "cantidad",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Precio",
      accessor: "precio",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Total",
      accessor: "total",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    
    
    
  ];

  
  
  const columns = useMemo(() => COLUMNS, []);

  const [datos, setDatos] = useState([]);

  const [fecha, setFecha] = useState([]);
  const [cliente, setCliente] = useState([]);
  const [vendedor, setVendedor] = useState([]);

  const [datos_entrega_nombre, setDatosEntregaNombre] = useState("Mostrador");
  const [datos_entrega_direccion, setDatosEntregaDireccion] = useState();
  const [datos_entrega_correo, setDatosEntregaCorreo] = useState();
  const [datos_entrega_telefono, setDatosEntregaTelefono] = useState();

  
  const userCtx = useContext(UserContext);
  const { user, authStatus, verifyingToken } = userCtx;

  const navigate = useNavigate();


  const id = localStorage.getItem("SeeSale");

  const getOrder = async () => {
    try {
      let res = await clienteAxios.get(`/pedido/single/`+ id);

      //console.log(res.data.single);
      setFecha(res.data.single.fecha);
      setCliente(res.data.single.usuario);    
      setVendedor(res.data.single.vendedor);  

      setDatosEntregaNombre(res.data.single.entregar_a);  
      setDatosEntregaDireccion(res.data.single.direccion_entrega);  
      setDatosEntregaCorreo(res.data.single.correo);  
      setDatosEntregaTelefono(res.data.single.telefono);  
      
      setDatos(res.data.single.descripcion);
    } catch (error) {
      console.log(error);
    }
  };

  
  useEffect(() => {

    getOrder();
      
  },[]);
   
   
  const backToOrders = () => {
    navigate("/ventas/historial_pedidos");
  }
  

  
   
  const data = useMemo(() => datos, [datos]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },

    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    gotoPage,
    pageCount,
    setPageSize,
    setGlobalFilter,
    prepareRow,
  } = tableInstance;

  const { globalFilter, pageIndex, pageSize } = state;
  return (
    <>
      <ToastContainer />
      <Card noborder>
        

        <div className="md:flex justify-between items-center mb-6">
          <h4 className="card-title">Pedido:</h4>
        </div>
        <div>
          <p>Id: {id}</p>    
          <p>Fecha: {fecha}</p>    
          <p>Cliente: {cliente}</p>    
          <p>Vendedor: {vendedor}</p>  

          {datos_entrega_nombre != null ? (  
            <div className="mt-4">
              <h6>Datos Entrega:</h6>
              <p>Entregar a: {datos_entrega_nombre}</p>    
              <p>Dirección: {datos_entrega_direccion}</p>    
              <p>Correo: {datos_entrega_correo}</p>    
              <p>Teléfono: {datos_entrega_telefono}</p>    
            </div>
            ):(<></>)
          }

        </div>

        <div className="md:flex justify-between items-center mb-6 mt-6">
          <h4 className="card-title">Descripcion:</h4>
          <div>
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          </div>
        </div>
        <div></div>
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden ">
              <table
                className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                {...getTableProps}
              >
                <thead className=" border-t border-slate-100 dark:border-slate-800">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          scope="col"
                          className=" table-th "
                        >
                          {column.render("Header")}
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? " 🔽"
                                : " 🔼"
                              : ""}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                  {...getTableBodyProps}
                >
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          return (
                            <td {...cell.getCellProps()} className="table-td">
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center">
          <div className=" flex items-center space-x-3 rtl:space-x-reverse">
            <span className=" flex space-x-2  rtl:space-x-reverse items-center">
              <span className=" text-sm font-medium text-slate-600 dark:text-slate-300">
                Go
              </span>
              <span>
                <input
                  type="number"
                  className=" form-control py-2"
                  defaultValue={pageIndex + 1}
                  onChange={(e) => {
                    const pageNumber = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    gotoPage(pageNumber);
                  }}
                  style={{ width: "50px" }}
                />
              </span>
            </span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Page{" "}
              <span>
                {pageIndex + 1} of {pageOptions.length}
              </span>
            </span>
          </div>
          <ul className="flex flex-wrap items-center  space-x-3  rtl:space-x-reverse">
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${
                  !canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                <Icon icon="heroicons-outline:chevron-left" />
              </button>
            </li>
            {pageOptions.map((page, pageIdx) => (
              <li key={pageIdx}>
                <button
                  href="#"
                  aria-current="page"
                  className={` ${
                    pageIdx === pageIndex
                      ? "bg-slate-900 dark:bg-slate-600  dark:text-slate-200 text-white font-medium "
                      : "bg-slate-100 dark:bg-slate-700 dark:text-slate-400 text-slate-900  font-normal  "
                  }    text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
                  onClick={() => gotoPage(pageIdx)}
                >
                  {page + 1}
                </button>
              </li>
            ))}
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${
                  !canNextPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                <Icon icon="heroicons-outline:chevron-right" />
              </button>
            </li>
          </ul>
        </div>
        <div align="center" className="m-6">
          <button className="btn btn-success" onClick={() => backToOrders()} >Regresar</button>
        </div>

      </Card>
    </>
  );
};

export default SalesDetails;
