import { GenericId } from 'convex/values';
import { useSession } from 'next-auth/react';
import React, { FormEvent, useEffect } from 'react';
import { useMutation, useQuery } from '../../convex/_generated/react';

export default function AddRoomForm() {
	const { data } = useSession();
	const user = useQuery('getUser', data?.user?.email ?? '');
	const userMutation = useMutation('createUser');

	const createRoom = useMutation('createRoom');
	const [roomName, setRoomName] = React.useState('');
	const [inviteEmail, setInviteEmail] = React.useState('');

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await createRoom({
			roomName,
			creator: user?._id as GenericId<'users'>,
			initialMember: inviteEmail,
		});
		setRoomName('');
		setInviteEmail('');
	};

	useEffect(() => {
		if (data) {
			userMutation({ email: data.user?.email as string });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	return (
		<form onSubmit={handleSubmit} className='mt-12 space-y-4 mx-auto w-full max-w-[400px]'>
			<div className='flex flex-col space-y-2'>
				<label htmlFor='roomName' className='block text-sm font-medium text-gray-700'>
					Room Name
				</label>
				<input
					type='text'
					name='roomName'
					id='roomName'
					value={roomName}
					onChange={(e) => setRoomName(e.target.value)}
					className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
					placeholder='My favorite room'
				/>
			</div>
			<div className='flex flex-col space-y-2'>
				<label htmlFor='inviteEmail' className='block text-sm font-medium text-gray-700'>
					Invite someone
				</label>
				<input
					type='email'
					name='inviteEmail'
					id='inviteEmail'
					value={inviteEmail}
					onChange={(e) => setInviteEmail(e.target.value)}
					className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
					placeholder='Enter email'
				/>
			</div>
			<button
				type='submit'
				disabled={!roomName || !inviteEmail}
				className='disabled:bg-gray-500 transition-all inline-block mt-6 w-full items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
				Create a room
			</button>
		</form>
	);
}
