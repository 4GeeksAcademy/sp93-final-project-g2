import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";

export const SupplierProductCard = (props, onAddToCart) => {
    const { store, actions } = useContext(Context)
    const { id, suppliers, nickname, presentation, price } = props.item;

    const handleAddToCart = () => {
        
        let updatedCart = {};
        if(store.actualCart.products.length == 0){
            actions.getSupplierContacts(props.item.suppliers_id)
            updatedCart = {
                ...store.actualCart,
                suppliers_id: props.item.suppliers_id,
                supplierName: suppliers?.name || '', 
                products: [ props.item ]
            }
        } else {
            updatedCart = {...store.actualCart, products:[ ...store.actualCart['products'], props.item ]};
        }
        actions.simpleStoreSetter('actualCart', updatedCart);
        const updatedItemList = store.orderFlowActiveItemList.filter(item => item.id !== props.item.id);
        actions.simpleStoreSetter('orderFlowActiveItemList', updatedItemList);
    };

    return (
        <div key={id} className="supplier-product-item card p-3 mb-3">
            <p className="mb-1 text-muted">Proveedor: <strong>{suppliers?.name}</strong></p>
            <h4 className="mb-2">{nickname}</h4>
            <p className="mb-1">{presentation}</p>
            <p className="fw-bold text-success">Precio: ${price}</p>

            <button className="btn btn-primary w-100 mt-2" onClick={handleAddToCart}>
                Agregar al carrito
            </button>
        </div>
    );
};