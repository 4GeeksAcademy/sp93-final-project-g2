import React, { useContext } from "react";
import { ItemList } from "../component/ItemList.jsx";
import { Context } from "../store/appContext.js";
import { ItemForm } from "../component/ItemForm.jsx";
import { EntitiesNavbar } from "../component/EntitiesNavbar.jsx";
import { ItemView } from "../component/ItemView.jsx";

export const AdminABM = () => {
    const { store } = useContext(Context)
    const renderView = () => {
        if (store.activeList.length == 0) return <h1 className="w-100 d-flex justify-content-center align-items-center">Seleccione Entidad</h1>
        switch (store.viewType) {
            case 'list':
                return <ItemList />;
            case 'form':
                return <ItemForm />;
            case 'view':
                return <ItemView />;
            default:
                return <h1 className="w-100 d-flex justify-content-center align-items-center">No autorizado</h1>;
        }
    };

    return (
        <div className="">
            <div className="d-flex flex-column flex-sm-row">
                <EntitiesNavbar />
                <main className="col-12 col-sm-8 col-md-9 col-lg-10 p-3 view-container">
                    {renderView()}
                </main>
            </div>
        </div>
    )
}