import React, { useContext, useEffect, useState } from "react";
import { ItemList } from "../component/ItemList.jsx";
import { Context } from "../store/appContext.js";
import { ItemForm } from "../component/ItemForm.jsx";

export const AdminABM = () => {
    const { store, actions } = useContext(Context)
    
    useEffect(() => {
        actions.getInitAdminData()
    }, [])
    
    return (
        <div className="p-3">
            <div className="d-flex">
                <div className="col-3">
                    <h1 className="m-2">ABM Config</h1>
                    <ul className="list-group flex-column">
                        {
                            Object.keys(store.groups).map((groupKey, index) =>
                                <li key={index} className="list-group-item" onClick={() => actions.simpleStoreSetter('activeGroup', groupKey)}>
                                    {store.groups[groupKey].title}
                                </li>
                            )
                        }
                    </ul>
                </div>
                <main className="col-9 p-3">
                    {store.isListView ?
                        <div>
                            <div className="d-flex justify-content-between">
                                <h2>Lista de {store.groups[store.activeGroup].title}</h2>
                                <span className="btn btn-primary btn-circle" onClick={() => actions.simpleStoreSetter('isListView', false)}>
                                    <i className="fa fa-plus"></i>
                                </span>
                            </div>
                            <ItemList />
                        </div> :
                        <div>
                            <div className="d-flex justify-content-between">
                                <h2>Agregar nuevo en {store.groups[store.activeGroup].title}</h2>
                                <span className="btn btn-danger btn-circle" onClick={() => actions.simpleStoreSetter('isListView', true)}>
                                    <i className="fa fa-cancel"></i>
                                </span>
                            </div>
                            <ItemForm />
                        </div>}
                </main>
            </div>
        </div>
    )
}