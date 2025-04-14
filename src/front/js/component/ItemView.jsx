import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

export const ItemView = () => {
    const { store, actions } = useContext(Context);
    const [formValues, setFormValues] = useState({});

    useEffect(() => {

        const initialValues = {};
        const currentInputs = store.entitiesConfigData[store.activeGroup].formInputs;
        const objectToEdit = store.activeList.find(el => el.id == store.itemId)
        currentInputs.forEach(input => {
            initialValues[input.accessKey] = { label: input.label, value: objectToEdit[input.accessKey] };
        });
        setFormValues(initialValues);
    }, [store.activeGroup, store.itemId]);

    return (
        <div>
            <div className="d-flex justify-content-between">
                <h2>Detalles</h2>
                <span className="btn btn-danger btn-circle" onClick={() => actions.simpleStoreSetter('viewType', 'list')}>
                    <i className="fa fa-cancel"></i>
                </span>
            </div>
            {
                Object.values(formValues).map((item, index) =>
                    <div key={index} className="mb-3 d-flex align-items-center" >
                        <p className="fs-5 me-2">{item.label}:</p>
                        <p>{item.value}</p>
                    </div>
                )
            }
        </div>
    )
}
