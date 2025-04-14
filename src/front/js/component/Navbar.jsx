import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext.js";
import { NavbarMenu } from "./NavbarMenu.jsx";
import { NavbarLogin } from "./NavbarLogin.jsx";
import LogoNavbar from "../../img/logoZuplyHorizontal.svg";

export const Navbar = () => {
    const { store } = useContext(Context);
    const navigate = useNavigate();

    const goHome = () => {
        navigate("/");
    };

    return (
        <nav className="navbar navbar-light zuply-bg-beige">
            <div className="container-fluid">
                <NavbarMenu />
                <LogoNavbar className="logo original" onClick={goHome} />
                <NavbarLogin />
            </div>
        </nav>
    );
};
