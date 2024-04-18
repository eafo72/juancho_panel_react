import React, { useEffect, useState, useMemo, useContext } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  useFilters,
  usePagination,
} from "react-table";

import {
  DateRangeColumnFilter,
  dateBetweenFilterFn,
} from "../../components/rangeFilters";

import GlobalFilter from "../table/react-tables/GlobalFilter";

import { useNavigate } from "react-router-dom";
import clienteAxios from "../../configs/axios";
import { UserContext } from "../context/userContext";
import { downloadExcel } from "react-export-table-to-excel";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import { ColumnFilter } from "../../components/columnFilter";

const OrdersHistory = () => {

  const COLUMNS = [
    {
      Header: "id",
      accessor: "_id",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
      Filter: ColumnFilter,
    },
    {
      Header: "Origen",
      accessor: "tipo_venta",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
      Filter: ColumnFilter,
    },
    {
      Header: "Fecha",
      accessor: "fecha",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
      Filter: DateRangeColumnFilter,
      filter: dateBetweenFilterFn,
    },
    {
      Header: "Tipo Envío",
      accessor: "forma_entrega",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
      Filter: ColumnFilter,
    },
    {
      Header: "Estatus Envío",
      accessor: "estatus_envio",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
      Filter: ColumnFilter,
    },
    {
      Header: "Parcialidades",
      accessor: "num_parcialidades",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
      Filter: ColumnFilter,
    },
    {
      Header: "Subtotal",
      accessor: "subtotal",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
      Filter: ColumnFilter,
    },
    {
      Header: "Descuento",
      accessor: "descuento",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
      Filter: ColumnFilter,
    },
    {
      Header: "I.V.A",
      accessor: "iva",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
      Filter: ColumnFilter,
    },
    {
      Header: "Total",
      accessor: "total",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
      Filter: ColumnFilter,
    },
    {
      Header: "Pagado",
      accessor: "total_parcialidades",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
      Filter: ColumnFilter,
    },
    {
      Header: "Estatus Pago",
      accessor: "estatus_pago",
      Cell: (row) => {
        return <span
            className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 
            ${
              row?.cell?.value === "Pendiente"
                ? "text-danger-500 bg-danger-500"
                : ""
            }
             `}
          >
        
        {row?.cell?.value}</span>;
      },
      Filter: ColumnFilter,
    },
    {
      Header: "Ver",
      Cell: (row) => {
        return <button onClick={() => goToVer(row.row.original._id)} className="hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50 border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer 
        first:rounded-t last:rounded-b flex  space-x-2 items-center rtl:space-x-reverse">
          <span className="text-base">
            <Icon icon="heroicons:eye"/>
          </span>
        </button>
      },
    },
    {
      Header: "Pagar",
      Cell: (row) => {
        return row.row.original.estatus_pago == "Pendiente" ? (<button onClick={() => goToPagar(row.row.original._id)} className="hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50 border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer 
        first:rounded-t last:rounded-b flex  space-x-2 items-center rtl:space-x-reverse">
          <span className="text-base">
            <Icon icon="heroicons:credit-card"/>
          </span>
        </button>):(<></>)
      },
    },

    
  ];


  const calculateColumnSum = (columnName) => {
    return rows.reduce((sum, row) => {
      return sum + parseFloat(row.values[columnName]);
    }, 0);
  };
  
  
  const columns = useMemo(() => COLUMNS, []);

  const [datos, setDatos] = useState([]);
  
  const userCtx = useContext(UserContext);
  const { user, authStatus, verifyingToken } = userCtx;

  const navigate = useNavigate();

  const getOrdersHistory = async () => {
    try {
      let res = await clienteAxios.get(`/pedido/obtener`);

      //console.log(res.data.pedidos);
      
      setDatos(res.data.pedidos);
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
    getOrdersHistory();
      
  },[authStatus]);
  

  const header = ["Id", "Origen", "Fecha", "Tipo", "Estatus", "Parcialidades", "Pagado", "Total", "Estatus" ];
  

  function handleDownloadExcel() {
    let newDatos = [];
    for(let i=0;i<datos.length;i++){
      newDatos.push({
        "_id":datos[i]['_id'],
        "tipo_venta":datos[i]['tipo_venta'],
        "fecha":datos[i]['fecha'],
        "forma_entrega":datos[i]['forma_entrega'],
        "estatus_envio":datos[i]['estatus_envio'],
        "num_parcialidades":datos[i]['num_parcialidades'],
        "total_parcialidades":datos[i]['total_parcialidades'],
        "total":datos[i]['total'],
        "estatus_pago":datos[i]['estatus_pago']
      })
    }

    downloadExcel({
      fileName: "juancho_OrdersHistory",
      sheet: "OrdersHistory",
      tablePayload: {
        header,
        body: newDatos,
      },
    });
  }

 

  const goToVer = (id,email) => {
    localStorage.setItem("SeeSale",id);
    navigate("/ventas/detalle");
  }

  const goToPagar = (id,email) => {
    localStorage.setItem("PaySale",id);
    navigate("/ventas/pagar");
  }
   
  const data = useMemo(() => datos, [datos]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useFilters,
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
    rows,
    prepareRow,
  } = tableInstance;

  const { globalFilter, pageIndex, pageSize } = state;
  return (
    <>
      <ToastContainer />
      <Card noborder>
        <div className="md:flex justify-between items-center mb-6">
          <h4 className="card-title">Historial de Ventas</h4>
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
                          <div>
                            {column.canFilter && column.Header != "Ver" && column.Header != "Pagar" ? column.render("Filter") : null}
                          </div>
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

                  {/* Sum column */}
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td className="table-td">Total:</td>
                    <td className="table-td">
                       $ {calculateColumnSum("total")}
                    </td>
                  </tr>  


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

export default OrdersHistory;


