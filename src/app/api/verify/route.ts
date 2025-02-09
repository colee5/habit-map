import { NextResponse } from 'next/server';

type User = 'cole' | 'keki';

const colePassword = process.env.COLE_PASSWORD;
const kekiPassword = process.env.KEKI_PASSWORD;

if (!colePassword || !kekiPassword) {
  throw new Error('Environment variables missing');
}

export async function POST(request: Request) {
  const { otp, user }: { otp: string; user: User } = await request.json();

  const passwords: Record<User, string | undefined> = {
    cole: process.env.COLE_PASSWORD,
    keki: process.env.KEKI_PASSWORD,
  };

  const isValid = otp === passwords[user];

  return NextResponse.json({ isValid });
}
