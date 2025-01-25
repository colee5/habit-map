import { db } from '@/db';
import { activities } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getActivities(type: 'study' | 'workout') {
  return await db.select().from(activities).where(eq(activities.type, type));
}

export async function addActivity(
  type: 'study' | 'workout',
  date: Date,
  count: number
) {
  return await db
    .insert(activities)
    .values({
      id: crypto.randomUUID(),
      type,
      date: date.toISOString().split('T')[0],
      count,
    })
    .returning();
}
