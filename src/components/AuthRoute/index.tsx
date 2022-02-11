import React, { useContext } from 'react';
import {Route, Routes } from 'react-router-dom';
import logging from '../../config/logging';
import UserContext from '../../contexts/user';
import LoginPage from '../../pages/login';

export interface IAuthRouteProps {}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = (props) => {
	const { children } = props;

	const { user } = useContext(UserContext).userState;

	if (user._id === '') {
		logging.info('Unautherized, redirecting ...');
		//return <Redirect to="/login" />
		return (
			<Routes>
				<Route path="*" element={<LoginPage/>} />
			</Routes>
		);
	} else {
		return <>{children}</>;
	}
};

export default AuthRoute;
