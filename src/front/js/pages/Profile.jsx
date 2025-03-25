import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js";

const Profile = () => {
    const { store, actions } = useContext(Context);
    const [formData, setFormData] = useState({ username: "", password: "" });

    useEffect(() => {
        if (store.user) {
            setFormData({ username: store.user.username, password: "" });
        }
    }, [store.user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await actions.updateUserProfile(formData);
        if (response.success) {
            alert("Perfil actualizado exitosamente");
        } else {
            alert(response.message);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: '400px' }}>
                <div className="card-body">
                    <h2 className="text-center mb-4">Perfil de Usuario</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Usuario</label>
                            <input
                                type="text"
                                name="username"
                                className="form-control"
                                id="username"
                                placeholder="Cambiar Usuario"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="role" className="form-label">Nueva Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Nueva Contraseña"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100 py-2"
                        >
                            Guardar Cambios
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
