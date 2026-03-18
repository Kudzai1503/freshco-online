import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

type StoredUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

const authUsersPath = path.join(process.cwd(), "data", "auth-users.json");

async function ensureStoreFile() {
  await fs.mkdir(path.dirname(authUsersPath), { recursive: true });

  try {
    await fs.access(authUsersPath);
  } catch {
    await fs.writeFile(authUsersPath, "[]", "utf8");
  }
}

async function readUsers(): Promise<StoredUser[]> {
  await ensureStoreFile();

  try {
    const raw = await fs.readFile(authUsersPath, "utf8");
    const parsed = JSON.parse(raw) as StoredUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeUsers(users: StoredUser[]) {
  await ensureStoreFile();
  await fs.writeFile(authUsersPath, JSON.stringify(users, null, 2), "utf8");
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string) {
  const [salt, key] = storedHash.split(":");
  if (!salt || !key) {
    return false;
  }

  const derivedKey = scryptSync(password, salt, 64);
  const storedKey = Buffer.from(key, "hex");

  if (storedKey.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(storedKey, derivedKey);
}

export async function findUserByEmail(email: string) {
  const users = await readUsers();
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function createUser(input: { name: string; email: string; password: string }) {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  const password = input.password;

  if (!name || !email || !password) {
    throw new Error("Name, email, and password are required.");
  }

  const users = await readUsers();
  if (users.some((user) => user.email.toLowerCase() === email)) {
    throw new Error("An account with that email already exists.");
  }

  const user: StoredUser = {
    id: globalThis.crypto?.randomUUID?.() ?? `user-${Date.now()}`,
    name,
    email,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await writeUsers(users);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

export async function validateCredentials(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) {
    return null;
  }

  if (!verifyPassword(password, user.passwordHash)) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}
