import { GenericId } from 'convex/values';
import { mutation } from './_generated/server';

type Input = {
	content: string;
	room: string;
	sender: GenericId<'users'>;
};

export default mutation(async ({ db }, input: Input) => {
	db.insert('messages', input);
});
