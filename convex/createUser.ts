import { mutation } from './_generated/server';

type Input = {
	email: string;
};

export default mutation(async ({ db }, { email }: Input) => {
	const foundUser = await db
		.table('users')
		.filter((q) => q.eq(q.field('email'), email))
		.first();

	if (foundUser) return foundUser;
	db.insert('users', { email });
});
