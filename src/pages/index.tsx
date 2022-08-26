import type { GetServerSideProps, NextPage } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useMutation, useQuery } from '../../convex/_generated/react';
import AddRoomForm from '../components/AddRoomForm';
import { authOptions } from './api/auth/[...nextauth]';
import convexConfig from '../../convex.json';
import { ConvexHttpClient } from 'convex/browser';
import Header from '../components/Header';
import RoomsList from '../components/RoomsList';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

const convex = new ConvexHttpClient(convexConfig.origin);

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const session = await unstable_getServerSession(ctx.req, ctx.res, authOptions);

	if (!session) {
		return {
			redirect: {
				destination: '/auth',
				permanent: false,
			},
		};
	}
	console.log({ session });
	const user = await convex.query('getUser')(session.user?.email);

	return {
		props: {
			email: user.email,
		},
	};
};

type Props = {
	email: string;
};

const Home: NextPage<Props> = ({ email }) => {
	const { data } = useSession();
	const user = useQuery('getUser', email);
	const userMutation = useMutation('createUser');

	useEffect(() => {
		if (data) {
			userMutation({ email: data.user?.email as string });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	return (
		<div className='bg-[#fafafa] items-center relative w-screen h-screen flex flex-col'>
			<Header />
			<div className='w-full max-w-3xl flex flex-col items-start'>
				<AddRoomForm />
				<h3 className='mt-16 text-lg font-medium text-gray-600'>Your Rooms</h3>
				{user && <RoomsList userId={user._id} />}
			</div>
		</div>
	);
};

export default Home;
