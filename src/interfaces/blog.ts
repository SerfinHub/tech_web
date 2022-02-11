import IUser from './user';

export default interface IBlog {
	content: string;
	_id: string;
	title: string;
	author: string | IUser;
	headline: string;
	picture?: string;
	createdAt: string;
	updatedAt: string;
}
