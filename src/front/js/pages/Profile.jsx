import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

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
    <div style={{ backgroundColor: '#f4f3ef', minHeight: 'calc(100vh - 56px)', paddingTop: '0' }}>
      <div style={{ 
        backgroundColor: '#223650', 
        color: 'white', 
        padding: '2rem 1rem 1.5rem', 
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '700', 
          margin: '0 auto 0.5rem',
          maxWidth: '800px'
        }}>
          Mi Perfil {store.user && <span style={{ color: '#95c11f' }}>{store.user.username}</span>}
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: '#ddd', 
          maxWidth: '800px', 
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          Administra tu información personal y preferencias de contacto
        </p>
      </div>

      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto 2rem', 
        padding: '0 1rem' 
      }}>
        <div style={{ 
          background: 'white', 
          borderRadius: '1rem', 
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          padding: '2rem',
          border: '1px solid #ddd'
        }}>
          {success && (
            <div style={{
              backgroundColor: 'rgba(149, 193, 31, 0.2)',
              borderLeft: '4px solid #95c11f',
              padding: '1rem',
              marginBottom: '2rem',
              color: '#223650'
            }}>
              ¡Perfil actualizado correctamente!
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#223650', fontWeight: '500' }}>Nombre</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: `1px solid ${errors.first_name ? 'red' : '#ddd'}`,
                    fontSize: '1rem'
                  }}
                />
                {errors.first_name && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.first_name}</span>}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#223650', fontWeight: '500' }}>Apellido</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: `1px solid ${errors.last_name ? 'red' : '#ddd'}`,
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#223650', fontWeight: '500' }}>Email</label>
              <input
                type="email"
                name="mail"
                value={formData.mail}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: `1px solid ${errors.mail ? 'red' : '#ddd'}`,
                  fontSize: '1rem'
                }}
              />
              {errors.mail && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.mail}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#223650', fontWeight: '500' }}>Teléfono</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: `1px solid ${errors.phone_number ? 'red' : '#ddd'}`,
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#223650', fontWeight: '500' }}>WhatsApp</label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: `1px solid ${errors.whatsapp ? 'red' : '#ddd'}`,
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#223650', fontWeight: '500' }}>Dirección</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: `1px solid ${errors.address ? 'red' : '#ddd'}`,
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#223650', fontWeight: '500' }}>Nombre de Usuario</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: `1px solid ${errors.username ? 'red' : '#ddd'}`,
                  fontSize: '1rem'
                }}
              />
              {errors.username && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.username}</span>}
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#223650', fontWeight: '500' }}>Nueva Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Dejar vacío para mantener la actual"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: `1px solid ${errors.password ? 'red' : '#ddd'}`,
                  fontSize: '1rem'
                }}
              />
              {errors.password && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.password}</span>}
              <small style={{ color: '#666', fontSize: '0.875rem' }}>Mínimo 6 caracteres</small>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#95c11f',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
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