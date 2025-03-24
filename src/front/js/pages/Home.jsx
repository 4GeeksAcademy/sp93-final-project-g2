import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

export const Home = () => {
	const { store } = useContext(Context);

	return (
		<div className="text-center mt-5">
			<h1>Bienvenido {store.user ? store.user.username : "Invitado"}!</h1>
			<p>
				<img src={rigoImageUrl} />
			</p>
			{store.user && <div className="alert alert-success">¡Has iniciado sesión correctamente!</div>}
		</div>
	);
};
