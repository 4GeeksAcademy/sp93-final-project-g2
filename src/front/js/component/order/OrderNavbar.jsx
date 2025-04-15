import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext.js";
import { SupplierProductCard } from "../SupplierProductCard.jsx";

export const OrderNavbar = () => {
    const { store, actions } = useContext(Context)
    const [history, setHistory] = useState({})

    const handleHistory = (nextEntityKey, relationshipKey, idTofilter, prevNext) => {
        if (prevNext < 0) {
            const activeEntityKey = store.orderFlowActive.entityKey
            setHistory({...history, [activeEntityKey]: null})
            return
        } else {
            setHistory({ ...history, [nextEntityKey]: {idToFilter: idTofilter, keyTofilter:  relationshipKey } });
        }

    }
    const setList = (selectedId, prevNext) => {

        const nextFlowId = store.orderFlowActive.id + prevNext

        if (nextFlowId == 0) {
            actions.simpleStoreSetter('orderFlowActive', store.orderFlowGeneralItem)
            return
        }
        
        const nextEntityKey = store.orderFlow[nextFlowId]
        const nextEntityConfig = store.entitiesConfigData[nextEntityKey]
        

        if(nextEntityKey == 'categories'){
            const orderFlowCategories = {
                id: nextFlowId,
                title: nextEntityConfig['title'],
                entityKey: nextEntityKey,
                showKey: nextEntityConfig['showKey'],
                itemList: store.entitiesData[nextEntityKey],
            }
            actions.simpleStoreSetter('orderFlowActive', orderFlowCategories)
            return
        }
        let idTofilter = null
        let nextItemList = []
        let relationshipKey = ''
        console.log('history', history)
        if (prevNext > 0){
            idTofilter = selectedId
            relationshipKey = nextEntityConfig['relationshipKey'] || false
            nextItemList = relationshipKey ? store.entitiesData[nextEntityKey].filter((item) => item[relationshipKey] == idTofilter) : store.entitiesData[nextEntityKey]
        } else {
            idTofilter = history[nextEntityKey].idToFilter
            relationshipKey = history[nextEntityKey].keyTofilter
            nextItemList = idTofilter ? store.entitiesData[nextEntityKey].filter((item) => item[relationshipKey] == idTofilter) : store.entitiesData[nextEntityKey]
        }
        
        handleHistory(nextEntityKey, relationshipKey, idTofilter, prevNext)
       
        const orderFlowActiveNew = {
            id: nextFlowId,
            title: nextEntityConfig['title'],
            entityKey: nextEntityKey,
            showKey: nextEntityConfig['showKey'],
            itemList: nextItemList,
        }
        actions.simpleStoreSetter('orderFlowActive', orderFlowActiveNew)

    }
    const handleSelect = (selectedId = null, breadcrum) => {
        if (store.orderFlow.length - 1 > store.orderFlowActive.id) {
            setList(selectedId, 1)
        }
        actions.updateBreadcrums(breadcrum)
    }
    const handleBack = () => {
        setList(null, -1)
        actions.updateBreadcrums('back')
    }
    return (
        <div className="col-5" >
            <div className="d-flex justify-content-between align-items-center mx-4">
                <div className="fs-3 zuply-text-azul">{store.orderFlowActive['title']}</div>
                {store.breadcrumItems.length > 0 &&
                    <span className="btn zuply-bg-azul btn-circle fix-btn-hover" onClick={handleBack}>
                        <i className="pi pi-angle-left"></i>
                    </span>
                }
            </div>
            {!store.orderFlowActive.itemList || store.orderFlowActive.itemList.length === 0 ?
                <div> No hay elementos disponibles </div>
                :
                store.orderFlowActive.itemList.map((item) => {
                    return (
                        <div key={item.id} className="order-item">
                            {store.orderFlowActive.entityKey == 'suppliers_products' ?
                                <SupplierProductCard item={item} />
                                :
                                <button className="button-order" onClick={() => handleSelect(item.id, item[store.orderFlowActive.showKey])}>
                                    {item[store.orderFlowActive.showKey]}
                                </button>
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}