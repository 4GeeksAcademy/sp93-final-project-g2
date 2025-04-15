import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext.js";
import { AgGridReact } from "@ag-grid-community/react";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-alpine.css";
import "../../styles/ordersList.css"
import { PageTitle } from "../component/PageTitle.jsx";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export const OrdersList = () => {
  const { store, actions } = useContext(Context);
  const [rowData, setRowData] = useState([]);

  useEffect(() => {

    let allOrders = store.entitiesData?.orders || [];
    if (allOrders.length > 0) {
      const rowDataPrev = allOrders.filter((order) => order.status?.toLowerCase() === store.statusFilter);
      let rowDataToSet = []
      if (rowDataPrev) {
        rowDataPrev.map((dataToMap) => {
          rowDataToSet = [...rowDataToSet,
          {
            id: dataToMap.id,
            proveedor: dataToMap.contacts_data.supplier.name,
            sucursal: dataToMap.branch.contacts_data.first_name,
            pago: dataToMap.payment_method,
            total: `${dataToMap.amount} €`,
            accion: 'accion'
          }
          ]
        })
        setRowData(rowDataToSet)
      }

    }
  }, [store.entitiesData]);


  const columnDefs = [
    { headerName: "Proveedor", field: "proveedor", flex: 1 },
    { headerName: "Sucursal", field: "sucursal", flex: 1 },
    { headerName: "Forma de Pago", field: "pago", flex: 1 },
    { headerName: "Total", field: "total", flex: 1 },
    {
      headerName: "Acción", field: "accion", flex: 1,
      cellRenderer: () => (
        <button className="btn btn-success" >
          Marcar como Recibido
        </button>
      )
    }
  ];

  return (
    <>
      <PageTitle
        title="Pedidos con estado "
        titleGreen={store.statusFilter && actions.capitaliseText(store.statusFilter)}
      />
      <div className="ag-theme-alpine orders-grid-container m-3">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          domLayout="autoHeight"
        />
      </div>
    </>
  );
};


