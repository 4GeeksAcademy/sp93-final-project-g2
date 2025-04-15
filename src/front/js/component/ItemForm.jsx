import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { AutoComplete } from "primereact/autocomplete";

export const ItemForm = () => {
    const { store, actions } = useContext(Context);
    const [formValues, setFormValues] = useState({});
    const [autocompleteData, setAutocompleteData] = useState({});
    const [selectedValues, setSelectedValues] = useState({});

    const handleSubmit = (event) => {
        event.preventDefault();
        if (store.isEdit) {
            actions.abmUpdate(formValues);
            actions.simpleStoreSetter("viewType", "list");
        } else {
            actions.abmCreate(formValues);
            actions.simpleStoreSetter("viewType", "list");
        }
    };

    const handleChange = (event) => {
        const { id, value } = event.target;
        setFormValues((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    useEffect(() => {
        const initialValues = {};
        const initAutocompleteOptions = {};
        const currentInputs = store.entitiesConfigData[store.activeGroup].formInputs;
        const objectToEdit = store.activeList && store.activeList.find((el) => el.id == store.itemId) || {};

        currentInputs.forEach((input) => {
            initialValues[input.accessKey] = store.isEdit
                ? objectToEdit[input.accessKey]
                : input.value;
            if (input.type === "autocomplete") {
                const fullData = store.entitiesData[input.fatherKey] || [];
                initAutocompleteOptions[input.fatherKey] = {
                    fullData,
                    filteredData: [...fullData],
                    selected: null,
                };
            }
        });

        setAutocompleteData(initAutocompleteOptions);
        setFormValues(initialValues);
    }, [
        store.activeGroup,
        store.user,
        store.entitiesData,
        store.activeList,
        store.isEdit,
        store.entitiesConfigData,
    ]);


    const search = React.useCallback((event, fatherKey) => {
        setAutocompleteData((prevData) => { 
            const fullData = prevData[fatherKey]?.fullData || [];
            const _filteredData = !event.query?.trim()?.length
                ? fullData
                : fullData.filter((data) =>
                    data.name.toLowerCase().includes(event.query.toLowerCase())
                );
            return {
                ...prevData,
                [fatherKey]: {
                    ...prevData[fatherKey],
                    filteredData: _filteredData,
                },
            };
        });
    }, []);

    return (
        <div>
            <div className="d-flex justify-content-between">
                <h2>
                    {store.isEdit ? "Editar " : "Agregar "}
                    {store.entitiesConfigData[store.activeGroup].title}
                </h2>
                <span
                    className="btn btn-danger btn-circle"
                    onClick={() => actions.simpleStoreSetter("viewType", "list")}
                >
                    <i className="fa fa-cancel"></i>
                </span>
            </div>
            <form onSubmit={handleSubmit}>
                {store.entitiesConfigData[store.activeGroup].formInputs.map((item) => (
                    
                    <div className="mb-3" key={item.accessKey}>
                        <label htmlFor={item.accessKey} className="form-label">
                            {item.label}
                        </label>
                        {item.type === "text" && (
                            <input
                                id={item.accessKey}
                                className="form-control"
                                type={item.type}
                                value={formValues[item.accessKey] || ""}
                                onChange={handleChange}
                            />
                        )}
                        {item.type === "dropdown" && (
                            <select
                                id={item.accessKey}
                                className="form-select"
                                value={formValues[item.accessKey] || ""}
                                onChange={handleChange}
                            >
                                {store.entitiesData[item.fatherKey].map((optionItem) => (
                                    <option
                                        key={`${item.fatherKey}-${optionItem.id}`}
                                        value={optionItem.id}
                                    >
                                        {optionItem.name}
                                    </option>
                                ))}
                            </select>
                        )}
                        {item.type === "enum" && (
                            <select
                                id={item.accessKey}
                                className="form-select"
                                value={formValues[item.accessKey] || ""}
                                onChange={handleChange}
                            >
                                {store.enums[item.accessKey].map((optionItem, index) => (
                                    <option
                                        key={`${optionItem.value}-${index}`}
                                        value={optionItem.value}
                                    >
                                        {optionItem.label}
                                    </option>
                                ))}
                            </select>
                        )}
                        {item.type === "autocomplete" && autocompleteData[item.fatherKey]?.fullData && ( 
                            <AutoComplete
                                field="name"
                                id={item.accessKey}
                                value={selectedValues[item.accessKey] || null}
                                suggestions={autocompleteData[item.fatherKey]?.filteredData || autocompleteData[item.fatherKey]?.fullData}
                                completeMethod={(e) => search(e, item.fatherKey)}
                                dropdown
                                dropdownMode = 'current'
                                forceSelection
                                onDropdownClick={() => {search({ query: "" }, item.fatherKey)}}
                                onChange={(e) => {
                                    const newValue = e.value;
                                    setSelectedValues((prev) => ({
                                        ...prev,
                                        [item.accessKey]: newValue,
                                    }));
                                    setFormValues((prev) => ({
                                        ...prev,
                                        [item.accessKey]: newValue,
                                    }));
                                }}
                            />

                        )}
                    </div>
                ))}
                <div className="d-flex">
                    <button className="btn btn-primary ms-auto" type="submit">
                        {store.isEdit ? "Guardar" : "Crear"}
                    </button>
                </div>
            </form>
        </div>
    );
};
