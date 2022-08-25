import { GenericId } from 'convex/values';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useMutation, useQuery } from '../../convex/_generated/react';
import AddRoomForm from '../components/AddRoomForm';

const Home: NextPage = () => {
	const { data } = useSession();
	const user = useQuery('getUser', data?.user?.email ?? '');
	const rooms = useQuery('getRooms', (user?._id as GenericId<'users'>) ?? '');
	const userMutation = useMutation('createUser');

	useEffect(() => {
		if (data) {
			userMutation({ email: data.user?.email as string });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	console.log({ data, rooms });

	return (
		<div className='p-12 flex flex-col space-y-16'>
			<p>{user?.email}</p>
			{rooms && (
				<ul>
					{rooms.map((room) => (
						<li key={room._id.id} className='text-red-200'>
							{room.name}
						</li>
					))}
				</ul>
			)}
			<AddRoomForm />
		</div>
	);
};

export default Home;
