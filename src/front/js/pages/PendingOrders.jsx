import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import { AgGridReact } from "@ag-grid-community/react";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-alpine.css";
import "../../styles/pendingOrders.css"

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const PendingOrders = () => {
  const { store, actions } = useContext(Context);
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    actions.setListViewConfig("orders", "list", []);
    actions.getItems();
  }, []);

  useEffect(() => {
    const fetchAdditionalData = async () => {
      const allOrders = store.abmGroups?.orders?.items || [];
      const pending = allOrders.filter(order => order.status?.toLowerCase() === "pendiente");

      const enriched = await Promise.all(pending.map(async order => {
        let proveedor = "—";
        let sucursal = "—";

        try {
          const res = await fetch(`${process.env.BACKEND_URL}/api/contacts-data/${order.contacts_data_id}`, {
            headers: { "Authorization": `Bearer ${store.token}` }
          });
          const data = await res.json();
          if (res.ok && data.results) {
            proveedor = data.results.supplier?.name || "—";
          }
        } catch (err) {
          console.error("Error fetching proveedor:", err);
        }

        try {
          const resBranch = await fetch(`${process.env.BACKEND_URL}/api/branches/${order.branch_id}`, {
            headers: { "Authorization": `Bearer ${store.token}` }
          });
          const branchData = await resBranch.json();
          if (resBranch.ok && branchData.results?.contacts_data_id) {
            const contactRes = await fetch(`${process.env.BACKEND_URL}/api/contacts-data/${branchData.results.contacts_data_id}`, {
              headers: { "Authorization": `Bearer ${store.token}` }
            });
            const contactData = await contactRes.json();
            if (contactRes.ok && contactData.results?.address) {
              sucursal = contactData.results.address;
            }
          }
        } catch (err) {
          console.error("Error fetching sucursal:", err);
        }

        return {
          id: order.id,
          proveedor,
          sucursal,
          pago: order.payment_method,
          total: `${order.amount} €`,
          accion: order.id
        };
      }));

      setRowData(enriched);
    };

    fetchAdditionalData();
  }, [store.abmGroups.orders]);


  const columnDefs = [
    { headerName: "Proveedor", field: "proveedor", flex: 1 },
    { headerName: "Sucursal", field: "sucursal", flex: 1 },
    { headerName: "Forma de Pago", field: "pago", flex: 1 },
    { headerName: "Total", field: "total", flex: 1 },
    {
      headerName: "Acción", field: "accion", flex: 1,
      cellRenderer: () => (
        <button className="btn btn-success">
          Marcar como Recibido
        </button>
      )
    }
  ];

  return (
    <div className="ag-theme-alpine orders-grid-container">
      <h2 className="text-center mb-4">Pedidos Pendientes</h2>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        domLayout="autoHeight"
      />
    </div>
  );
};

export default PendingOrders;


