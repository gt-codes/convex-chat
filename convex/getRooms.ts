import { GenericId } from 'convex/values';
import { query } from './_generated/server';

export default query(async ({ db }, userId: GenericId<'users'> | null | undefined) => {
	if (!userId) return null;
	console.log('finding rooms');

	const rooms = db.table('rooms').filter((q) => q.eq(q.field('creator'), userId));

	return rooms.collect();
});
