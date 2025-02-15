import { db } from '@/db';
import { activities } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export async function getActivities(
  type: 'study' | 'workout',
  user: 'cole' | 'keki'
) {
  return await db
    .select()
    .from(activities)
    .where(and(eq(activities.type, type), eq(activities.user, user)));
}

export async function addActivity(
  type: 'study' | 'workout',
  date: Date,
  count: number,
  user: 'cole' | 'keki',
  description?: string
) {
  const localDate = date.toLocaleDateString('en-CA');

  return await db
    .insert(activities)
    .values({
      id: crypto.randomUUID(),
      type,
      date: localDate,
      count,
      user,
      description,
    })
    .returning();
}
