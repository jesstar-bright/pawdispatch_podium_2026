import { db, sqlite } from "./index";
import { sql } from "drizzle-orm";

/**
 * Initialize database tables
 * Run this once to create all tables
 */
export async function initializeDatabase() {
  try {
    // Create customers table
    await sqlite.exec(`
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create groomers table
    await sqlite.exec(`
      CREATE TABLE IF NOT EXISTS groomers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        available INTEGER NOT NULL DEFAULT 1
      )
    `);

    // Create pets table
    await sqlite.exec(`
      CREATE TABLE IF NOT EXISTS pets (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        name TEXT NOT NULL,
        breed TEXT,
        weight REAL,
        size_category TEXT NOT NULL,
        image_url TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id)
      )
    `);

    // Create pricing_estimates table
    await sqlite.exec(`
      CREATE TABLE IF NOT EXISTS pricing_estimates (
        id TEXT PRIMARY KEY,
        pet_id TEXT,
        base_price INTEGER NOT NULL,
        adjustments TEXT NOT NULL,
        total_price INTEGER NOT NULL,
        size_category TEXT NOT NULL,
        explanation TEXT NOT NULL,
        image_url TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (pet_id) REFERENCES pets(id)
      )
    `);

    // Create appointments table
    await sqlite.exec(`
      CREATE TABLE IF NOT EXISTS appointments (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        pet_id TEXT NOT NULL,
        estimate_id TEXT NOT NULL,
        groomer_id TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'confirmed',
        confirmation_number TEXT NOT NULL UNIQUE,
        notes TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id),
        FOREIGN KEY (pet_id) REFERENCES pets(id),
        FOREIGN KEY (estimate_id) REFERENCES pricing_estimates(id),
        FOREIGN KEY (groomer_id) REFERENCES groomers(id)
      )
    `);

    // Create indexes
    await sqlite.exec(`
      CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON appointments(start_time);
      CREATE INDEX IF NOT EXISTS idx_appointments_confirmation_number ON appointments(confirmation_number);
      CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
      CREATE INDEX IF NOT EXISTS idx_pricing_estimates_pet_id ON pricing_estimates(pet_id);
    `);

    console.log("Database tables initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}
