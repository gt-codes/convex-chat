import { defineSchema, defineTable, s } from 'convex/schema';

export default defineSchema({
	rooms: defineTable({
		creator: s.id('users'),
		name: s.string(),
	}),
	messages: defineTable({
		content: s.string(),
		room: s.id('rooms'),
		user: s.id('users'),
	}),
	users: defineTable({
		email: s.string(),
	}),
	room_users: defineTable({
		userId: s.id('users'),
		roomId: s.id('rooms'),
	}),
});
