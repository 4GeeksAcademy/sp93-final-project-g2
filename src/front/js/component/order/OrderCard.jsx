import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { OrderABM } from "./OrderABM.jsx";

export const OrderCard = () => {
    const { store, actions } = useContext(Context)
    const [history, setHistory] = useState({})
    const [breadcrumItems, setBreadcrumItems] = useState([])
    const handleBreadcrums = (breadcrumLocal) => {
        //todo crear la navegacion correspondiente al hacer click en el breadcrum
        console.log('breadcrumLocal', breadcrumLocal)
    }
    const setList = (selectedId, prevNext) => {
        const flowId = store.orderFlowActive.id + prevNext
        const entityKey = store.orderFlow[flowId]
        const entityConfig = store.entitiesConfigData[entityKey]
        const relationshipKey = entityConfig['relationshipKey']
        const filterId = flowId == 0 ? null : selectedId ? selectedId : history[entityKey]
        const itemList = filterId ? store.entitiesData[entityKey].filter((item) => item[relationshipKey] == filterId) : store.entitiesData[entityKey]

        setHistory({ ...history, [entityKey]: filterId })
        const orderFlowActiveNew = {
            id: flowId,
            title: entityConfig['title'],
            entityKey: entityKey,
            showKey: entityConfig['showKey'],
            itemList: itemList,
        }
        actions.simpleStoreSetter('orderFlowActive', orderFlowActiveNew)
    }
    const handleSelect = (selectedId = null, breadcrum) => {
        if (store.orderFlow.length - 1 > store.orderFlowActive.id) {
            setList(selectedId, 1)
        }
        const breadcrumIndex = breadcrumItems.indexOf(breadcrum)
        const breadcrumsAux = breadcrumIndex == -1 ? [...breadcrumItems, breadcrum] : breadcrumItems.slice(0, breadcrumIndex)

        setBreadcrumItems(breadcrumsAux)
    }
    const handleBack = () => {
        if (store.orderFlowActive.id > 0) {
            setList(null, -1)
        }
        setBreadcrumItems(prev => prev.slice(0, -1))
    }
    return (
        <div >
            <nav className="breadcrum-divider-zuply" aria-label="breadcrumb">
                <ol className="breadcrumb">
                    {breadcrumItems.map((item) =>
                        <li key={item} className="breadcrumb-item">
                            <span onClick={() => handleBreadcrums(item)}>{item}</span>
                        </li>
                    )}
                </ol>
            </nav>
            <div className="d-flex justify-content-between align-items-center mx-4">
                <div className="fs-3">Selecciona {store.orderFlowActive['title']}</div>
                { breadcrumItems.length > 0 &&
                    <button className="btn zuply-bg-azul fix-btn-hover" onClick={handleBack}>Volver</button>
                }
            </div>
            {!store.orderFlowActive.itemList || store.orderFlowActive.itemList.length === 0 ?
                <div> No hay elementos disponibles </div>
                :
                store.orderFlowActive.itemList.map((item) => (
                    <div key={item.id} className="subcategory-item">
                        {store.orderFlowActive.entityKey == 'suppliers_products' ?
                            <OrderABM item={item}/> :
                            <button className="button-order" onClick={() => handleSelect(item.id, item[store.orderFlowActive.showKey])}>
                                {item[store.orderFlowActive.showKey]}
                            </button>
                        }
                    </div>
                ))
            }
        </div>
    )
}