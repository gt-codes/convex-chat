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
	const { query } = useRouter();
	const user = useQuery('getUser', email);
	const [content, setContent] = React.useState('');

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
		<div>
			<form onSubmit={handleSubmit} className='mt-12 mx-auto w-full max-w-[400px]'>
				<div className='flex flex-col space-y-2'>
					<label htmlFor='content' className='block text-sm font-medium text-gray-700'>
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
						className='inline-block items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
						Send
					</button>
				</div>
			</form>
			<ul className='bg-white w-full mt-3 p-3 rounded-lg space-y-3 divide-y divide-gray-50'>
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
		</div>
	);
}
