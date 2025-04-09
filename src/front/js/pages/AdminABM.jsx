import React, { useContext, useEffect, useState } from "react";
import { ItemList } from "../component/ItemList.jsx";
import { Context } from "../store/appContext.js";
import { ItemForm } from "../component/ItemForm.jsx";
import { EntitiesNavbar } from "../component/EntitiesNavbar.jsx";

export const AdminABM = () => {
    const { store, actions } = useContext(Context)
    const [inputSearch, setInputSearch] = useState('')
    const handleNew = () => {
        actions.simpleStoreSetter('isListView', false);
        actions.simpleStoreSetter('isEdit', false);
        actions.simpleStoreSetter('itemId', null);
    }
    const handleSearch = (event)=>{
        const inputText = event.target.value
        setInputSearch(inputText)
        const filterResult = store.abmGroups[store.activeGroup].items.filter((item) =>
            item[store.abmGroups[store.activeGroup].showKey].toLowerCase().includes(inputText.toLowerCase())
          )
        actions.simpleStoreSetter('activeList', filterResult)
    }
    useEffect(() => {
        actions.getInitAdminData()
    }, [])

    return (
        <div className="">
            <div className="d-flex flex-column flex-sm-row">
                <EntitiesNavbar />
                {store.activeList.length > 0 ?
                    <main className="col-12 col-sm-8 col-md-9 col-lg-10 p-3 view-container">
                        {store.isListView ?
                            <div>
                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-2">
                                    <h2 className="m-0 mb-3 mb-md-0">{store.abmGroups[store.activeGroup].title}</h2>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="form-group has-search me-3 col-10 col-md-auto">
                                            <span className="fa fa-search form-control-feedback"></span>
                                            <input type="text" onChange={handleSearch} className="form-control" value={inputSearch} placeholder="filtrar" />
                                        </div>
                                        <span className="btn btn-primary btn-circle" onClick={handleNew}>
                                            <i className="fa fa-plus"></i>
                                        </span>
                                    </div>
                                </div>
                                <ItemList />
                            </div> :
                            <div>
                                <div className="d-flex justify-content-between">
                                    <h2>{store.isEdit ? 'Editar ' : 'Agregar'} {store.abmGroups[store.activeGroup].title}</h2>
                                    <span className="btn btn-danger btn-circle" onClick={() => actions.simpleStoreSetter('isListView', true)}>
                                        <i className="fa fa-cancel"></i>
                                    </span>
                                </div>
                                <ItemForm />
                            </div>}
                    </main> :
                    <h1 className="w-100 d-flex justify-content-center align-items-center">Seleccione Entidad</h1>
                }
            </div>
        </div>
    )
}