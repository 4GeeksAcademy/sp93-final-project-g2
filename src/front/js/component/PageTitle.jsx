import React, { useContext } from "react";
import { Context } from "../store/appContext";

export const PageTitle = (props)=>{
    const {store, actions} = useContext(Context)

    return (
        <>
        <div className="profile-header">
        <h1 className="profile-title">
         {props.title}
        </h1>
        <p className="profile-subtitle">
          {props.subtitle}
        </p>
      </div>
      </>
    )
}