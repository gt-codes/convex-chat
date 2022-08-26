/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GenericId } from 'convex/values';
import { mutation } from './_generated/server';

type Input = {
	room: GenericId<'rooms'>;
	initialMember: string;
};

export default mutation(async ({ db }, { room, initialMember }: Input) => {
	const foundRoom = await db
		.table('rooms')
		.filter((q) => q.eq(q.field('_id'), room))
		.first();

	const foundMember = await db
		.table('users')
		.filter((q) => q.eq(q.field('email'), initialMember))
		.first();

	//  Don't readd the same member to the room
	if (!foundMember || foundRoom?.members.some((member) => member.id === foundMember._id.id)) {
		return null;
	}

	db.patch(foundRoom!._id, {
		members: [...foundRoom!.members, foundMember._id],
	});
});
