import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import React from 'react';
import { useMutation, useQuery } from '../../../convex/_generated/react';
import { authOptions } from '../api/auth/[...nextauth]';
import convexConfig from '../../../convex.json';
import { ConvexHttpClient } from 'convex/browser';
import { format } from 'date-fns';
import { GenericId } from 'convex/values';
import { ChevronLeftIcon, PaperAirplaneIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import AddMemberDialog from '../../components/AddMemberDialog';

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

export default function RoomPage({ email }: Props) {
	const { query, back } = useRouter();
	const user = useQuery('getUser', email);
	const [showModal, setShowModal] = React.useState(false);
	const [content, setContent] = React.useState('');

	const room = useQuery('getRoom', query.id as string);
	const messages = useQuery('getMessages', query.id as string);
	const createMessage = useMutation('createMessage');

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await createMessage({
			content,
			room: query.id as string,
			sender: user?._id as GenericId<'users'>,
		});
		setContent('');
	};

	return (
		<>
			<AddMemberDialog room={query.id as string} show={showModal} onClose={() => setShowModal(false)} />
			<div className='w-full bg-white h-full'>
				<div onClick={() => back()} className='mt-2 ml-2 w-min flex cursor-pointer items-center space-x-1'>
					<ChevronLeftIcon className='h-4 w-4' aria-hidden='true' />
					<p className='text-gray-600 text-sm'>Back</p>
				</div>
				<div className='rounded-lg shadow-sm p-2 m-2 flex items-center justify-between'>
					<div>
						<h2 className='font-medium text-lg text-gray-600'>{room?.name}</h2>
						<p className='text-sm text-gray-500'>{room?.members.length} members </p>
					</div>
					<button
						type='button'
						onClick={() => setShowModal(true)}
						className='inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
						<UserPlusIcon className='-ml-0.5 mr-2 h-4 w-4' aria-hidden='true' />
						Add member
					</button>
				</div>
				<ul className='bg-white w-full min-h-full overflow-y-scroll mt-3 p-3 rounded-lg space-y-3 divide-y divide-gray-50'>
					{messages?.map((message) => (
						<li key={message._id.id} className='text-gray-800'>
							<div className=''>
								<p className='text-gray-800 font-medium'>{message.content}</p>
								<p className='text-gray-400 text-xs font-light'>
									{format(message._creationTime, 'MMM do, yyyy h:mm a')}
								</p>
							</div>
						</li>
					))}
				</ul>
				<div className='bg-white sticky bottom-0'>
					<form onSubmit={handleSubmit} className='w-full flex space-x-3 bottom-0 p-3'>
						<label htmlFor='content' className='sr-only'>
							New Message
						</label>
						<input
							type='text'
							name='content'
							id='content'
							value={content}
							onChange={(e) => setContent(e.target.value)}
							className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
							placeholder='Enter message'
						/>
						<button
							type='submit'
							className='inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
							<PaperAirplaneIcon className='-ml-0.5 mr-2 h-4 w-4' aria-hidden='true' />
							Send
						</button>
					</form>
				</div>
			</div>
		</>
	);
}
