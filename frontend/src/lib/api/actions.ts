"use server";

import { cookies } from "next/headers";

/**
 * Server action to get all cookies as a string.
 * This can access HttpOnly cookies which document.cookie cannot.
 */
export const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  console.log(cookieStore)
  return cookieStore.toString();
};
