import React from "react";

const dumpWhatsapp = {
    orderMethod: 'whatsapp',
    orderDirection: '+34697934511',
    supplierName: 'Proveedor Whatsapp',
    paymentMethod: 'Cheque',
    deliveryDate: '17-04-2025',
    deliveryDirection: 'AV hola 34',
    products: [
        { name: 'Producto 1', quantity: 10 },
        { name: 'Producto 2', quantity: 7 },
        { name: 'Producto 3', quantity: 2 },
        { name: 'Producto 4', quantity: 100 }
    ],
};

const dumpWhatsapp2 = {
    orderMethod: 'whatsapp',
    orderDirection: '+34697934511',
    supplierName: 'Proveedor Javi',
    paymentMethod: 'Efectivo',
    deliveryDate: '17-04-2025',
    deliveryDirection: 'AV hola 34',
    products: [
        { name: 'Producto 1', quantity: 10 },
        { name: 'Producto 2', quantity: 7 },
        { name: 'Producto 3', quantity: 2 },
        { name: 'Producto 4', quantity: 100 }
    ],
};

const dumpEmail = {
    orderMethod: 'email',
    orderDirection: 'isaurraldejuanm@gmail.com',
    supplierName: 'Proveedor Email',
    paymentMethod: 'Tarjeta Bancaria',
    deliveryDate: '20-04-2025',
    deliveryDirection: 'Calle del Ilustrísimo Javier Fuentes, 24',
    products: [
        { name: 'Producto 1', quantity: 10 },
        { name: 'Producto 2', quantity: 7 },
        { name: 'Producto 3', quantity: 2 },
        { name: 'Producto 4', quantity: 100 }
    ],
};



export const SendOrder = () => {

    const sendOrder = async (data) => {
        if (data.orderMethod === 'whatsapp') {
            const message = `📦 *Pedido Zuply*\n\n` +
                `*Proveedor:* ${data.supplierName}\n` +
                `*Método de pago:* ${data.paymentMethod}\n` +
                `*Fecha de entrega:* ${data.deliveryDate}\n` +
                `*Dirección:* ${data.deliveryDirection}\n\n` +
                `*Productos:*\n` +
                data.products.map(p => `- ${p.quantity} x ${p.name}`).join('\n');

            const whatsappUrl = `https://wa.me/${data.orderDirection}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, "_blank");

        } else if (data.orderMethod === 'email') {
            const token = localStorage.getItem("token");

            const bodyHtml = `
                <html>
                    <body>
                        <h2>📦 Pedido Zuply</h2>
                        <p><strong>Proveedor:</strong> ${data.supplierName}</p>
                        <p><strong>Método de pago:</strong> ${data.paymentMethod}</p>
                        <p><strong>Fecha de entrega:</strong> ${data.deliveryDate}</p>
                        <p><strong>Dirección de entrega:</strong> ${data.deliveryDirection}</p>
                        <p><strong>Productos:</strong></p>
                        <ul>
                            ${data.products.map(p => `<li>${p.quantity} x ${p.name}</li>`).join('')}
                        </ul>
                    </body>
                </html>
            `;

            try {
                const response = await fetch(`${process.env.BACKEND_URL}/api/orders/1/send-email`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        to: data.orderDirection,
                        subject: "Pedido Zuply",
                        html: bodyHtml
                    })
                });

                const json = await response.json();
                if (response.ok) {
                    alert("Correo enviado con éxito");
                } else {
                    alert("Error: " + json.message + "\nDetalles: " + (json.error || "Sin detalle"));
                }
            } catch (error) {
                alert("Error al enviar el correo");
                console.error(error);
            }
        }
    };

    /* FUNCIÓN ANTIGUA PARA EL WHATSAPP-CLICK (por si la queremos reutilizar) 
    const handleWhatsAppClick = () => {
         window.open(whatsappUrl, "_blank");
    }; */

    /* FUNCIÓN ANTIGUA PARA EL EMAIL-CLICK (por si la queremos reutilizar) 
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
    }; */

    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark text-white gap-3">
            <button className="btn btn-success btn-lg shadow" onClick={() => sendOrder(dumpWhatsapp)}>
                Enviar pedido por WhatsApp
            </button>
            <button className="btn btn-primary btn-lg shadow" onClick={() => sendOrder(dumpEmail)}>
                Enviar pedido por Correo
            </button>
        </div>
    );
};
