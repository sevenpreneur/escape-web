"use server";
import { auth } from '@/lib/auth/server';
import { query } from '@/lib/db';

export async function loginAdmin(email: string, password: string) {
  // 1. Verify the email exists in the admin_users allowlist (Neon)
  const { rows } = await query('SELECT * FROM admin_users WHERE email = $1 LIMIT 1', [email]);
  const adminUser = rows[0];

  if (!adminUser) {
    return { success: false, error: "Email not authorized as admin." };
  }

  // 2. If they are in the table, try to log them in
  const { error: authError } = await auth.signIn.email({ email, password });

  if (authError) {
    return { success: false, error: "Invalid email or password." };
  }

  return { success: true };
}

export async function logoutAdmin() {
  await auth.signOut();
  return { success: true };
}

// THIS IS YOUR DASHBOARD BYPASS:
// We will use this once to create your account without needing the dashboard
export async function forceCreateAdminUser(email: string, password: string) {
  const { error } = await auth.signUp.email({ email, password, name: email });

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}
