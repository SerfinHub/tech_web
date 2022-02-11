import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'reactstrap';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import IPageProps from '../interfaces/pages';

const NotFound: React.FunctionComponent<IPageProps> = (props) => {
	return (
		<Container fluid className="p-0">
			<Navigation />
			<Header
				headline="Check out what people have to say"
				title="A Nerdy Blog Website"
			/>
			<Container className="mt-5">
				<h1> Page not found - 404</h1>
				<h5>
					There are no blogs yet. You should
					<Link to="/"> RETURN and CREATE </Link>
					one 😊.
				</h5>
			</Container>
		</Container>
	);
};

export default NotFound;
