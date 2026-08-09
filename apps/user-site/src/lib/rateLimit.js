// Rolling window rate limit checker (5 uploads / hour per user)
import { STORAGE_KEYS } from '../constants/enums.js';

const MAX_UPLOADS_PER_HOUR = 5;
const ONE_HOUR_MS = 60 * 60 * 1000;

export function checkRateLimit() {
  const now = Date.now();
  const raw = localStorage.getItem(STORAGE_KEYS.UPLOAD_COUNT);
  let record = { count: 0, resetAt: now + ONE_HOUR_MS };

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (now > parsed.resetAt) {
        record = { count: 0, resetAt: now + ONE_HOUR_MS };
      } else {
        record = parsed;
      }
    } catch {
      record = { count: 0, resetAt: now + ONE_HOUR_MS };
    }
  }

  if (record.count >= MAX_UPLOADS_PER_HOUR) {
    const minsLeft = Math.ceil((record.resetAt - now) / 60000);
    return {
      allowed: false,
      error: `Rate limit reached. Max 5 uploads/hour. Try again in ${minsLeft} minute(s).`
    };
  }

  return { allowed: true, record };
}

export function incrementRateLimitCount() {
  const check = checkRateLimit();
  if (!check.allowed) return check;

  const record = check.record || { count: 0, resetAt: Date.now() + ONE_HOUR_MS };
  record.count += 1;
  localStorage.setItem(STORAGE_KEYS.UPLOAD_COUNT, JSON.stringify(record));
  return { allowed: true, count: record.count };
}
