import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext.js";

export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();

	const handleLogout = () => {
		actions.logout();
		navigate("/login");
	};

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">
					{store.token ? (
						<button onClick={handleLogout} className="btn btn-danger">Cerrar sesión</button>
					) : (
						<Link to="/login">
							<button className="btn btn-primary">Iniciar sesión</button>
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
};
