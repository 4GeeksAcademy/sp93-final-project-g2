import React, { useState, useEffect } from "react";
import getState from "./flux.js";


// Don't change, here is where we initialize our context, by default it's just going to be null.
export const Context = React.createContext(null);


// This function injects the global store to any view/component where you want to use it, we will inject the context to layout.js, you can see it here:
// https://github.com/4GeeksAcademy/react-hello-webapp/blob/master/src/js/layout.js#L35
const injectContext = PassedComponent => {
	const StoreWrapper = props => {
		// This will be passed as the contenxt value
		const [state, setState] = useState(
			getState({
				getStore: () => state.store,
				getActions: () => state.actions,
				setStore: updatedStore =>
					setState({
						store: Object.assign(state.store, updatedStore),
						actions: { ...state.actions }
					})
			})
		);

		/**
		 * EDIT THIS!
		 * This function is the equivalent to "window.onLoad", it only runs once on the entire application lifetime
		 * you should do your ajax requests or fetch api requests here. Do not use setState() to save data in the
		 * store, instead use actions, like this:
		 **/
		useEffect(() => {

		}, []);
		// ATENCION: Se pueden poner todos los useEffect que se necesiten, 
		// el de abajo lo cree separado para que solo se ejecute 
		// cuando cambie el usuario (osea despues del login)
		useEffect(() => {
			const user = state.store.user
			if (user) {
				const entities = state.store.entitiesRoleList[user['role']];
				state.actions.simpleStoreSetter('entitiesListActive', entities)
				entities.forEach((entity, index) => {
					const setFirtsOrderFlow = index === entities.length - 1;
					state.actions.getItems(entity, false, setFirtsOrderFlow);
				});
				state.actions.getItems('orders', false, false);
			}
		}, [state.store.user]);

		// The initial value for the context is not null anymore, but the current state of this component,
		// the context will now have a getStore, getActions and setStore functions available, because they were declared
		// on the state of this component
		return (
			<Context.Provider value={state}>
				<PassedComponent {...props} />
			</Context.Provider>
		);
	};
	return StoreWrapper;
};

export default injectContext;
