import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext.js";
import { ReactComponent as LogoNavbar } from "../../img/logoZuplyHorizontal.svg"

export const Navbar = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    // const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        actions.logout();
        navigate("/");
    };

    const goTo = (route) => {
        navigate("/" + route);
    }
    

    const role = store.user?.role;

    const renderOffcanvasMenu = () => {
        if (!store.token || role === "visitante") return null;

        return (
            <div className="offcanvas offcanvas-start offcanvas-custom custom-bg" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Menú</h5>
                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>
                </div>
                <div className="offcanvas-body bg-beige">
                    <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                        {(role === "Administrador" || role === "Gestor_de_pedidos" || role === "Receptor_de_pedidos") && (
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="pedidosDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Pedidos
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="pedidosDropdown">
                                    {(role === "Administrador" || role === "Gestor_de_pedidos") && (
                                        <>
                                            <li><a className="dropdown-item" href="#">Generar pedidos</a></li>
                                            <li><hr className="dropdown-divider" /></li>
                                        </>
                                    )}
                                    <li><a className="dropdown-item" href="#">Ver pedidos</a></li>
                                </ul>
                            </li>
                        )}

                        {(role === "Administrador" || role === "Gestor_de_pedidos" || role === "Receptor_de_pedidos") && (
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="itemsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Items
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="itemsDropdown">
                                    <li><a className="dropdown-item" href="#">Productos</a></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item" href="#">Categorías</a></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item" href="#">Subcategorías</a></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item" href="#">Proveedores</a></li>
                                </ul>
                            </li>
                        )}

                        {role === "Administrador" && (
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="abmDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    ABM
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="abmDropdown">
                                    <Link to="/admin" className="btn btn-info mx-2">abms</Link> 
                                    <li><span onClick={() => goTo('admin')} className="dropdown-item" href="#">Productos</span></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item" href="#">Categorías</a></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item" href="#">Subcategorías</a></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item" href="#">Proveedores</a></li>
                                </ul>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        );
    };

    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container-fluid">
                {store.token && role !== "visitante" && (
                    <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                )}

                {renderOffcanvasMenu()}

                <LogoNavbar className="logo original" onClick={()=> goTo('')} />

                <div className="ml-auto">
                    {store.token ? (
                        <>
                            {/* <Link to="/profile" className="btn btn-info mx-2">Perfil</Link> */}
                            <button onClick={handleLogout} className="btn btn-outline-success">Cerrar sesión</button>
                        </>
                    ) : (
                        <Link to="/login">
                            <button className="btn btn-outline-secondary" type="submit">Iniciar sesión</button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};
