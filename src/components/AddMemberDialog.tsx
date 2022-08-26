/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { useMutation, useQuery } from '../../convex/_generated/react';
import { GenericId } from 'convex/values';

type Props = {
	show: boolean;
	room: string;
	onClose: () => void;
};

export default function AddMemberDialog({ show, room, onClose }: Props) {
	const [email, setEmail] = useState('');
	const roomData = useQuery('getRoom', room);
	const addMember = useMutation('addMemberToRoom');

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		addMember({
			room: roomData?._id as GenericId<'rooms'>,
			initialMember: email,
		});
	};

	return (
		<Transition.Root show={show} as={Fragment}>
			<Dialog as='div' className='relative z-10' onClose={onClose}>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'>
					<div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
				</Transition.Child>

				<div className='fixed z-10 inset-0 overflow-y-auto'>
					<div className='flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
							enterTo='opacity-100 translate-y-0 sm:scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 translate-y-0 sm:scale-100'
							leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'>
							<Dialog.Panel className='relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-sm sm:w-full sm:p-6'>
								<div>
									<div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100'>
										<UserPlusIcon className='h-6 w-6 text-green-600' aria-hidden='true' />
									</div>
									<div className='mt-3 text-center sm:mt-5'>
										<Dialog.Title as='h3' className='text-lg leading-6 font-medium text-gray-900'>
											Add a member
										</Dialog.Title>
										<div className='mt-2'>
											<p className='text-sm text-gray-500'>
												Add an email below of someone you&apos;d like to add to this room.
											</p>
										</div>
									</div>
								</div>
								<form onSubmit={handleSubmit} className='mt-5 sm:mt-6'>
									<label htmlFor='email' className='sr-only'>
										Email
									</label>
									<input
										type='email'
										name='email'
										id='email'
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
										placeholder='you@example.com'
									/>
									<button
										type='submit'
										className='inline-flex mt-2 justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm'>
										Add member
									</button>
								</form>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
