import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/home.css";
import Logo  from '../../img/logoZuplySolo.svg';
import LogoText from '../../img/zuplyText.svg';
export const Home = () => {
    const { store, actions } = useContext(Context);
    const [current, setCurrent] = useState(0);

    const nextSlide = () => setCurrent((current + 1) % store.testimonials.length);
    const prevSlide = () => setCurrent((current - 1 + store.testimonials.length) % store.testimonials.length);

    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [current, store.testimonials.length]);

    const getVisibleTestimonials = () => {
        const total = store.testimonials?.length || 0;
        if (total === 0) return [];

        const visible = [];

        for (let i = -2; i <= 2; i++) {
            const index = (current + i + total) % total;
            if (store.testimonials[index]) {
                visible.push(store.testimonials[index]);
            }
        }

        return visible;
    };

    return (
        <div className="home-container">
            <div className="py-5 background-mesh banner">

                <Logo className="logo claro" />

                <h1 className="banner-title">
                    <span className="text-white">Bienvenido a</span> <LogoText className="logo original" />
                    <span>{store.user && <span>, <span>{store.user.username}</span></span>}</span>
                </h1>
                <p className="banner-subtitle">Gestión de pedidos sin complicaciones. Sencillo, rápido y efectivo.</p>
            </div>

            <div className="testimonial-carousel-wrapper">
                <button className="carousel-btn" onClick={prevSlide}>‹</button>
                <div className="testimonial-carousel-track">
                    {getVisibleTestimonials().map((testimonial, index) => {
                        const position = index - 2;
                        let className = "testimonial-card";

                        if (position === 0) className += " center";
                        else if (Math.abs(position) === 1) className += " side";
                        else className += " hidden";

                        return (
                            <div key={index} className={className}>
                                <p>"{testimonial.text}"</p>
                                <small>- {testimonial.author}</small>
                            </div>
                        );
                    })}
                </div>
                <button className="carousel-btn" onClick={nextSlide}>›</button>
            </div>
        </div>
    );
};