import { GenericId } from 'convex/values';
import { query } from './_generated/server';

export default query(async ({ db }, userId: GenericId<'users'> | null | undefined) => {
	if (!userId) return null;
	console.log('finding rooms');

	const rooms = await db.table('rooms').collect();

	const filteredRooms = rooms.filter((el) => el.members.some((member) => member.id === userId.id));
	console.log({ filteredRooms });
	return rooms;
});
