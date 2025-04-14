import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/pageTitle.css"

export const PageTitle = (props) => {
    const { store } = useContext(Context); 

    return (
        <div className="username-header">
            <h1 className="username-title">
                {props.title} 
                {store.user && store.user.username && (
                    <span className="username-highlight">{store.user.username}</span>
                )}
            </h1>
            <p className="username-subtitle">{props.subtitle}</p>
        </div>
    );
};
