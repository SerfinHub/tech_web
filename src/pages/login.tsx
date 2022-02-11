import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../contexts/user';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { Providers } from '../config/firebase';
import { Authenticate, SignInWithSocialMedia } from '../modules/auth';
import logging from '../config/logging';
import CenterPiece from '../components/CenterPiece';
import { Button, Card, CardBody, CardHeader } from 'reactstrap';
import ErrorText from '../components/ErrorText';
import LoadingComponent from '../components/LoadingComponent';

const LoginPage: React.FunctionComponent<{}> = (props) => {
	const [authenticating, setAuthenticating] = useState<boolean>(false);
	const [error, setError] = useState<string>('');

	const userContext = useContext(UserContext);
	const history = useNavigate();
	const isLogin = window.location.pathname.includes('login');

	const signInWithSocialMedia = (provider: firebase.auth.AuthProvider) => {
		if (error !== '') setError('');

		setAuthenticating(true);

		SignInWithSocialMedia(provider)
			.then(async (result) => {
				let user = result.user;

				if (user) {
					let uid = user.uid;
					let name = user.displayName;

					if (name) {
						try {
							let fire_token = await user.getIdToken();
							//logging.info(`Fire_token: ${fire_token}`);
							Authenticate(uid, name, fire_token, (error, _user) => {
								if (error) {
									logging.info(`_user: ${_user}`);
									setError(error);
									setAuthenticating(false);
								} else if (_user) {
									userContext.userDispatch({
										type: 'login',
										payload: { user: _user, fire_token },
									});
									history('/');
								}
							});
						} catch (error) {
							setError('Invalid token.');
							logging.error(error);
							setAuthenticating(false);
						}
					} else {
						/**
						 * We can set these manually with a new form
						 * For example, the Twitter provider sometimes
						 * does not provide a username as some users sign
						 * up with a phone number.  Here you could ask
						 * them to provide a name that would be displayed
						 * on this website.
						 * */
						setError('The identify provider is missing a display name.');
						setAuthenticating(false);
					}
				} else {
					setError(
						'The social media provider does not have enough information. Please try a different provider.'
					);
					setAuthenticating(false);
				}
			})
			.catch((error) => {
				logging.info('Catched Error!');
				logging.error(error);
				setAuthenticating(false);
				setError(error.message);
			});
	};

	return (
		<CenterPiece>
			<Card>
				<CardHeader>{isLogin ? 'Login' : 'Sign Up'}</CardHeader>
				<CardBody>
					<ErrorText error={error} />
					<Button
						block
						disabled={authenticating}
						onClick={() => signInWithSocialMedia(Providers.google)}
						style={{ backgroundColor: '#ea4335', borderColor: '#ea4335' }}
					>
						<i className="fab fa-google mr-2"></i> Sign{' '}
						{isLogin ? 'in' : 'up'} with Google
					</Button>
					{authenticating && <LoadingComponent card={false} />}
				</CardBody>
			</Card>
		</CenterPiece>
	);
};

export default LoginPage;
