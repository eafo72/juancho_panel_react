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

const Subcategories = () => {

  const COLUMNS = [
   
    {
      Header: "Nombre",
      accessor: "nombre",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Categoría",
      accessor: "categoria",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Editar",
      Cell: (row) => {
        return <button onClick={() => goToEditar(row.row.original._id, row.row.original.nombre)} className="hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50 border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer 
        first:rounded-t last:rounded-b flex  space-x-2 items-center rtl:space-x-reverse">
          <span className="text-base">
            <Icon icon="heroicons:pencil-square"/>
          </span>
        </button>
      },
    },

    {
      Header: "Borrar",
      Cell: (row) => {
        return <button onClick={() => goToBorrar(row.row.original._id, row.row.original.nombre)} className="text-danger-500 hover:bg-danger-500 hover:bg-opacity-100 hover:text-white border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer 
        first:rounded-t last:rounded-b flex  space-x-2 items-center rtl:space-x-reverse">
          <span className="text-base">
            <Icon icon="heroicons-outline:trash"/>
          </span>
        </button>;
      },
    },
  ];

  
  
  const columns = useMemo(() => COLUMNS, []);

  const [datos, setDatos] = useState([]);
  
  const userCtx = useContext(UserContext);
  const { user, authStatus, verifyingToken } = userCtx;

  const navigate = useNavigate();

  const getSubcategories = async () => {
    try {
      let res = await clienteAxios.get(`/subcategoria/obtener`);

      //console.log(res.data.subcategorias);
      
      setDatos(res.data.subcategorias);
    } catch (error) {
      console.log(error);
    }
  };

  
  useEffect(() => {
    verifyingToken().then(() => {
      //console.log(user);
    });

    if(authStatus === false) {
      //navigate("/");
    }
    getSubcategories();
      
  },[authStatus]);
  

  const header = ["Nombre", "Categoría" ];
  function handleDownloadExcel() {
    let newDatos = [];
    for(let i=0;i<datos.length;i++){
      newDatos.push({
        "nombre":datos[i]['nombre'],
        "categoria":datos[i]['categoria']
      })
    }

    downloadExcel({
      fileName: "juancho_subcategories",
      sheet: "subcategories",
      tablePayload: {
        header,
        body: newDatos,
      },
    });
  }

  const handleAlta = () => {
    navigate("/subcategorias/alta");
  };

  const goToEditar = (id,email) => {
    localStorage.setItem("EditSubcategory",id);
    navigate("/subcategorias/editar");
  }

  const goToBorrar = async (id,nombre) => {
    localStorage.setItem("DeleteSubcategory",id);
    localStorage.setItem("DeleteSubcategoryName",nombre);
    navigate("/subcategorias/borrar");
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
          <h4 className="card-title">Subcategorías</h4>
          <button onClick={(e) => handleAlta(e)} className="btn btn-success">
            Agregar nueva
          </button>
          <button className="btn btn-success m-2" onClick={handleDownloadExcel}>Exportar</button>
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
      </Card>
    </>
  );
};

export default Subcategories;
