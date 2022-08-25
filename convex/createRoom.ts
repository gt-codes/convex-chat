import { GenericId } from 'convex/values';
import { mutation } from './_generated/server';

type Input = {
	roomName: string;
	creator: GenericId<'users'>;
};

export default mutation(async ({ db }, { roomName, creator }: Input) => {
	const foundRoom = await db
		.table('rooms')
		.filter((q) => q.eq(q.field('name'), roomName))
		.first();

	if (!foundRoom) {
		db.insert('rooms', { name: roomName, creator });
	}
});
