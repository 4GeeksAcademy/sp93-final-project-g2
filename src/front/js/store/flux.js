const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			token : localStorage.getItem("token") || null,
			user: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("user")) : null,
			cart: [],
			testimonials: []
		},
		actions: {
			loadTestimonials: () => {
				const testimonials = [
					{ text: "Zuply nos ha ahorrado horas cada semana, ¡lo recomiendo sin dudar!", author: "Restaurante La Cazuela" },
					{ text: "Desde que usamos Zuply, nuestros pedidos llegan siempre a tiempo.", author: "Bar El Tapeo" },
					{ text: "Fácil, rápido y sin líos. ¡Perfecto para nuestro equipo!", author: "Pizzería Don Massimo" },
					{ text: "Zuply ha sido clave para optimizar nuestro tiempo de pedidos.", author: "Hamburguesería El Buen Mordisco" },
					{ text: "Nunca fue tan fácil gestionar pedidos con múltiples proveedores.", author: "Parrilla Los Amigos" }
				];
				setStore({testimonials})
			},
			
			getProducts: async () => {
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/products`);
					const data = await resp.json();
					return data.results || [];
				} catch {
					return [];
				}
			},
		
			addToCart: (product) => {
				const store = getStore();
				setStore({ cart: [...store.cart, product] });
			},
		
			removeFromCart: (index) => {
				const store = getStore();
				const newCart = [...store.cart];
				newCart.splice(index, 1);
				setStore({ cart: newCart });
			},
		
			confirmOrder: () => {
				setStore({ cart: [] });
				alert("Pedido confirmado");
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
                        const normalizedUser = {
                            ...data.results,
                            contacts_data: data.results.contact_data,
                            contacts_data_id: data.results.contact_data.id
                        };
            
                        localStorage.setItem("token", data.access_token);
                        localStorage.setItem("user", JSON.stringify(normalizedUser));
                        setStore({ token: data.access_token, user: normalizedUser });
                        
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
            
                try {
                    // 1. Actualizar datos de usuario (username/password)
                    const userResponse = await fetch(`${process.env.BACKEND_URL}/api/users/${store.user.id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${store.token}`
                        },
                        body: JSON.stringify({
                            username: updatedData.username,
                            ...(updatedData.password && { password: updatedData.password })
                        })
                    });
            
                    // 2. Actualizar datos de contacto
                    const contactResponse = await fetch(`${process.env.BACKEND_URL}/api/contacts-data/${store.user.contacts_data_id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${store.token}`
                        },
                        body: JSON.stringify({
                            phone_number: updatedData.phone_number,
                            address: updatedData.address,
                            mail: updatedData.mail,
                            whatsapp: updatedData.whatsapp,
                            first_name: updatedData.first_name,
                            last_name: updatedData.last_name
                        })
                    });
            
                    if (!userResponse.ok || !contactResponse.ok) {
                        const error = await userResponse.json() || await contactResponse.json();
                        return { success: false, message: error.message || "Error al actualizar" };
                    }
            
                    // Actualizar el store
                    const updatedUser = {
                        ...store.user,
                        username: updatedData.username,
                        contacts_data: {
                            ...store.user.contacts_data,
                            phone_number: updatedData.phone_number,
                            address: updatedData.address,
                            mail: updatedData.mail,
                            whatsapp: updatedData.whatsapp,
                            first_name: updatedData.first_name,
                            last_name: updatedData.last_name
                        }
                    };
            
                    setStore({ user: updatedUser });
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                    
                    return { success: true };
                } catch (error) {
                    console.error("Update error:", error);
                    return { success: false, message: "Error de conexión" };
                }
            }
        }
    };
};

export default getState;
