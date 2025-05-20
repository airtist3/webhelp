import { generateId } from 'ai';
import { genSaltSync, hashSync } from 'bcrypt-ts';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/queries';
import { message } from '@/lib/db/schema';

/**
 * Hash a password using bcrypt.
 */
export function generateHashedPassword(password: string): string {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);
  return hash;
}

/**
 * Create a dummy hashed password (e.g. for guest users).
 */
export function generateDummyPassword(): string {
  const password = generateId(12);
  return generateHashedPassword(password);
}

/**
 * Delete a single message by ID.
 */
export async function deleteTrailingMessages({ id }: { id: string }): Promise<void> {
  try {
    await db.delete(message).where(eq(message.id, id));
  } catch (error) {
    throw new Error('Failed to delete trailing messages');
  }
}