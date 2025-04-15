const sendOrder = (data)=>{
if(data.orderMethod == 'whatsapp'){

}
}

sendOrder(dumpWhatsapp)

const modelToSend = {
    orderMethod: '',
    orderDirection: 'si el orderMethod es wp iria el numero si es email iria el mail',

    supplierName: '',
    paymentMethod: '',
    deliveryDate: '',
    deliveryDirection: '',
    products: [{
        name: '',
        quantity: 0
    }],
}

const dumpWhatsapp = {
    orderMethod: 'whatsapp',
    orderDirection: '+34697934311',

    supplierName: 'Proveedor Whatsapp',
    paymentMethod: 'Cheque',
    deliveryDate: '17-04-2025',
    deliveryDirection: 'AV hola 34',
    products: [
        {
            name: 'Producto 1',
            quantity: 10
        },
        {
            name: 'Producto 2',
            quantity: 7
        },
        {
            name: 'Producto 3',
            quantity: 2
        },
        {
            name: 'Producto 4',
            quantity: 100
        }
    ],
}
const dumpEmail = {
    orderMethod: 'email',
    orderDirection: 'jfuentescasta.m@gmail.com',

    supplierName: 'Proveedor Email',
    paymentMethod: 'Efectivo',
    deliveryDate: '20-04-2025',
    deliveryDirection: 'Calle 10 esq 13',
    products: [
        {
            name: 'Producto 1',
            quantity: 10
        },
        {
            name: 'Producto 2',
            quantity: 7
        },
        {
            name: 'Producto 3',
            quantity: 2
        },
        {
            name: 'Producto 4',
            quantity: 100
        }
    ],
}
