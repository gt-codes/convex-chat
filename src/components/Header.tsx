import { signOut } from 'next-auth/react';
import React from 'react';

export default function Header() {
	return (
		<div className='sticky w-full top-0 bg-white p-8 '>
			<h1 className='text-xl font-bold text-center'>Convex Chat</h1>
			<button
				type='button'
				onClick={() => signOut({ callbackUrl: '/auth' })}
				className='absolute right-4 top-8 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
				Sign out
			</button>
		</div>
	);
}
