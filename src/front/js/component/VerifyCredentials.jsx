import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/verifyCredentials.css";

const VerifyCredentials = ({ onSuccess }) => {
  const { actions } = useContext(Context);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await actions.login(username, password);
    setLoading(false);

    if (result.success) {
      onSuccess();
    } else {
      setError(result.message || "Credenciales incorrectas");
    }
  };

  return (
    <div className="verify-box">
      <h2 className="verify-title">Verificar identidad</h2>
      <p className="verify-hint">
        Introduce tu usuario y contraseña actuales para poder modificar tus datos.
      </p>

      {error && <div className="verify-alert">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="verify-form-group">
          <label className="verify-label">Usuario actual</label>
          <input
            type="text"
            className="verify-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="verify-form-group">
          <label className="verify-label">Contraseña actual</label>
          <input
            type="password"
            className="verify-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="verify-button" disabled={loading}>
          {loading ? "Verificando..." : "Verificar"}
        </button>
      </form>
    </div>
  );
};

export default VerifyCredentials;
