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
            testimonials: [
                { text: "Zuply nos ha ahorrado horas cada semana, ¡lo recomiendo sin dudar!", author: "Restaurante La Cazuela" },
                { text: "Desde que usamos Zuply, nuestros pedidos llegan siempre a tiempo.", author: "Bar El Tapeo" },
                { text: "Fácil, rápido y sin líos. ¡Perfecto para nuestro equipo!", author: "Pizzería Don Massimo" },
                { text: "Zuply ha sido clave para optimizar nuestro tiempo de pedidos.", author: "Hamburguesería El Buen Mordisco" },
                { text: "Nunca fue tan fácil gestionar pedidos con múltiples proveedores.", author: "Parrilla Los Amigos" }
            ],
            enums: {
                role: [
                    { label: 'Administrador', value: 'Administrador' },
                    { label: 'Gestor de pedidos', value: 'Gestor_de_pedidos' },
                    { label: 'Receptor de pedidos', value: 'Receptor_de_pedidos' },
                    { label: 'Visitante', value: 'visitante' }
                ],
                status: [
                    { label: 'Pendiente', value: 'pendiente' },
                    { label: 'Cancelado', value: 'cancelado' },
                    { label: 'Recibido', value: 'recibido' },
                    { label: 'Borrador', value: 'borrador' },
                    { label: 'Reprogramado', value: 'reprogramado' }
                ],
                payment_method: [
                    { label: 'Transferencia', value: 'transferencia' },
                    { label: 'Efectivo', value: 'efectivo' },
                    { label: 'Débito', value: 'debito' },
                    { label: 'Crédito', value: 'credito' },
                    { label: 'Cheque', value: 'cheque' }
                ],
                order_method: [
                    { label: 'Whatsapp', value: 'whatsapp' },
                    { label: 'Mail', value: 'mail' },
                    { label: 'Teléfono', value: 'telefono' }
                ],
            },
            entitiesConfigData: {
                users: {
                    title: 'Usuarios',
                    showKey: 'username',
                    icon: 'user',
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
                },
                suppliers: {
                    title: 'Proveedores',
                    showKey: 'name',
                    icon: 'truck',
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
                    relationshipKey: 'categories_id',
                    icon: 'puzzle-piece',
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
                        }
                    ]
                },
                products: {
                    title: 'Productos',
                    showKey: 'name',
                    relationshipKey: 'sub_categories_id',
                    icon: 'utensils',
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
                            type: 'text',
                            accessKey: 'image',
                            label: 'Imagen',
                            value: ''
                        },
                        {
                            type: 'dropdown',
                            accessKey: 'sub_categories_id',
                            label: 'Categoria',
                            fatherKey: 'sub_categories',
                            value: '1'
                        }
                    ]
                },
                suppliers_products: {
                    title: 'Artículos',
                    showKey: 'nickname',
                    relationshipKey: 'products_id',
                    icon: 'user',
                    formInputs: [
                        {
                            type: 'autocomplete',
                            accessKey: 'suppliers_id',
                            label: 'Proveedor',
                            fatherKey: 'suppliers',
                            value: '1'
                        },
                        {
                            type: 'dropdown',
                            accessKey: 'products_id',
                            label: 'Producto',
                            fatherKey: 'products',
                            value: ''
                        },
                        {
                            type: 'text',
                            accessKey: 'nickname',
                            label: 'Nombre segun el proveedor',
                            value: ''
                        },
                        {
                            type: 'text',
                            accessKey: 'price',
                            label: 'Precio',
                            value: ''
                        },
                        {
                            type: 'text',
                            accessKey: 'presentation',
                            label: 'Presentacion',
                            value: ''
                        }
                    ]
                }
            },
            entitiesRoleList: {
                'Administrador': ['users', 'categories', 'sub_categories', 'suppliers', 'products', 'suppliers_products']
            },
            entitiesListActive: [],
            orderFlow: ['general', 'categories', 'sub_categories', 'products', 'suppliers_products'],
            orderFlowActive: {},
            orderFlowGeneralItem: {
                title: 'Seleccione',
                id: 0,
                entityKey: 'general',
                itemList: [{ name: 'Proveedor', id: 0 }, { name: 'Categoria', id: 1 }],
                showKey: 'name'
            },
            breadcrumItems: [],
            entitiesData: {},
            activeGroup: '',
            isEdit: false,
            itemId: null,
            editObject: {},
            viewType: 'list',
            activeList: []
        },
        actions: {
            //Helpers
            simpleStoreSetter: (key, value) => { setStore({ [key]: value }) },
            consoleError: response => console.error("Error: ", response.status, response.statusText),
            optionsAuth: (method, body = null) => {
                const options = {
                    method: method,
                    headers: {
                        'Authorization': `Bearer ${getStore().token}`,
                        'Content-Type': 'application/json'
                    },
                }
                if (method !== 'GET' && method !== 'DELETE' && body) {
                    options['body'] = JSON.stringify(body)
                }
                return options
            },
            normalizeUrl: (uri, withId = false) => {
                uri = uri != '' ? uri : getStore().activeGroup
                const route = uri.replace(/_/g, "-");
                const url = `${process.env.BACKEND_URL}/api/${route}${withId ? '/' + getStore().itemId : ''}`
                return url
            },
            updateBreadcrums: (breadcrum) => {
                const { breadcrumItems } = getStore()
                const breadcrumIndex = breadcrumItems.indexOf(breadcrum)
                const breadcrumsAux = breadcrum == 'back' ? breadcrumItems.slice(0, -1) : breadcrumIndex == -1 ? [...breadcrumItems, breadcrum] : breadcrumItems.slice(0, breadcrumIndex)
                setStore({ breadcrumItems: breadcrumsAux })
            },
            getItems: async (entityKey, setActiveList = false, setFirtsOrderFlow = false) => {
                try {
                    entityKey = entityKey == 'activeGroup' ? getStore().activeGroup : entityKey
                    const response = await fetch(getActions().normalizeUrl(entityKey), getActions().optionsAuth('GET'))
                    if (!response.ok) { consoleError(response); return }
                    const data = await response.json()
                    setStore({ entitiesData: { ...getStore().entitiesData, [entityKey]: data.results } })
                    if (setActiveList) setStore({ activeList: data.results })
                    if (setFirtsOrderFlow) {
                        setStore({
                            orderFlowActive: getStore().orderFlowGeneralItem
                        })
                    }
                } catch (error) {
                    console.error(`Error al obtener ${entityKey}`, error);
                }
            },
            getItemById: (entityKey, id) => {

            },
            getCategories: async () => {
                try {
                    const url = `${process.env.BACKEND_URL}/api/categories`
                    const response = await fetch(url, getActions().optionsAuth('GET'));
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
                    const url = `${process.env.BACKEND_URL}/api/categories/${categoryId}/sub-categories`
                    const response = await fetch(url, getActions().optionsAuth('GET'));
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
                    const url = `${process.env.BACKEND_URL}/api/sub-categories/${subcategoryId}/products`
                    const response = await fetch(url, getActions().optionsAuth('GET'));
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
                    const url = `${process.env.BACKEND_URL}/api/products/${productId}/suppliers-products`
                    const response = await fetch(url, getActions().optionsAuth('GET'));
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
                    const url = `${process.env.BACKEND_URL}/api/suppliers/${supplierId}`
                    const response = await fetch(url, getActions().optionsAuth('GET'));
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
            getProducts: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/products`);
                    const data = await response.json();
                    return data.results || [];
                } catch {
                    return [];
                }
            },

            setListViewConfig: (activeGroup, viewType, activeList) => {
                setStore({ activeGroup, viewType, activeList })
            },

            //actions para los ABM
            abmCreate: async (dataToSend) => {
                const response = await fetch(getActions().normalizeUrl('', false), getActions().optionsAuth('POST', dataToSend));
                if (!response.ok) { consoleError(response); return }
                getActions().getItems('activeGroup', true)
            },
            abmUpdate: async (dataToSend) => {
                const response = await fetch(getActions().normalizeUrl('', true), getActions().optionsAuth('PUT', dataToSend));
                if (!response.ok) { consoleError(response); return }
                getActions().getItems('activeGroup', true)
            },
            abmDelete: async (id) => {
                const response = await fetch(getActions().normalizeUrl('', true), getActions().optionsAuth('DELETE'));
                if (!response.ok) { consoleError(response); return }
                getActions().getItems('activeGroup', true)
            },

            login: async (username, password) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ username, password }),
                    });
                    if (!response.ok) return { success: false, message: data.message || "Credenciales incorrectas" };
                    const data = await response.json();
                    const user = data.results
                    localStorage.setItem("token", data.access_token);
                    localStorage.setItem("user", JSON.stringify(user));
                    setStore({ token: data.access_token, user: user });
                    return { success: true };
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
                    const url = `${process.env.BACKEND_URL}/api/users/${store.user.id}`
                    const response = await fetch(url, getActions().optionsAuth('GET'));

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
                const { token, user } = getStore();
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
