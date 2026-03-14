import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const customers = sqliteTable("customers", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  created_at: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const pets = sqliteTable("pets", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  customer_id: text("customer_id")
    .notNull()
    .references(() => customers.id),
  name: text("name").notNull(),
  breed: text("breed"),
  weight: real("weight"),
  size_category: text("size_category").notNull(), // small, medium, large, xlarge
  image_url: text("image_url").notNull(),
  created_at: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const pricing_estimates = sqliteTable("pricing_estimates", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  pet_id: text("pet_id").references(() => pets.id), // nullable initially
  base_price: integer("base_price").notNull(), // cents
  adjustments: text("adjustments").notNull(), // JSON string
  total_price: integer("total_price").notNull(), // cents
  size_category: text("size_category").notNull(), // small, medium, large, xlarge
  explanation: text("explanation").notNull(),
  image_url: text("image_url").notNull(),
  created_at: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const groomers = sqliteTable("groomers", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  available: integer("available", { mode: "boolean" }).notNull().default(true),
});

export const appointments = sqliteTable("appointments", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  customer_id: text("customer_id")
    .notNull()
    .references(() => customers.id),
  pet_id: text("pet_id").notNull().references(() => pets.id),
  estimate_id: text("estimate_id")
    .notNull()
    .references(() => pricing_estimates.id),
  groomer_id: text("groomer_id")
    .notNull()
    .references(() => groomers.id),
  start_time: text("start_time").notNull(), // ISO datetime string
  end_time: text("end_time").notNull(), // ISO datetime string
  status: text("status").notNull().default("confirmed"), // confirmed, completed, cancelled
  confirmation_number: text("confirmation_number").notNull().unique(),
  notes: text("notes"),
  created_at: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Type exports for use in API routes
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
export type Pet = typeof pets.$inferSelect;
export type NewPet = typeof pets.$inferInsert;
export type PricingEstimate = typeof pricing_estimates.$inferSelect;
export type NewPricingEstimate = typeof pricing_estimates.$inferInsert;
export type Groomer = typeof groomers.$inferSelect;
export type NewGroomer = typeof groomers.$inferInsert;
export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;
