import { GenericId } from 'convex/values';
import { query } from './_generated/server';

export default query(async ({ db }, userId: GenericId<'users'>) => {
	const rooms = await db.table('rooms').collect();
	return rooms.filter((el) => el.members.some((member) => member.id === userId.id));
});
