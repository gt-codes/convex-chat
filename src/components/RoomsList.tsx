import { GenericId } from "convex/values";
import { useQuery } from "../../convex/_generated/react";
import { format } from "date-fns";

export default function RoomsList({ userId }: { userId: GenericId<'users'> }) {
	const rooms = useQuery('getRooms', userId);

	return (
		<ul className='bg-white w-full mt-3 p-3 rounded-lg space-y-3 divide-y divide-gray-50'>
			{rooms?.map((room) => (
				<li key={room._id.id} className='text-gray-800'>
					<div className=''>
						<p className='text-gray-800 font-medium'>{room.name}</p>
						<p className='text-gray-400 text-xs font-light'>
							{format(room._creationTime, 'MMM do, yyyy h:mm a')}
						</p>
					</div>
				</li>
			))}
		</ul>
	);
}
