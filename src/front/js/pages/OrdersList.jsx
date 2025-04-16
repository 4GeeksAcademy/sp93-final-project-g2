import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext.js";
import { AgGridReact } from "@ag-grid-community/react";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-alpine.css";
import "../../styles/ordersList.css";
import { PageTitle } from "../component/PageTitle.jsx";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export const OrdersList = () => {
  const { store, actions } = useContext(Context);
  const [rowData, setRowData] = useState([]);
  const [statusFilter, setStatusFilter] = useState(store.statusFilter);

  useEffect(() => {
    let allOrders = store.entitiesData?.orders || [];
    if (allOrders.length > 0) {
      const rowDataPrev = allOrders.filter((order) => order.status?.toLowerCase() === statusFilter);
      let rowDataToSet = [];
      if (rowDataPrev) {
        rowDataPrev.map((dataToMap) => {
          rowDataToSet = [
            ...rowDataToSet,
            {
              id: dataToMap.id,
              proveedor: dataToMap.contacts_data.supplier.name,
              sucursal: dataToMap.branch.contacts_data.first_name,
              pago: dataToMap.payment_method,
              total: `${dataToMap.amount} €`,
              accion: "accion",
              status: dataToMap.status,
            },
          ];
        });
        setRowData(rowDataToSet);
      }
    }
  }, [store.entitiesData, statusFilter]);

  const handleMarkAsReceived = async (orderId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token no encontrado");
        return;
      }

      const response = await fetch(`${process.env.BACKEND_URL}/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "recibido" }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        console.log("Estado de la orden actualizado:", updatedOrder);
        window.location.reload();
      } else {
        const data = await response.json();
        console.error("Error al cambiar el estado de la orden:", data.message);
      }
    } catch (error) {
      console.error("Error al cambiar el estado de la orden:", error);
    }
  };

  const handleMarkAsCancelled = async (orderId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token no encontrado");
        return;
      }

      const response = await fetch(`${process.env.BACKEND_URL}/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "cancelado" }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        console.log("Estado de la orden actualizado:", updatedOrder);
        window.location.reload();
      } else {
        const data = await response.json();
        console.error("Error al cambiar el estado de la orden:", data.message);
      }
    } catch (error) {
      console.error("Error al cambiar el estado de la orden:", error);
    }
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatusFilter(newStatus);
    actions.simpleStoreSetter("statusFilter", newStatus);
  };

  const columnDefs = [
    { headerName: "Proveedor", field: "proveedor", flex: 1 },
    { headerName: "Sucursal", field: "sucursal", flex: 1 },
    { headerName: "Forma de Pago", field: "pago", flex: 1 },
    { headerName: "Total", field: "total", flex: 1 },
    {
      headerName: "Acción",
      field: "accion",
      flex: 1,
      cellRenderer: (params) =>
        params.data.status.toLowerCase() === "pendiente" ? (
          <>
            <button
              className="received-btn"
              onClick={() => handleMarkAsReceived(params.data.id)}
            >
              ✔
            </button>
            <button
              className="cancelled-btn"
              onClick={() => handleMarkAsCancelled(params.data.id)}
            >
              ❌
            </button>
          </>
        ) : null,
    },
  ];

  return (
    <>
      <PageTitle
        title="Pedidos con estado "
        titleGreen={store.statusFilter && actions.capitaliseText(store.statusFilter)}
      />

      <div className="dropdown-container">
        <label htmlFor="status-dropdown">Filtrar Pedidos por Estado: </label>
        <select
          className="status-dropdown"
          value={statusFilter}
          onChange={handleStatusChange}
        >
          {store.enums.status.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      <div className="ag-theme-alpine orders-grid-container m-3">
        <AgGridReact rowData={rowData} columnDefs={columnDefs} domLayout="autoHeight" />
      </div>
    </>
  );
};