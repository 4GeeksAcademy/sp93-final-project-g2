import React from "react";

export const SendOrder = () => {
    const orderId = 1; // reemplazá esto por el ID real del pedido
    const phoneNumber = "+34697934511";

    const message = `*Pedido Zuply*\n\n*Restaurante:* La Taberna de Javi\n*Productos:*\n- 10kg de pollo\n- 5kg de ternera\n\n_*Dirección:* C/ Javi en su Taberna, 7\n*Fecha de entrega:* 25/04/2025`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    const handleWhatsAppClick = () => {
        window.open(whatsappUrl, "_blank");
    };

    const handleEmailClick = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.BACKEND_URL}/api/orders/${orderId}/send-email`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                alert("Correo enviado con éxito");
            } else {
                alert("Error: " + data.message);
            }
        } catch (error) {
            alert("Error al enviar el correo");
            console.error(error);
        }
    };

    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark text-white gap-3">
            <button className="btn btn-success btn-lg shadow" onClick={handleWhatsAppClick}>
                Enviar pedido por WhatsApp
            </button>
            <button className="btn btn-primary btn-lg shadow" onClick={handleEmailClick}>
                Enviar pedido por Correo
            </button>
        </div>
    );
};
