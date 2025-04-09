import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext.js";

export const NavbarMenu = () => {
    const { store, actions } = useContext(Context);
    const role = store.user?.role;
    const navigate = useNavigate();

    const goTo = (navigateTo, groupKey) => {
        if(groupKey !== ''){
            actions.setListViewConfig(groupKey, 'list', store.abmGroups[groupKey].items);
        }
        navigate('/' + navigateTo);
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
                                <li key="Pedidos" className="nav-item dropdown w-100 pb-3">
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
                                            
                                                <li><span onClick={() => goTo('order', '')} className="dropdown-item fs-5" data-bs-dismiss="offcanvas">Generar pedidos</span></li>
                                                <li><hr className="dropdown-divider" /></li>
                                            </>
                                        )}
                                        <li><Link className="dropdown-item fs-5" to="#" data-bs-dismiss="offcanvas">Ver pedidos</Link></li>
                                    </ul>
                                </li>
                                <li key="Items" className="nav-item dropdown w-100 pb-3">
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
                                            Object.entries(store.abmGroups).map(([key, value], index) => {
                                                const isLastItem = index === Object.keys(store.abmGroups).length - 1;
                                                return (
                                                    <li key={'Items-' + key + ' - ' + index}>
                                                        <span className={`dropdown-item fs-5 ${!isLastItem && 'border-bottom'}`} onClick={() => goTo('admin', key)} data-bs-dismiss="offcanvas">
                                                            {value.title}
                                                        </span>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </li>
                            </>
                        )}

                        {role === "Administrador" && (
                            <li key="ABM" className="nav-item dropdown w-100 pb-3">
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
                                        Object.entries(store.abmGroups).map(([key, value], index) => {
                                            const isLastItem = index === Object.keys(store.abmGroups).length - 1;
                                            return (
                                                <li key={'ABM-' + key + ' - ' + index}>
                                                    <span className={`dropdown-item fs-5 ${!isLastItem && 'border-bottom'}`} onClick={() => goTo('admin', key)} data-bs-dismiss="offcanvas">
                                                        {value.title}
                                                    </span>
                                                </li>
                                            )
                                        })
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
