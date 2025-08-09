import { date, integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const activities = pgTable('activities', {
  id: varchar('id').primaryKey(),
  type: varchar('type').notNull(),
  date: date('date').notNull(),
  count: integer('count').notNull(),
  user: varchar('user').notNull(),
  description: varchar('description'),
});

export interface ActivityResponse {
  date: Date;
  count: number;
  id: string;
  type: 'study' | 'workout' | 'plan';
  user: 'cole' | 'keki';
  description?: string;
}
