import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/entitiesNavbar.css";
export const EntitiesNavbar = () => {
    const { store, actions } = useContext(Context)
    const handleSelect = (groupKey) => {
        actions.setListViewConfig(groupKey, 'list', store.entitiesData[groupKey])
    }
    return (
        <div className="col-12 col-sm-4 col-md-3 col-lg-2 entities-navbar p-sm-2">
            <ul className="entities-navbar-group d-flex flex-row flex-sm-column justify-content-center justify-content-sm-start">
                {
                    store.entitiesListActive.map((groupKey, index) => {
                        const isLastItem = index === store.entitiesListActive.length - 1;
                        const isActive = groupKey === store.activeGroup;
                        return (
                            <li
                                key={groupKey}
                                className={`
                                            entities-navbar-item
                                            d-flex 
                                            flex-column flex-sm-row 
                                            justify-content-center justify-content-sm-start 
                                            align-items-center
                                            ${!isLastItem && "entities-navbar-item-border"}
                                            ${isActive && "activeGroup"}
                                            zupli-text-overflow
                                            `}
                                onClick={() => handleSelect(groupKey)}
                            >
                                <div className="d-flex justify-content-center justify-content-sm-start col-12 col-sm-2">
                                    <i className={`fa fa-${store.entitiesConfigData[groupKey].icon}`}></i>
                                </div>
                                {store.entitiesConfigData[groupKey].title}
                            </li>
                        );
                    })
                }
            </ul>
        </div>


    )
}