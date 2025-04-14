import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";

export const ItemList = () => {
    const { store, actions } = useContext(Context);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const [inputSearch, setInputSearch] = useState('')
    const handleNew = () => {
        actions.simpleStoreSetter('viewType', 'form');
        actions.simpleStoreSetter('isEdit', false);
        actions.simpleStoreSetter('itemId', null);
    }
    const handleSearch = (event) => {
        if (store.activeGroup && store.entitiesData[store.activeGroup].length > 1) {
            const inputText = event.target.value
            setInputSearch(inputText)
            const filterResult = store.entitiesData[store.activeGroup].filter((item) =>
                item[store.entitiesConfigData[store.activeGroup].showKey].toLowerCase().includes(inputText.toLowerCase())
            )
            actions.simpleStoreSetter('activeList', filterResult)
        }
    }
    const handleEdit = async (itemId) => {
        actions.simpleStoreSetter('itemId', itemId);
        actions.simpleStoreSetter('isEdit', true);
        actions.simpleStoreSetter('viewType', 'form');
    };
    const handleView = async (itemId) => {
        actions.simpleStoreSetter('itemId', itemId);
        actions.simpleStoreSetter('isEdit', false);
        actions.simpleStoreSetter('viewType', 'view');
    };

    const handleDeleteClick = (itemId) => {
        setItemToDelete(itemId); // Asigna el item a eliminar
        setShowDeleteModal(true); // Muestra el modal
    };

    const handleDeleteConfirm = async () => {
        if (itemToDelete) {
            actions.simpleStoreSetter('itemId', itemToDelete);
            actions.abmDelete();
        }
        setShowDeleteModal(false);
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false); // Solo cierra el modal si se cancela
    };

    return (
        <>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-2">
                <h2 className="m-0 mb-3 mb-md-0">{store.activeGroup ? store.entitiesConfigData[store.activeGroup].title : 'Seleccione Entidad'}</h2>
                {store.activeGroup &&
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="form-group has-search me-3 col-10 col-md-auto">
                            <span className="fa fa-search form-control-feedback"></span>
                            <input type="text" onChange={handleSearch} className="form-control" value={inputSearch} placeholder="filtrar" />
                        </div>
                        <span className="btn btn-primary btn-circle" onClick={handleNew}>
                            <i className="fa fa-plus"></i>
                        </span>
                    </div>
                }
            </div>
            <ul className="list-group list-view-container">
                {store.activeList && store.activeList.length > 0 && store.activeList.map((item, index) => (
                    <li key={`${index}-${item.id}`} className="list-group-item d-flex justify-content-between align-items-center">
                        <span >{item[store.entitiesConfigData[store.activeGroup].showKey]}</span>
                        <span className="col-2">
                            <div className="d-flex justify-content-end">
                                <span className="zuply-square-btn zuply-bg-verde text-white me-2" onClick={() => handleView(item.id)}>
                                    <i className="fa fa-eye"></i>
                                </span>
                                {store.user.role === 'Administrador' &&
                                    <>
                                        <span className="zuply-square-btn btn-warning text-white me-2" onClick={() => handleEdit(item.id)}>
                                            <i className="fa fa-edit"></i>
                                        </span>
                                        <span className="zuply-square-btn btn-danger" onClick={() => handleDeleteClick(item.id)}>
                                            <i className="fa fa-trash"></i>
                                        </span>
                                    </>
                                }
                            </div>
                        </span>

                    </li>
                ))}
            </ul>

            {/* Modal de confirmación para eliminar */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h5>Confirmar Eliminación</h5>
                            <button onClick={handleDeleteCancel} className="close-btn">×</button>
                        </div>
                        <div className="modal-body">
                            <p>¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.</p>
                        </div>
                        <div className="modal-footer">
                            <button onClick={handleDeleteCancel} className="btn-cancel">Cancelar</button>
                            <button onClick={handleDeleteConfirm} className="btn-delete">Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
