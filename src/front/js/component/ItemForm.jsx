import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

export const ItemForm = () => {
    const { store, actions } = useContext(Context)
    const [formValues, setFormValues] = useState({});

    const handleSubmit = (event) => {
        event.preventDefault()
        if (store.isEdit) {

        } else {
            actions.abmCreate(formValues)
            actions.simpleStoreSetter('isListView', true)
        }
    }

    const handleChange = (event) => {
        const { id, value } = event.target;
        setFormValues(prev => ({
            ...prev,
            [id]: value
        }));
    };
    useEffect(() => {
        const initialValues = {};
        const currentInputs = store.groups[store.activeGroup].formInputs;
        currentInputs.forEach(input => {
            initialValues[input.accessKey] = store.isEdit ? store.groups[store.activeGroup].items.find(el => el.id == store.itemId) : input.value;
        });
        setFormValues(initialValues);
    }, [store.activeGroup, store.itemId]);
    
    return (
        <div>
            <form onSubmit={handleSubmit}>
                {
                    store.groups[store.activeGroup].formInputs.map((item) =>
                    (
                        <div className="mb-3" key={item.accessKey}>
                            <label htmlFor={item.accessKey} className="form-label">{item.label}</label>
                            {item.type == 'text' &&
                                <input
                                    id={item.accessKey}
                                    className="form-control"
                                    type={item.type}
                                    value={formValues[item.accessKey] || ""}
                                    onChange={handleChange}
                                />
                            }
                            {item.type == 'dropdown' &&
                                <select onChange={handleChange} id={item.accessKey} className="form-select" value={formValues[item.accessKey] || ""}>
                                    {store.groups[item.fatherKey].items.map((optionItem) =>
                                        <option key={item.fatherKey + '-' + optionItem.id} value={optionItem.id}>{optionItem.name}</option>
                                    )}
                                </select>
                            }
                        </div>
                    )
                    )
                }
                <button className="btn btn-primary" type="submit">Crear</button>
            </form>

        </div>
    )
}