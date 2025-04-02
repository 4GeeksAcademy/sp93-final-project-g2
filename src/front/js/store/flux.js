const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			token : localStorage.getItem("token") || null,
			user: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("user")) : null,
		},
		actions: {
			getMessage: async () => {
				const uri = `${process.env.BACKEND_URL}/api/hello`
				const response = await fetch(uri)
				if (!response.ok) {
					console.log("Error:", response.status, response.statusText)
					return
				}
				const data = await response.json()
				setStore({ message: data.message })
			},
			login: async (username, password) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/login`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ username, password }),
					});

					const data = await response.json();

					if (response.ok) {
						localStorage.setItem("token", data.access_token);
						setStore({ token: data.access_token, user: data.results });
						return { success: true };
					} else {
						return { success: false, message: data.message || "Credenciales incorrectas" };
					}
				} catch (error) {
					return { success: false, message: "Error en el servidor. Intenta más tarde." };
				}
			},

			logout: () => {
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				setStore({ token: null, user: null });
			},

			getUserProfile: async () => {
                const store = getStore();
                if (!store.token) return;

                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/users/${store.user.id}`, {
                        method: "GET",
                        headers: { "Authorization": `Bearer ${store.token}` },
                    });

                    const data = await response.json();
                    if (response.ok) {
                        setStore({ user: data.results });
                        localStorage.setItem("user", JSON.stringify(data.results));
                    }
                } catch (error) {
                    console.error("Error obteniendo el perfil del usuario:", error);
                }
            },

            updateUserProfile: async (updatedData) => {
				const store = getStore();
				if (!store.token || !store.user) return { success: false, message: "No autorizado" };
			
				// No enviar la contraseña si el campo está vacío
				const dataToSend = { username: updatedData.username };
				if (updatedData.password.trim() !== "") {
					dataToSend.password = updatedData.password;
				}
			
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/users/${store.user.id}`, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.token}`,
						},
						body: JSON.stringify(dataToSend),
					});
			
					const data = await response.json();
					if (response.ok) {
						setStore({ user: { ...store.user, ...dataToSend } });
						localStorage.setItem("user", JSON.stringify({ ...store.user, ...dataToSend }));
						return { success: true };
					} else {
						return { success: false, message: data.message };
					}
				} catch (error) {
					return { success: false, message: "Error en el servidor." };
                }
            }
        }
    };
};

export default getState;
