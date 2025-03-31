import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/home.css";

export const Home = () => {
    const { store } = useContext(Context);
    const [showCards, setShowCards] = useState(false);

    useEffect(() => {
        setTimeout(() => setShowCards(true), 200);
    }, []);

    return (
        <div className="text-center mt-5" style={{ backgroundColor: '#f4f3ef', minHeight: '100vh', padding: '2rem' }}>
            <div className="container py-5">

                <h1 style={{ color: '#223650', marginBottom: '1.5rem', fontWeight: '700' }}>
                    Bienvenido a Zuply {store.user && <span style={{ color: '#95c11f' }}>{store.user.username}</span>}
                </h1>

                <p className="lead" style={{ color: '#223650', fontSize: '1.25rem', marginBottom: '2rem' }}>
                    Gestión de pedidos sin complicaciones. Sencillo, rápido y efectivo.
                </p>

                <div className="row justify-content-center">
                    {[
                        { text: "Zuply nos ha ahorrado horas cada semana, ¡lo recomiendo sin dudar!", author: "Restaurante La Cazuela" },
                        { text: "Desde que usamos Zuply, nuestros pedidos llegan siempre a tiempo.", author: "Bar El Tapeo" },
                        { text: "Fácil, rápido y sin líos. ¡Perfecto para nuestro equipo!", author: "Pizzería Don Massimo" }
                    ].map((testimonial, index) => (
                        <div key={index} className={`col-md-3 m-2 p-3 border rounded testimonial-card ${showCards ? "visible" : ""}`} style={{ backgroundColor: 'white' }}>
                            <p>"{testimonial.text}"</p>
                            <small>- {testimonial.author}</small>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};
