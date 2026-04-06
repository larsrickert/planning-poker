/**
 * Generates a random 4-digit code.
 */
export function generateJoinCode(length = 4): string {
  // removed visually similar characters: O, 0, I, 1
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }

  return result;
}
