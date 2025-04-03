import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/order.css";

export const Order = () => {
    const { store, actions } = useContext(Context);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        actions.getProducts().then(data => setProducts(data));
    }, []);

    const handleAddToCart = (product) => {
        actions.addToCart(product);
    };

    return (
        <div className="container my-5">
            <h2 className="mb-4 text-center">Toma de Pedido</h2>
            <div className="row">
                <div className="col-md-8">
                    <div className="product-list">
                        {products.map((product, index) => (
                            <div key={index} className="card mb-3 p-3 d-flex flex-row justify-content-between align-items-center">
                                <div>
                                    <h5>{product.name}</h5>
                                    <p>{product.description || "Sin descripción"}</p>
                                </div>
                                <button onClick={() => handleAddToCart(product)} className="btn btn-success">Añadir</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-md-4">
                    <h4>Carrito</h4>
                    <ul className="list-group mb-3">
                        {store.cart.length === 0 ? <li className="list-group-item">El carrito está vacío</li> :
                            store.cart.map((item, i) => (
                                <li key={i} className="list-group-item d-flex justify-content-between">
                                    {item.name}
                                    <button className="btn btn-sm btn-danger" onClick={() => actions.removeFromCart(i)}>Eliminar</button>
                                </li>
                            ))
                        }
                    </ul>
                    {store.cart.length > 0 &&
                        <button className="btn btn-primary w-100" onClick={actions.confirmOrder}>Confirmar Pedido</button>
                    }
                </div>
            </div>
        </div>
    );
};
