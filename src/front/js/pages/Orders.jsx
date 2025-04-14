import React from "react";
import { OrderNavbar } from "../component/order/OrderNavbar.jsx";
import { OrderCart } from "../component/order/OrderCart.jsx";
import { Breadcrums } from "../component/Breadcrums.jsx";
import "../../styles/order.css";

export const Orders = () => {
   
    return (
        <div>
            <Breadcrums title='Orden'/>
            <div className="d-flex">
                <OrderNavbar />
                <OrderCart />
            </div>
        </div>
    )
}