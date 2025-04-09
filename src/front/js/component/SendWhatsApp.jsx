import React from "react";

export const SendWhatsApp = () => {
    const phoneNumber = "+34697934511";
    const message = "Mi primer WhatsApp de \nZuply";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    const handleClick = () => {
        window.open(whatsappUrl, "_blank");
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
            <button className="btn btn-success btn-lg shadow" onClick={handleClick}>
                Enviar WhatsApp
            </button>
        </div>
    );
};
