const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            token: localStorage.getItem("token") || null,
            user: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("user")) : null,
            categories: [],
            subcategories: [],
            products: [],
            suppliersProducts: [],
            suppliers: [],
            testimonials: [],
            enums: {
                role: [
                    {label: 'Administrador', value: 'Administrador'},
                    {label: 'Gestor de pedidos', value: 'Gestor_de_pedidos'},
                    {label: 'Receptor de pedidos', value: 'Receptor_de_pedidos'},
                    {label: 'Visitante', value: 'visitante'}
                ],
                status: [
                    {label: 'Pendiente', value: 'pendiente'},
                    {label: 'Cancelado', value: 'cancelado'},
                    {label: 'Recibido', value: 'recibido'},
                    {label: 'Borrador', value: 'borrador'},
                    {label: 'Reprogramado', value: 'reprogramado'}
                ],
                payment_method: [
                    {label: 'Transferencia', value: 'transferencia'},
                    {label: 'Efectivo', value: 'efectivo'},
                    {label: 'Débito', value: 'debito'},
                    {label: 'Crédito', value: 'credito'},
                    {label: 'Cheque', value: 'cheque'}
                ],
                order_method: [
                    {label: 'Whatsapp', value: 'whatsapp'},
                    {label: 'Mail', value: 'mail'},
                    {label: 'Teléfono', value: 'telefono'}
                ],
            },
            abmGroups: {
                suppliers: {
                    title: 'Proveedores',
                    showKey: 'name',
                    icon: 'truck',
                    items: [],
                    formInputs: [
                        {
                            type: 'text',
                            accessKey: 'name',
                            label: 'Razon Social',
                            value: ''
                        },
                        {
                            type: 'text',
                            accessKey: 'address',
                            label: 'Dirección',
                            value: ''
                        },
                        {
                            type: 'text',
                            accessKey: 'cuit',
                            label: 'CUIT',
                            value: ''
                        }
                    ]
                },
                categories: {
                    title: 'Categoria',
                    showKey: 'name',
                    icon: 'tags',
                    items: [],
                    formInputs: [
                        {
                            type: 'text',
                            accessKey: 'name',
                            label: 'Nombre',
                            value: ''
                        },
                        {
                            type: 'text',
                            accessKey: 'description',
                            label: 'Descripción',
                            value: ''
                        },
                    ]
                },
                sub_categories: {
                    title: 'Sub Categorias',
                    showKey: 'name',
                    icon: 'puzzle-piece',
                    items: [],
                    formInputs: [
                        {
                            type: 'text',
                            accessKey: 'name',
                            label: 'Nombre',
                            value: ''
                        },
                        {
                            type: 'text',
                            accessKey: 'description',
                            label: 'Descripción',
                            value: ''
                        },
                        {
                            type: 'dropdown',
                            accessKey: 'categories_id',
                            label: 'Categoria',
                            fatherKey: 'categories',
                            value: '1'
                        },
                    ]
                },
                users: {
                    title: 'Usuarios',
                    showKey: 'username',
                    icon: 'user',
                    items: [],
                    formInputs: [
                        {
                            type: 'text',
                            accessKey: 'username',
                            label: 'Nombre de Usuario',
                            value: ''
                        },
                        {
                            type: 'text',
                            accessKey: 'password',
                            label: 'Password',
                            value: ''
                        },
                        {
                            type: 'enum',
                            accessKey: 'role',
                            label: 'Rol',
                            value: ''
                        },
                    ]
                }
            },
            activeGroup: '',
            isEdit: false,
            itemId: null,
            editObject: {},
            viewType: 'list',
            activeList: []
        },
        actions: {
            getCategories: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/categories`, {
                        method: "GET",
                        headers: { "Authorization": `Bearer ${getStore().token}` },
                    });
                    const data = await response.json();
                    if (response.ok) {
                        setStore({ categories: data.results });
                    } else {
                        console.error("Error al obtener categorías", data.message);
                    }
                } catch (error) {
                    console.error("Error al obtener categorías", error);
                }
            },

            getSubcategories: async (categoryId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/categories/${categoryId}/sub-categories`, {
                        method: "GET",
                        headers: { "Authorization": `Bearer ${getStore().token}` },
                    });
                    const data = await response.json();
                    if (response.ok) {
                        setStore({ subcategories: data.results.list }); 
                    } else {
                        console.error("Error al obtener subcategorías", data.message);
                    }
                } catch (error) {
                    console.error("Error al obtener subcategorías", error);
                }
            },

            getProductsBySubcategory: async (subcategoryId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/sub-categories/${subcategoryId}/products`, {
                        method: "GET",
                        headers: { "Authorization": `Bearer ${getStore().token}` },
                    });
                    const data = await response.json();
                    if (response.ok) {
                        setStore({ products: data.results.list }); 
                    } else {
                        console.error("Error al obtener productos", data.message);
                    }
                } catch (error) {
                    console.error("Error al obtener productos", error);
                }
            },

            getSuppliersProductsByProduct: async (productId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/products/${productId}/suppliers-products`, {
                        method: "GET",
                        headers: { "Authorization": `Bearer ${getStore().token}` },
                    });
                    const data = await response.json();
                    if (response.ok) {
                        setStore({ suppliersProducts: data.results.list });
                    } else {
                        console.error("Error al obtener productos de proveedor", data.message);
                    }
                } catch (error) {
                    console.error("Error al obtener productos de proveedor", error);
                }
            },

            getSupplierById: async (supplierId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/suppliers/${supplierId}`, {
                        method: "GET",
                        headers: { "Authorization": `Bearer ${getStore().token}` },
                    });
                    const data = await response.json();
                    if (response.ok) {
                        setStore({
                            suppliers: [...getStore().suppliers, data.results]  
                        });
                    } else {
                        console.error("Error al obtener proveedor", data.message);
                    }
                } catch (error) {
                    console.error("Error al obtener proveedor", error);
                }
            },

            simpleStoreSetter: (key, value) => { setStore({ [key]: value }) },
            setListViewConfig: (activeGroup, viewType, activeList) => {
                setStore({activeGroup, viewType, activeList})
            },
            getItems: async () => {
                const {activeGroup, token, abmGroups} = getStore()
                const route = activeGroup.replace(/_/g, "-");
                const url = `${process.env.BACKEND_URL}/api/${route}`
                const options = {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
                const resp = await fetch(url, options)
                if (!resp.ok){
                    console.log('Error: ', resp.status, resp.statusText)
                }
                const data = await resp.json()
                console.log('data', data.results)
                setStore({abmGroups: {
                    ...abmGroups,
                    [activeGroup]: {
                        ...abmGroups[activeGroup],
                        items: data.results
                    }}})
                    setStore({activeList: data.results})
            },
            loadTestimonials: () => {
                const testimonials = [
                    { text: "Zuply nos ha ahorrado horas cada semana, ¡lo recomiendo sin dudar!", author: "Restaurante La Cazuela" },
                    { text: "Desde que usamos Zuply, nuestros pedidos llegan siempre a tiempo.", author: "Bar El Tapeo" },
                    { text: "Fácil, rápido y sin líos. ¡Perfecto para nuestro equipo!", author: "Pizzería Don Massimo" },
                    { text: "Zuply ha sido clave para optimizar nuestro tiempo de pedidos.", author: "Hamburguesería El Buen Mordisco" },
                    { text: "Nunca fue tan fácil gestionar pedidos con múltiples proveedores.", author: "Parrilla Los Amigos" }
                ];
                setStore({ testimonials })
            },

            //actions para los ABM
            abmCreate: async (dataToSend) => {
                const {activeGroup, token, abmGroups} = getStore()
                const route = activeGroup.replace(/_/g, "-");
                const url = `${process.env.BACKEND_URL}/api/${route}`
                const options = {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataToSend)
                }
                const resp = await fetch(url, options);
                if(!resp.ok){
                    console.error('Error: ', resp.status, resp.statusText )
                }
                
                //const data = await resp.json();
                getActions().getItems()
               
            },
            abmUpdate: async (dataToSend) => {
                const {activeGroup, token, itemId} = getStore()
                const route = activeGroup.replace(/_/g, "-");
                const url = `${process.env.BACKEND_URL}/api/${route}/${itemId}`
                const options = {
                    method: "PUT",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataToSend)
                }
                const resp = await fetch(url, options);
                if(!resp.ok){
                    console.error('Error: ', resp.status, resp.statusText )
                }
                getActions().getItems()
             },
            abmDelete: async (id) => {
                const {activeGroup, token} = getStore()
                const route = activeGroup.replace(/_/g, "-");
                const url = `${process.env.BACKEND_URL}/api/${route}/${id}`
                const options = {
                    method: "DELETE",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
                const resp = await fetch(url, options);
                if(!resp.ok){
                    console.error('Error: ', resp.status, resp.statusText )
                }
                getActions().getItems()
             },
            
            getInitAdminData: async () => {
                const {abmGroups} = getStore()
                try {
                    const url = `${process.env.BACKEND_URL}/api/init-admin-data`
                    const options = {
                        method: "GET",
                        headers: {
                            'Authorization': `Bearer ${getStore().token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                    const resp = await fetch(url, options);
                    const data = await resp.json();
                    const objectToSave = {}
                   
                    Object.keys(abmGroups).map((groupKey) => {
                        console.log('aca', data.results[groupKey])
                        objectToSave[groupKey] = { ...abmGroups[groupKey], items: data.results[groupKey] }
                    })
                    setStore({abmGroups: objectToSave})
                    console.log('abmGroups', getStore().abmGroups)
                    return data.results || [];
                } catch {
                    console.log('tuve un error')
                    return [];
                }
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
                const {token, user} = getStore();
                if (!token || !user) return { success: false, message: "No autorizado" };

                try {
                    const userResponse = await fetch(`${process.env.BACKEND_URL}/api/users/${user.id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            username: updatedData.username,
                            ...(updatedData.password && { password: updatedData.password })
                        })
                    });

                    const contactResponse = await fetch(`${process.env.BACKEND_URL}/api/contacts-data/${user.contacts_data_id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
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

                    const updatedUser = {
                        ...user,
                        username: updatedData.username,
                        contacts_data: {
                            ...user.contacts_data,
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
