import { query } from './_generated/server';

export default query(async ({ db }, roomId: string) => {
	const rooms = await db.table('rooms').collect();
	const room = rooms.filter((el) => el._id.id === roomId)[0];
	return room;
});
