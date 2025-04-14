import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext.js";
import { SupplierProductCard } from "../SupplierProductCard.jsx";

export const OrderNavbar = () => {
    const { store, actions } = useContext(Context)
    const [history, setHistory] = useState({})

    const handleHistory = (selectedId, prevNext) => {
        if (prevNext < 0) {
            const newHistory = delete history[store.orderFlowActive.entityKey];
            setHistory(newHistory)
            return
        }
        if (selectedId > -1) {
            setHistory({ ...history, [store.orderFlowActive.entityKey]: selectedId });
        }
    }
    const setList = (selectedId, prevNext) => {

        handleHistory(selectedId, prevNext)

        const nextFlowId = store.orderFlowActive.id + prevNext

        if (nextFlowId == 0) {
            actions.simpleStoreSetter('orderFlowActive', store.orderFlowGeneralItem)
            return
        }


        const nextEntityKey = store.orderFlow[nextFlowId]
        const nextEntityConfig = store.entitiesConfigData[nextEntityKey]
        const prevRelationshipKey = nextEntityConfig['relationshipKey'] || false
        
        
        
        let idTofilter = null
        if (prevNext < 0) {
            idTofilter = history[store.orderFlow[nextFlowId] - 1]
        } else {
            if (nextFlowId == 0 || nextFlowId == 1) idTofilter = null
            else if (selectedId) idTofilter = selectedId
            else idTofilter = history[nextEntityKey]
        }


        const idTofilter2 = nextFlowId == 0 || nextFlowId == 1 ? null : selectedId ? selectedId : history[nextEntityKey]

        console.log('nextEntityKey', nextEntityKey)
        console.log('nextEntityConfig', nextEntityConfig)
        console.log('prevRelationshipKey', prevRelationshipKey)
        console.log('idTofilter', idTofilter)

        const nextItemList = idTofilter ? store.entitiesData[nextEntityKey].filter((item) => item[prevRelationshipKey] == idTofilter) : store.entitiesData[nextEntityKey]

        const orderFlowActiveNew = {
            id: nextFlowId,
            title: nextEntityConfig['title'],
            entityKey: nextEntityKey,
            showKey: nextEntityConfig['showKey'],
            itemList: nextItemList,
        }
        actions.simpleStoreSetter('orderFlowActive', orderFlowActiveNew)

        console.log('==================================')
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