import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/home.css";

export const Home = () => {
    const { store, actions } = useContext(Context);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        actions.loadTestimonials();
    }, []);

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
        <div className="text-center" style={{ backgroundColor: '#f4f3ef', minHeight: '100vh', padding: '0' }}>
            <div className="hero-section">
                <h1 className="hero-title">
                    Bienvenido a Zuply{store.user && <span>, <span style={{ color: '#95c11f' }}>{store.user.username}</span></span>}
                </h1>
                <p className="hero-subtitle">Gestión de pedidos sin complicaciones. Sencillo, rápido y efectivo.</p>
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
