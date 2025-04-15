import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext.js";
import { SupplierProductCard } from "../SupplierProductCard.jsx";

export const OrderNavbar = () => {
    const { store, actions } = useContext(Context)
    const [history, setHistory] = useState({})
    const [inputSearch, setInputSearch] = useState('')
    const handleSearch = (event) => {
        const inputText = event.target.value
        setInputSearch(inputText)
        const filterResult = store.orderFlowActiveObject.itemList.filter((item) =>
            item[store.entitiesConfigData[store.orderFlowActiveObject.entityKey].showKey].toLowerCase().includes(inputText.toLowerCase())
        )
        
        actions.simpleStoreSetter('orderFlowActiveItemList', filterResult)
    }

    const handleHistory = (nextEntityKey, relationshipKey, idTofilter, prevNext) => {

        if (prevNext < 0) {
            const activeEntityKey = store.orderFlowActiveObject.entityKey
            setHistory({ ...history, [activeEntityKey]: null })
            return
        } else {
            setHistory({ ...history, [nextEntityKey]: { idToFilter: idTofilter, keyTofilter: relationshipKey } });
        }

    }
    const setList = (selectedId, prevNext) => {
        const nextFlowId = typeof (store.orderFlowActiveObject.id) !== 'string' ? store.orderFlowActiveObject.id + prevNext : 1
        if (nextFlowId == 0) {
            actions.simpleStoreSetter('orderFlowActiveObject', store.orderFlowGeneralItem)
            actions.simpleStoreSetter('orderFlowActiveItemList', store.orderFlowGeneralItem.itemList)
            return
        }

        const nextEntityKey = store.activeOrderFlow[nextFlowId]
        const nextEntityConfig = store.entitiesConfigData[nextEntityKey]

        if (selectedId == 'categories' || nextEntityKey == 'categories') {
            const orderFlowCategories = {
                id: nextFlowId,
                title: nextEntityConfig['title'],
                entityKey: nextEntityKey,
                showKey: nextEntityConfig['showKey'],
                itemList: store.entitiesData[nextEntityKey],
            }
            actions.simpleStoreSetter('orderFlowActiveObject', orderFlowCategories)
            actions.simpleStoreSetter('orderFlowActiveItemList', store.entitiesData[nextEntityKey])
            return
        }
        let idTofilter = null
        let nextItemList = []
        let relationshipKey = ''

        if (prevNext > 0) {
            idTofilter = selectedId
            relationshipKey = store.orderFlowActiveObject.entityKey !== 'general' ? store.orderFlowActiveObject.entityKey + '_id' : null
            nextItemList = relationshipKey ? store.entitiesData[nextEntityKey].filter((item) => item[relationshipKey] == idTofilter) : store.entitiesData[nextEntityKey]
        } else {
            idTofilter = history[nextEntityKey].idToFilter
            relationshipKey = history[nextEntityKey].keyTofilter
            nextItemList = idTofilter ? store.entitiesData[nextEntityKey].filter((item) => item[relationshipKey] == idTofilter) : store.entitiesData[nextEntityKey]
        }

        handleHistory(nextEntityKey, relationshipKey, idTofilter, prevNext)

        const orderFlowActiveObjectNew = {
            id: nextFlowId,
            title: nextEntityConfig['title'],
            entityKey: nextEntityKey,
            showKey: nextEntityConfig['showKey'],
            itemList: nextItemList,
        }
        actions.simpleStoreSetter('orderFlowActiveObject', orderFlowActiveObjectNew)
        actions.simpleStoreSetter('orderFlowActiveItemList', nextItemList)

    }
    const handleSelect = (selectedId = null, breadcrum) => {
        if (typeof (selectedId) === 'string') {
            actions.simpleStoreSetter('activeOrderFlow', store.orderFlow[selectedId])
            setList(0, 1)
        } else if (store.activeOrderFlow.length - 1 > store.orderFlowActiveObject.id) {
            setList(selectedId, 1)
        }
        actions.updateBreadcrums(breadcrum)
    }
    const handleBack = () => {
        setList(null, -1)
        actions.updateBreadcrums('back')
    }
    return (
        <div className="col-4 d-flex flex-column align-items-center" >
            <div className="d-flex justify-content-between align-items-center w-75">
                <div className="fs-3 zuply-text-azul">{store.orderFlowActiveObject['title']}</div>
                {store.breadcrumItems.length > 0 &&
                    <span className="btn zuply-bg-azul btn-circle fix-btn-hover" onClick={handleBack}>
                        <i className="pi pi-angle-left"></i>
                    </span>
                }
            </div>
            {!store.orderFlowActiveItemList || store.orderFlowActiveItemList.length === 0 ?
                <div> No hay elementos disponibles </div>
                :
                <>
                    {
                        store.orderFlowActiveObject.entityKey == 'suppliers_products' &&
                        <div className="form-group has-search col-10 col-md-auto">
                            <span className="fa fa-search form-control-feedback"></span>
                            <input type="text" onChange={handleSearch} className="form-control" value={inputSearch} placeholder="filtrar" />
                        </div>
                    }
                    {
                        store.orderFlowActiveItemList.map((item) => {
                            return (
                                <div key={item.id} className="order-item">
                                    {store.orderFlowActiveObject.entityKey == 'suppliers_products' ?
                                        <SupplierProductCard item={item} />
                                        :
                                        <button className="button-order" onClick={() => handleSelect(item.id, item[store.orderFlowActiveObject.showKey])}>
                                            {item[store.orderFlowActiveObject.showKey]}
                                        </button>
                                    }
                                </div>
                            )
                        })
                    }
                </>
            }
        </div>
    )
}