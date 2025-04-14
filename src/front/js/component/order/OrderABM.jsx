import React, { useContext } from "react";
import { Context } from "../../store/appContext";

export const OrderABM = (props) => {
    const { store, actions } = useContext(Context)
    return (
        <div key={props.item.id} className="supplier-product-item">
            <p>Proveedor: {props.item.suppliers.name}</p>
            <h4>{props.item.nickname}</h4>
            <p>{props.item.presentation}</p>
            <p>Precio: ${props.item.price}</p>
        </div>
    )
}