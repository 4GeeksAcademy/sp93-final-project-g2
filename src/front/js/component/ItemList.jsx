import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";

export const ItemList = () => {
    const { store, actions } = useContext(Context);
    
    // Estado para controlar la visibilidad del modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null); // Para saber qué item se va a eliminar

    const handleEdit = async (itemId) => {
        actions.simpleStoreSetter('itemId', itemId);
        actions.simpleStoreSetter('isEdit', true);
        actions.simpleStoreSetter('isListView', false);
    };

    const handleDeleteClick = (itemId) => {
        setItemToDelete(itemId); // Asigna el item a eliminar
        setShowDeleteModal(true); // Muestra el modal
    };

    const handleDeleteConfirm = async () => {
        if (itemToDelete) {
            actions.abmDelete(itemToDelete); // Elimina el item
        }
        setShowDeleteModal(false); // Cierra el modal después de eliminar
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false); // Solo cierra el modal si se cancela
    };

    return (
        <>
            <ul className="list-group list-view-container">
                {store.activeList.map((item, index) => (
                    <li key={`${index}-${item.id}`} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>{item[store.abmGroups[store.activeGroup].showKey]}</span>
                        <span className="col-md-2">
                            <div className="d-flex justify-content-end">
                                <span className="zuply-square-btn btn-warning text-white me-2" onClick={() => handleEdit(item.id)}>
                                    <i className="fa fa-edit"></i>
                                </span>
                                <span className="zuply-square-btn btn-danger" onClick={() => handleDeleteClick(item.id)}>
                                    <i className="fa fa-trash"></i>
                                </span>
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
