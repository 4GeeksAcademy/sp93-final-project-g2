import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext.js";

export const NavbarMenu = () => {
    const { store } = useContext(Context);
    const role = store.user?.role;
    const navigate = useNavigate();
    const goTo = (group) => {
        navigate('/' + group)
    }
    if (!store.token || role === "visitante") return null;

    return (
        <>
            <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="offcanvas offcanvas-start offcanvas-custom custom-bg" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Menú</h5>
                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>
                </div>
                <div className="offcanvas-body bg-beige">
                    <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                        {(role === "Administrador" || role === "Gestor_de_pedidos" || role === "Receptor_de_pedidos") && (
                            <>
                                <li className="nav-item dropdown w-100 pb-3">
                                    <button
                                        className="btn btn-secondary w-100 d-flex justify-content-between align-items-center"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <span className="text-start fs-3">Pedidos</span>
                                        <i className="fas fa-caret-down"></i>
                                    </button>

                                    <ul className="dropdown-menu w-100">
                                        {(role === "Administrador" || role === "Gestor_de_pedidos") && (
                                            <>
                                                <li><Link className="dropdown-item fs-5" to="#">Generar pedidos</Link></li>
                                                <li><hr className="dropdown-divider" /></li>
                                            </>
                                        )}
                                        <li><Link className="dropdown-item fs-5" to="#">Ver pedidos</Link></li>
                                    </ul>
                                </li>
                                <li className="nav-item dropdown w-100 pb-3">
                                    <button
                                        className="btn btn-secondary w-100 d-flex justify-content-between align-items-center"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <span className="text-start fs-3">Items</span>
                                        <i className="fas fa-caret-down"></i>
                                    </button>

                                    <ul className="dropdown-menu w-100">
                                        {
                                            Object.values(store.groups).map((value, index) =>
                                                <>
                                                    <li key={index}>
                                                        <span className="dropdown-item claseA fs-5" onClick={() => goTo('')} >
                                                            {value.title}
                                                        </span>
                                                    </li>
                                                    {(index + 1) < Object.values(store.groups).length &&
                                                        <li><hr className="dropdown-divider" /></li>
                                                    }
                                                </>
                                            )
                                        }
                                    </ul>
                                </li>
                            </>
                        )}

                        {role === "Administrador" && (
                            <li className="nav-item dropdown w-100 pb-3">
                                <button
                                    className="btn btn-secondary w-100 d-flex justify-content-between align-items-center"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <span className="text-start fs-3">ABM</span>
                                    <i className="fas fa-caret-down"></i>
                                </button>


                                <ul className="dropdown-menu w-100">
                                    {
                                        Object.values(store.groups).map((value, index) =>
                                            <>
                                                <li key={index}>
                                                    <span className="dropdown-item claseA fs-5" onClick={() => goTo('')} >
                                                        {value.title}
                                                    </span>
                                                </li>
                                                {(index + 1) < Object.values(store.groups).length &&
                                                    <li><hr className="dropdown-divider" /></li>
                                                }
                                            </>
                                        )
                                    }
                                </ul>
                            </li>

                        )}
                    </ul>
                </div>
            </div>
        </>
    );
};
