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

    return (
        <div className="text-center mt-5" style={{ backgroundColor: '#f4f3ef', minHeight: '100vh', padding: '0' }}>
            <div className="hero-section">
                <img
                    
                    alt="Zuply Logo"
                    className="hero-logo"
                />
                <h1 className="hero-title">
                    Bienvenido a Zuply{store.user && <span>, <span style={{ color: '#95c11f' }}>{store.user.username}</span></span>}
                </h1>
                <p className="hero-subtitle">Gestión de pedidos sin complicaciones. Sencillo, rápido y efectivo.</p>
            </div>

            <div className="testimonial-carousel-outer">
                <div className="testimonial-carousel">
                    <div>
                        <button className="carousel-btn" onClick={prevSlide}>‹</button>
                        {store.testimonials.length > 0 && (
                            <div className="testimonial-card fade-slide">
                                <p>"{store.testimonials[current].text}"</p>
                                <small>- {store.testimonials[current].author}</small>
                            </div>
                        )}
                        <button className="carousel-btn" onClick={nextSlide}>›</button>
                    </div>
                    <div className="carousel-indicators">
                        {store.testimonials.map((_, index) => (
                            <span
                                key={index}
                                className={`indicator-dot ${index === current ? 'active' : ''}`}
                                onClick={() => setCurrent(index)}
                            ></span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
