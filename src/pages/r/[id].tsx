import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';
import { useMutation, useQuery } from '../../../convex/_generated/react';
import { authOptions } from '../api/auth/[...nextauth]';
import convexConfig from '../../../convex.json';
import { ConvexHttpClient } from 'convex/browser';
import { format } from 'date-fns';
import { GenericId } from 'convex/values';
import { ChevronLeftIcon, PaperAirplaneIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import AddMemberDialog from '../../components/AddMemberDialog';
import Message from '../../components/Message';

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

	const scrollRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await createMessage({
			content,
			room: query.id as string,
			sender: user?._id as GenericId<'users'>,
		});
		setContent('');
	};

	useEffect(() => {
		scrollToBottom();
	});

	return (
		<>
			<AddMemberDialog room={query.id as string} show={showModal} onClose={() => setShowModal(false)} />
			<div className='w-full relative bg-white h-full flex flex-col'>
				<div className='p-2 pb-0 sticky top-0 bg-white'>
					<div onClick={() => back()} className='w-min flex cursor-pointer items-center space-x-1'>
						<ChevronLeftIcon className='h-4 w-4' aria-hidden='true' />
						<p className='text-gray-600 text-sm'>Back</p>
					</div>
					<div className='rounded-lg shadow-sm p-2 flex items-center justify-between'>
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
				</div>

				<ul className='w-full grow scrollbar-hide overflow-y-scroll p-3 pb-0 space-y-1'>
					{messages?.map((message) => (
						<Message key={message._id.id} message={message} isSender={user?._id.id === message.sender.id} />
					))}
					<div ref={scrollRef} id='scrollhere' />
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
