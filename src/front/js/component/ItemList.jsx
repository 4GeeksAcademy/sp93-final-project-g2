import React, { useContext } from "react";
import { Context } from "../store/appContext";

export const ItemList = () => {
    const { store, actions } = useContext(Context)
    const handleDelete = ()=>{}
    const handleEdit = () => {}
    return (
        <ul className="list-group">
            {store.groups[store.activeGroup].items.map((item, index) =>
                <li key={`${index}-${item.id}`} className="list-group-item d-flex justify-content-between align-items-center">
                    <span >{item.name}</span>
                    <span className="col-md-2">
                        <div className=" d-flex justify-content-end">
                            <span className="btn btn-warning text-white me-2" onClick={() => handleEdit(item.id)}>
                                <i className="fa fa-edit"></i>
                            </span>
                            <span className="btn btn-danger" onClick={() => handleDelete(item.id)}>
                                <i className="fa fa-trash"></i>
                            </span>
                        </div>
                    </span>
                </li>
            )}
        </ul>
    )
}