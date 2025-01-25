import { date, integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const activities = pgTable('activities', {
  id: varchar('id').primaryKey(),
  type: varchar('type').notNull(),
  date: date('date').notNull(),
  count: integer('count').notNull(),
});

export interface ActivityResponse {
  date: Date;
  count: number;
  id: string;
  type: 'study' | 'workout';
}
