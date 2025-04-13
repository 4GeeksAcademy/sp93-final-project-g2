import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/profile.css";
import { PageTitle } from "../component/PageTitle.jsx";
import Tabs from "../component/Tabs.jsx";
import UserProfileForm from "../component/UserProfileForm.jsx";
import ContactProfileForm from "../component/ContactProfileForm.jsx";
import SuccessMessage from "../component/SuccessMessage.jsx";
import VerifyCredentials from "../component/VerifyCredentials.jsx";

const Profile = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [activateTab, setActiveTab] = useState("user");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
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
  const [isVerified, setIsVerified] = useState(false);
  const [wantsToEditCredentials, setWantsToEditCredentials] = useState(false);

  useEffect(() => {
    if (!store.token) navigate("/login");
    if (store.user?.contacts_data) {
      setFormData({
        username: store.user.username,
        password: "",
        confirmPassword: "",
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

    if (formData.password && formData.password !== formData.confirmPassword) {
      setErrors({
        password: "Las contraseñas no coinciden",
        confirmPassword: "Las contraseñas no coinciden",
      });
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setErrors({
        password: "La contraseña debe tener al menos 6 caracteres",
      });
      return;
    }

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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="profile-container">
      <PageTitle
        title="Mi Perfil"
        subtitle="Administra tu información personal y preferencias de contacto"
      />
      <div className="profile-content-container">
        <div className="profile-card">
          {success && <SuccessMessage />}

          {!wantsToEditCredentials && (
            <button className="btn verify-button-toggle" onClick={() => setWantsToEditCredentials(true)}>
              Cambiar mis datos
            </button>
          )}

          {wantsToEditCredentials && !isVerified && (
            <VerifyCredentials onSuccess={() => setIsVerified(true)} />
          )}

          {(isVerified || activateTab === "contact") && (
            <>
              <Tabs activeTab={activateTab} onTabChange={handleTabChange} />

              <form onSubmit={handleSubmit}>
                {activateTab === "user" && isVerified && (
                  <UserProfileForm
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                  />
                )}
                {activateTab === "contact" && (
                  <ContactProfileForm
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                  />
                )}

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
                    "Guardar Cambios"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
