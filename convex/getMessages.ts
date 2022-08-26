import { query } from './_generated/server';

export default query(async ({ db }, room: string) => {
	const messages = db.table('messages').filter((q) => q.eq(q.field('room'), room));
	return messages.collect();
});
