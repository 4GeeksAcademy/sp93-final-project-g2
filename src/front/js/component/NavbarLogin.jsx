import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext.js";

export const NavbarLogin = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const handleLogout = () => {
        actions.logout();
        navigate("/");
    };

    return (
        <div className="ml-auto dropdown">
            <button
                className="btn rounded-circle p-3 border-0 d-flex align-items-center justify-content-center"
                style={{ backgroundColor: store.token ? '#28a745' : '#6c757d' }}
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <i className="fas fa-user text-white"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                {store.token ? (
                    <>
                        <li><Link className="dropdown-item" to="/profile">Ver perfil</Link></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><button className="dropdown-item" onClick={handleLogout}>Cerrar sesión</button></li>
                    </>
                ) : (
                    <li><Link className="dropdown-item" to="/login">Iniciar sesión</Link></li>
                )}
            </ul>
        </div>
    );
};