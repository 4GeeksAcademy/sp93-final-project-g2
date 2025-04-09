import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

export const ItemForm = () => {
    const { store, actions } = useContext(Context)
    const [formValues, setFormValues] = useState({});

    const handleSubmit = (event) => {
        event.preventDefault()
        if (store.isEdit) {
            actions.abmUpdate(formValues)
            actions.simpleStoreSetter('isListView', true)   
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
        const currentInputs = store.abmGroups[store.activeGroup].formInputs;
        const objectToEdit = store.activeList.find(el => el.id == store.itemId)
        currentInputs.forEach(input => {
            initialValues[input.accessKey] = store.isEdit ? objectToEdit[input.accessKey] : input.value;
        });
        setFormValues(initialValues);
    }, [store.activeGroup, store.itemId]);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                {
                    store.abmGroups[store.activeGroup].formInputs.map((item) =>
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
                                    {store.abmGroups[item.fatherKey].items.map((optionItem) =>
                                        <option key={item.fatherKey + '-' + optionItem.id} value={optionItem.id}>{optionItem.name}</option>
                                    )}
                                </select>
                            }
                            {item.type == 'enum' &&
                                <select onChange={handleChange} id={item.accessKey} className="form-select" value={formValues[item.accessKey] || ""}>
                                    {store.enums[item.accessKey].map((optionItem, index) =>
                                        <option key={optionItem.value + '-' + index} value={optionItem.value}>{optionItem.label}</option>
                                    )}
                                </select>
                            }
                        </div>
                    )
                    )
                }
                <div className="d-flex">
                    <button className="btn btn-primary ms-auto" type="submit">{store.isEdit ? 'Guardar' : 'Crear'}</button>
                </div>
            </form>

        </div>
    )
}