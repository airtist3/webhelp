'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';

import {
  createUser,
  getUser,
  updateChatVisiblityById, // ✅ Correct spelling here
} from '@/lib/db/queries';

import { signIn } from './auth';
import type { VisibilityType } from '@/components/visibility-selector';

/* -------------------------------------------------------------------------- */
/*                                Auth Actions                                */
/* -------------------------------------------------------------------------- */

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export interface LoginActionState {
  status: 'idle' | 'in_progress' | 'success' | 'failed' | 'invalid_data';
}

export const login = async (
  _: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    await signIn('credentials', {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { status: 'success' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }

    return { status: 'failed' };
  }
};

export interface RegisterActionState {
  status:
    | 'idle'
    | 'in_progress'
    | 'success'
    | 'failed'
    | 'user_exists'
    | 'invalid_data';
}

export const register = async (
  _: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    const [user] = await getUser(validatedData.email);

    if (user) {
      return { status: 'user_exists' };
    }

    await createUser(validatedData.email, validatedData.password);

    await signIn('credentials', {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { status: 'success' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }

    return { status: 'failed' };
  }
};

/* -------------------------------------------------------------------------- */
/*                            Chat Setting Utilities                          */
/* -------------------------------------------------------------------------- */

// Save selected model ID to cookie
export async function saveChatModelAsCookie(modelId: string) {
  const cookieStore = await cookies(); // ✅ fix: add await
  cookieStore.set('selectedChatModel', modelId, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
}

// Update chat visibility in the database
export async function updateChatVisibility({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: VisibilityType;
}) {
  await updateChatVisiblityById({ chatId, visibility }); // ✅ matches export in queries.ts
}