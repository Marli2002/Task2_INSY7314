// sanitize.js

export function sanitizeInput(input, allowDot = true) {
  if (typeof input === "string") {
    if (allowDot) {
      return input.replace(/[$]/g, "").trim(); // only remove $ when allowDot is true
    }
    return input.replace(/[$.]/g, "").trim(); // normal sanitization
  }
  return input;
}

// Updated sanitizeEmail
export function sanitizeEmail(email) {
  const clean = sanitizeInput(email, true).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean) ? clean : null;
}

export function sanitizeUsername(username) {
  const clean = sanitizeInput(username);
  return /^[a-zA-Z0-9_]{3,30}$/.test(clean) ? clean : null;
}

export function sanitizePassword(password) {
  const clean = password.trim();
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  return regex.test(clean) ? clean : null;
}

export function sanitizeAmount(amount) {
  const num = parseFloat(amount);
  if (isNaN(num) || num <= 0) return null;
  return Math.round(num * 100) / 100;
}

export function sanitizePaymentMethod(method) {
  const validMethods = ['card', 'bank', 'cash', 'paypal'];
  return validMethods.includes(method.toLowerCase()) ? method.toLowerCase() : null;
}
