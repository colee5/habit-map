import { InferModel } from 'drizzle-orm';
import * as schema from './schema';

export type Activity = InferModel<typeof schema.activities>;
export type NewActivity = InferModel<typeof schema.activities, 'insert'>;
