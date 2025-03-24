const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			token : localStorage.getItem("token") || null,
			user: null,
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
				setStore({ token: null, user: null });
			},
		},
	};
};

export default getState;
