import { GenericId } from 'convex/values';
import { format } from 'date-fns';
import React from 'react';
import { classNames } from '../utils';

type Props = {
	isSender: boolean;
	message: {
		_id: GenericId<'messages'>;
		_creationTime: number;
		content: string;
		room: string;
		sender: GenericId<'users'>;
	};
};

export default function Message({ message, isSender }: Props) {
	return (
		<li className={classNames(isSender ? 'justify-end' : 'justify-start', 'flex')}>
			<div className='group'>
				<div className={classNames(isSender ? 'bg-indigo-500' : 'bg-gray-100', 'rounded-full py-2 px-4')}>
					<p className={classNames(isSender ? 'text-white' : '', 'font-medium')}>{message.content}</p>
				</div>
				<p
					className={classNames(
						isSender ? 'text-right' : 'text-left',	
						'opacity-0 group-hover:opacity-100 transition-all text-gray-500 text-xs mt-1 font-light'
					)}>
					{format(message._creationTime, 'h:mm aaa')}
				</p>
			</div>
		</li>
	);
}
