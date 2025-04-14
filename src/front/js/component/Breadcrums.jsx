import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
export const Breadcrums = (props) => {
    const { store, actions } = useContext(Context)
    const handleBreadcrums = (breadcrumLocal) => {
        //todo crear la navegacion correspondiente al hacer click en el breadcrum
        console.log('breadcrumLocal', breadcrumLocal)
    }
    return (
        <div className="zuply-bg-azul breadcrumb">
            {props.title && <span className="zuply-text-beige fs-3 ms-3">{props.title}</span> }
            <nav className="breadcrum-divider-zuply breadcrumb-nav zuply-bg-azul" aria-label="breadcrumb">
                <i className="fa fa-folder-open me-2 zuply-text-verde"></i>
                {store.breadcrumItems.map((item) =>
                    <span key={item} className="breadcrumb-item">
                        <span onClick={() => handleBreadcrums(item)}>{item}</span>
                    </span>
                )}
            </nav>
        </div>
    )
}