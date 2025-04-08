import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/profile.css";


const Profile = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    address: "",
    mail: "",
    whatsapp: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!store.token) navigate("/login");
    if (store.user?.contacts_data) {
      setFormData({
        username: store.user.username,
        password: "",
        ...store.user.contacts_data
      });
    }
  }, [store.user, store.token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await actions.updateUserProfile(formData);
    if (response.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setErrors(response.errors || {});
    }
    setLoading(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 className="profile-title">
          Mi Perfil {store.user && <span className="username-highlight">{store.user.username}</span>}
        </h1>
        <p className="profile-subtitle">
          Administra tu información personal y preferencias de contacto
        </p>
      </div>

      <div className="profile-content-container">
        <div className="profile-card">
          {success && (
            <div className="success-message">
              ¡Perfil actualizado correctamente!
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="profile-form-grid">
              <div>
                <label className="profile-form-label">Nombre</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={`profile-form-input ${errors.first_name ? 'profile-form-input-error' : ''}`}
                />
                {errors.first_name && <span className="error-message">{errors.first_name}</span>}
              </div>

              <div>
                <label className="profile-form-label">Apellido</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`profile-form-input ${errors.last_name ? 'profile-form-input-error' : ''}`}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="profile-form-label">Email</label>
              <input
                type="email"
                name="mail"
                value={formData.mail}
                onChange={handleChange}
                className={`profile-form-input ${errors.mail ? 'profile-form-input-error' : ''}`}
              />
              {errors.mail && <span className="error-message">{errors.mail}</span>}
            </div>

            <div className="profile-form-grid">
              <div>
                <label className="profile-form-label">Teléfono</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className={`profile-form-input ${errors.phone_number ? 'profile-form-input-error' : ''}`}
                />
              </div>

              <div>
                <label className="profile-form-label">WhatsApp</label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className={`profile-form-input ${errors.whatsapp ? 'profile-form-input-error' : ''}`}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="profile-form-label">Dirección</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`profile-form-input ${errors.address ? 'profile-form-input-error' : ''}`}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="profile-form-label">Nombre de Usuario</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`profile-form-input ${errors.username ? 'profile-form-input-error' : ''}`}
              />
              {errors.username && <span className="error-message">{errors.username}</span>}
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label className="profile-form-label">Nueva Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Dejar vacío para mantener la actual"
                className={`profile-form-input ${errors.password ? 'profile-form-input-error' : ''}`}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
              <small className="form-hint">Mínimo 6 caracteres</small>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm"></span>
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;