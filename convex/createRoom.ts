import { GenericId } from 'convex/values';
import { mutation } from './_generated/server';

type Input = {
	roomName: string;
	initialMember: string;
	creator: GenericId<'users'>;
};

export default mutation(async ({ db }, { roomName, creator, initialMember }: Input) => {
	const foundRoom = await db
		.table('rooms')
		.filter((q) => q.eq(q.field('name'), roomName.trim()))
		.first();

	if (!foundRoom) {
		const foundMember = await db
			.table('users')
			.filter((q) => q.eq(q.field('email'), initialMember))
			.first();

		if (foundMember) {
			db.insert('rooms', {
				name: roomName,
				creator,
				members: [creator, foundMember._id],
			});
		}
		// 🚨 TODO: handle case where member is not found
	}
});
