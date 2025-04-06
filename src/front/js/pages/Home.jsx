import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/home.css";
import { ReactComponent as Logo } from '../../img/logoZuplySolo.svg';
import { ReactComponent as LogoText } from '../../img/zuplyText.svg';
export const Home = () => {
    const { store } = useContext(Context);
    const [current, setCurrent] = useState(0);

    const testimonials = [
        { text: "Zuply nos ha ahorrado horas cada semana, ¡lo recomiendo sin dudar!", author: "Restaurante La Cazuela" },
        { text: "Desde que usamos Zuply, nuestros pedidos llegan siempre a tiempo.", author: "Bar El Tapeo" },
        { text: "Fácil, rápido y sin líos. ¡Perfecto para nuestro equipo!", author: "Pizzería Don Massimo" },
        { text: "Zuply ha sido clave para optimizar nuestro tiempo de pedidos.", author: "Hamburguesería El Buen Mordisco" },
        { text: "Nunca fue tan fácil gestionar pedidos con múltiples proveedores.", author: "Parrilla Los Amigos" }
    ];

    const nextSlide = () => setCurrent((current + 1) % testimonials.length);
    const prevSlide = () => setCurrent((current - 1 + testimonials.length) % testimonials.length);

    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [current]);

    return (
        <div className="text-center ">
            <div className="py-5 background-mesh">

                <Logo className="logo claro" />

                <h1 className="hero-title">
                    <span className="text-white">Bienvenido a</span> <LogoText className="logo original" />
                    <span>{store.user && <span>, <span style={{ color: '#95c11f' }}>{store.user.username}</span></span>}</span>
                </h1>
                <p className="hero-subtitle">Gestión de pedidos sin complicaciones. Sencillo, rápido y efectivo.</p>

            </div>

            <div className="testimonial-carousel-outer">
                <div className="testimonial-carousel">
                    <div>
                        <button className="carousel-btn" onClick={prevSlide}>‹</button>
                        <div className="testimonial-card fade-slide">
                            <p>"{testimonials[current].text}"</p>
                            <small>- {testimonials[current].author}</small>
                        </div>
                        <button className="carousel-btn" onClick={nextSlide}>›</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
