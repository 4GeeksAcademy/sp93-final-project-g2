import React from "react";

const UserProfileForm = ({ formData, handleChange, errors }) => {
  return (
    <div className="profile-form">
      <div>
        <label className="profile-form-label">Nombre de Usuario</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className={`profile-form-input ${errors.username ? "profile-form-input-error" : ""}`}
        />
        {errors.username && <span className="error-message">{errors.username}</span>}
      </div>

      <div>
        <label className="profile-form-label">Nueva Contraseña</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Dejar vacío para mantener la actual"
          className={`profile-form-input ${errors.password ? "profile-form-input-error" : ""}`}
        />
        {errors.password && <span className="error-message">{errors.password}</span>}
        <small className="form-hint">Mínimo 6 caracteres</small>
      </div>

      <div>
        <label className="profile-form-label">Confirmar Nueva Contraseña</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`profile-form-input ${errors.confirmPassword ? "profile-form-input-error" : ""}`}
        />
        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
      </div>
    </div>
  );
};

export default UserProfileForm;
