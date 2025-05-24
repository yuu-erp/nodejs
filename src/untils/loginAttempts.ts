const attempts: Record<string, { count: number, lastAttempt: number }> = {}
export function canAttemptLogin(email: string): boolean {
  const now = Date.now();
  const record = attempts[email];
  if (!record) return true;

  if (now - record.lastAttempt > 15 * 60 * 1000) {
    delete attempts[email];
    return true;
  }

  return record.count < 5;
}

export function recordFailedAttempt(email: string): void {
  const now = Date.now();
  if (!attempts[email]) {
    attempts[email] = { count: 1, lastAttempt: now };
  } else {
    attempts[email].count++;
    attempts[email].lastAttempt = now;
  }
}

export function resetAttempts(email: string): void {
  delete attempts[email];
}
