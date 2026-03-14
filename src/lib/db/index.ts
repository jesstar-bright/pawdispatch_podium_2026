import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";
import { mkdir } from "fs/promises";
import { initializeDatabase } from "./migrate";

// Database file location
const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "pawdispatch.db");

// Ensure data directory exists
mkdir(DB_DIR, { recursive: true }).catch(() => {
  // Ignore if already exists
});

// Create SQLite database connection
const sqlite = new Database(DB_PATH);

// Enable foreign keys
sqlite.pragma("foreign_keys = ON");

// Initialize tables on first import (idempotent)
initializeDatabase().catch((err) => {
  console.error("Failed to initialize database:", err);
});

// Create Drizzle instance
export const db = drizzle(sqlite, { schema });

// Export schema for migrations
export { schema };

// Export database instance for direct access if needed
export { sqlite };
