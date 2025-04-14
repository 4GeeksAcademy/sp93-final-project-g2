import React from "react";

const Tabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="tabs">
      <button
        className={`tab-button ${activeTab === "user" ? "active" : ""}`}
        onClick={() => onTabChange("user")}
      >
        Nombre de Usuario y Contraseña
      </button>
      <button
        className={`tab-button ${activeTab === "contact" ? "active" : ""}`}
        onClick={() => onTabChange("contact")}
      >
        Datos de Contacto
      </button>
    </div>
  );
};

export default Tabs;
