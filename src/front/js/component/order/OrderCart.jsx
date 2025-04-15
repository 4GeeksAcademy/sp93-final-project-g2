
import React, { useContext, useState } from "react";
import { Context } from "../../store/appContext";
import { Calendar } from 'primereact/calendar';

export const OrderCart = () => {
    const { store, actions } = useContext(Context)
    const [quantities, setQuantities] = useState({});
    const [supplierContact, setSupplierContact] = useState({});
    const [deliveryDate, setDeliveryDate] = useState({});
    const [paymentMethod, setPaymentMethod] = useState({});
    const [branch, setBranch] = useState({});


    const [formValues, setFormValues] = useState(
        {
            supplierName: 'Proveedor Whatsapp',
            supplierContact_id: '',
            deliveryDate: '17-04-2025',
            orderMethod: 'whatsapp',
            orderDirection: '+34697934311',
            paymentMethod: 'Cheque',
            deliveryDirection: 'AV hola 34',
            products: [
                {
                    products_Suppliers_id: 0,
                    name: 'Producto 1',
                    quantity: 10
                },
            ],
        }
    );
    console.log('branches', store.entitiesData['branches'])
    const handleChange = (event) => {
        const { id, value } = event.target;
        setFormValues((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleDecrease = (id) => {
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max((prev[id] || 1) - 1, 1)
        }));
    };

    const handleIncrease = (id) => {
        setQuantities(prev => ({
            ...prev,
            [id]: (prev[id] || 1) + 1
        }));
    };
    const handleRemoveFromCart = (itemToRemove) => {
        const updatedCartProducts = { ...store.actualCart, products: store.actualCart.products.filter(item => item.id !== itemToRemove.id) };
        actions.simpleStoreSetter('actualCart', updatedCartProducts);

        const updatedItemList = [...store.orderFlowActiveItemList, itemToRemove];
        actions.simpleStoreSetter('orderFlowActiveItemList', updatedItemList);
    };
    return (
        <div className="col">
            <strong className="fs-3">{store.actualCart.supplierName || 'Proveedor'}</strong>
            <div className="mb-3" >
                <div>
                    <label htmlFor='supplierContact' className="form-label">Destinatario</label>
                    <select
                        id='supplierContact'
                        className="form-select"
                        value={supplierContact}
                        onChange={(e) => setSupplierContact(e.target.value)}
                    >
                        {store.entitiesData['supplierContacts'] && store.entitiesData['supplierContacts'].map((optionItem, index) => (
                            <option key={index} value={optionItem.id}>
                                {optionItem.last_name} {optionItem.first_name}, por {optionItem.order_method}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor='deliveryDate' className="form-label">Fecha de entrega</label>
                    <Calendar id="deliveryDate" showIcon dateFormat="dd/mm/yy" value={deliveryDate} onChange={(e) => setDeliveryDate(e.value)}></Calendar>
                </div>
                <div>
                    <label htmlFor='paymentMethod' className="form-label">Forma de pago</label>
                    <select
                        id='paymentMethod'
                        className="form-select"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        {store.enums['payment_method'].map((optionItem, index) => (
                            <option
                                key={`${optionItem.value}-${index}`}
                                value={optionItem.value}
                            >
                                {optionItem.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor='branch' className="form-label">Sucursal de Entrega</label>
                    <select
                        id='branch'
                        className="form-select"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                    >
                        {store.entitiesData['branches'] && store.entitiesData['branches'].map((optionItem, index) => (
                            <option key={index} value={optionItem.id}>
                                {optionItem.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {store.actualCart.products.length > 0 &&
                store.actualCart.products.map((article) =>
                    <div key={article.id} className="supplier-product-item card p-3 mb-3">
                        <p className="mb-2">{article.nickname}</p>
                        <p className="mb-1">{article.presentation}</p>
                        <p className="fw-bold text-success">Precio por unidad: ${article.price}</p>

                        <div className="d-flex align-items-center my-2">
                            <button className="btn btn-outline-secondary rounded-circle px-2 py-0"
                                onClick={() => handleDecrease(article.id)} >–</button>
                            <span className="col-1 mx-2 text-center">{quantities[article.id] || 1}</span>
                            <button className="btn btn-outline-secondary rounded-circle px-2 py-0"
                                onClick={() => handleIncrease(article.id)}>+</button>
                        </div>
                        <button className="btn btn-outline-danger" onClick={() => handleRemoveFromCart(article)}>
                            Quitar del carrito
                        </button>
                    </div>)
            }
        </div>
    )
}