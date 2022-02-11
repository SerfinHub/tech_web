import React, { useEffect, useReducer, useState } from 'react';
import { Route, Routes } from 'react-router';
import AuthRoute from './components/AuthRoute';
import LoadingComponent from './components/LoadingComponent';
import logging from './config/logging';
import routes from './config/routes';
import { initialUserState, UserContextProvider, userReducer } from './contexts/user';
import { Validate } from './modules/auth';

export interface IApplicationProps {}

const Application: React.FunctionComponent<IApplicationProps> = (props) => {
	const [userState, userDispatch] = useReducer(userReducer, initialUserState);
	const [loading, setLoading] = useState<boolean>(true);

	/** Used for Debugging */
	const [authStage, setAuthStage] = useState<string>('Checking localstorage...');

	useEffect(() => {
		setTimeout(() => {
			CheckLocalStorageForCreditials();
		}, 1000);
	}, []);

	/**
	 * Check to see if we have a token.
	 * If we do, verify it with the backend
	 * If not, we are logged out initially.
	 */
	const CheckLocalStorageForCreditials = () => {
		setAuthStage('Checking credentials ...');

		const fire_token = localStorage.getItem('fire_token');

		if (fire_token === null) {
			userDispatch({ type: 'logout', payload: initialUserState });
			setAuthStage('No credentials found');
			setTimeout(() => {
				setLoading(false);
			}, 1000);
		} else {
			return Validate(fire_token, (error, user) => {
				if (error) {
					logging.error(error);
					setAuthStage('User not valid, logging out ...');
					userDispatch({ type: 'logout', payload: initialUserState });
					setLoading(false);
				} else if (user) {
					setAuthStage('User authenticated');
					userDispatch({ type: 'login', payload: { user, fire_token } });
					setLoading(false);
				}
			});
		}
	};

	const userContextVales = {
		userState,
		userDispatch,
	};

	if (loading) {
		return <LoadingComponent>{authStage}</LoadingComponent>;
	}

	return (
		<UserContextProvider value={userContextVales}>
			<Routes>
				{routes.map((route, index) => {
					if (route.auth) {
						return (
							<Route
								path={route.path}
								key={index}
								element={
									<AuthRoute>
										<route.component />
									</AuthRoute>
								}
							/>
						);
					}

					return (
						<Route
							path={route.path}
							key={index}
							element={<route.component />}
						/>
					);
				})}
			</Routes>
		</UserContextProvider>
	);
};

export default Application;
