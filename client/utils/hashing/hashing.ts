import bcrypt from 'bcryptjs';

interface CompareHashTypes {
  original: string;
  str: string;
}

export async function HashString(str: string): Promise<string> {
  const hashed = await bcrypt.hash(str, 10);
  return hashed;
}

export async function CompareHash({ original, str }: CompareHashTypes): Promise<boolean> {
  const isMatch = await bcrypt.compare(str, original);
  return isMatch;
}
