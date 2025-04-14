import React from "react";

const ContactProfileForm = ({ formData, handleChange, errors }) => {
  return (
    <div className="profile-form-grid">
      <div className="profile-form-item">
        <label className="profile-form-label">Nombre</label>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          className={`profile-form-input ${errors.first_name ? "profile-form-input-error" : ""}`}
        />
        {errors.first_name && <span className="error-message">{errors.first_name}</span>}
      </div>

      <div className="profile-form-item">
        <label className="profile-form-label">Apellido</label>
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          className={`profile-form-input ${errors.last_name ? "profile-form-input-error" : ""}`}
        />
      </div>

      <div className="profile-form-item">
        <label className="profile-form-label">Email</label>
        <input
          type="email"
          name="mail"
          value={formData.mail}
          onChange={handleChange}
          className={`profile-form-input ${errors.mail ? "profile-form-input-error" : ""}`}
        />
        {errors.mail && <span className="error-message">{errors.mail}</span>}
      </div>

      <div className="profile-form-grid">
        <div className="profile-form-item">
          <label className="profile-form-label">Teléfono</label>
          <input
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className={`profile-form-input ${errors.phone_number ? "profile-form-input-error" : ""}`}
          />
        </div>

        <div className="profile-form-item">
          <label className="profile-form-label">WhatsApp</label>
          <input
            type="tel"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            className={`profile-form-input ${errors.whatsapp ? "profile-form-input-error" : ""}`}
          />
        </div>
      </div>

      <div className="profile-form-item">
        <label className="profile-form-label">Dirección</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={`profile-form-input ${errors.address ? "profile-form-input-error" : ""}`}
        />
      </div>
    </div>
  );
};

export default ContactProfileForm;

