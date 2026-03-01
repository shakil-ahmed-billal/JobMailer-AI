"use server";
import { cookies } from "next/headers";

const getCookies = async () => {
  const cookieStore = await cookies();
  return cookieStore.toString();
};

export default getCookies;
