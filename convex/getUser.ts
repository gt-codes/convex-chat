import { query } from './_generated/server';

export default query(async ({ db }, email: string | null | undefined) => {
	if (!email) return null;

	const user = db
		.table('users')
		.filter((q) => q.eq(q.field('email'), email))
		.first();

	return user;
});
