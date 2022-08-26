import { GenericId } from 'convex/values';
import { query } from './_generated/server';

export default query(async ({ db }, userId: GenericId<'users'> | null | undefined) => {
	if (!userId) return null;
	console.log('finding rooms');

	const rooms = await db.table('rooms').collect();

	const filteredRooms = rooms.forEach((el) => {
		if (el.members.some((member) => member.id === userId.id)) {
			console.log({
				roomName: el.name,
				userId: userId.id,
				members: el.members.map((el) => el.id),
			});
		}
		return el.members.some((member) => member.id === userId.id);
	});
	console.log({ filteredRooms });
	return rooms.filter((el) => el.members.some((member) => member.id === userId.id));
});
