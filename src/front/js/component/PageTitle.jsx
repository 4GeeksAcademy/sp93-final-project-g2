import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/pageTitle.css"

export const PageTitle = (props) => {
    const { store } = useContext(Context);

    return (
        <div className="username-header">
            <h1 className="username-title">
                {props.title}
                {props.titleGreen && (
                    <span className="username-highlight">{props.titleGreen}</span>
                )}
            </h1>
            { props.subtitle &&
                <p className="username-subtitle">{props.subtitle}</p>
            }
        </div>
    );
};
