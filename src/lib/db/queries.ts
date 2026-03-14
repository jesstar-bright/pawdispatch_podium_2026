import { db } from "./index";
import { appointments, customers, pets, groomers, pricing_estimates } from "./schema";
import { eq, and, gte, lte, sql, desc } from "drizzle-orm";

export interface AppointmentWithDetails {
  id: string;
  customerName: string;
  petName: string;
  breed: string | null;
  groomer: string;
  time: string;
  date: string;
  status: "scheduled" | "in_transit" | "grooming" | "completed" | "cancelled";
  price: number; // in cents
  location: string;
  confirmationNumber: string;
}

export interface GroomerStats {
  name: string;
  appointments: number;
  utilization: number;
}

export interface WeeklyRevenue {
  day: string;
  revenue: number; // in cents
}

export interface MarketStats {
  area: string;
  bookings: number;
  revenue: number; // in dollars
}

export interface CustomerMetrics {
  totalCustomers: number;
  repeatRate: string;
  avgLifetimeValue: string;
  churnRate: string;
}

/**
 * Get all appointments with related customer, pet, groomer, and estimate data
 */
export async function getAllAppointments(): Promise<AppointmentWithDetails[]> {
  const results = await db
    .select({
      id: appointments.id,
      customerName: customers.name,
      petName: pets.name,
      breed: pets.breed,
      groomerName: groomers.name,
      startTime: appointments.start_time,
      endTime: appointments.end_time,
      status: appointments.status,
      totalPrice: pricing_estimates.total_price,
      customerAddress: customers.address,
      confirmationNumber: appointments.confirmation_number,
    })
    .from(appointments)
    .innerJoin(customers, eq(appointments.customer_id, customers.id))
    .innerJoin(pets, eq(appointments.pet_id, pets.id))
    .innerJoin(groomers, eq(appointments.groomer_id, groomers.id))
    .innerJoin(pricing_estimates, eq(appointments.estimate_id, pricing_estimates.id))
    .orderBy(desc(appointments.start_time));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return results.map((r) => {
    const startDate = new Date(r.startTime);
    const isToday = startDate >= today && startDate < tomorrow;
    const isTomorrow = startDate >= tomorrow && startDate < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000);

    let dateLabel: string;
    if (isToday) {
      dateLabel = "Today";
    } else if (isTomorrow) {
      dateLabel = "Tomorrow";
    } else {
      dateLabel = startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }

    const timeStr = startDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    // Extract city from address (assuming format like "123 main street, Salt Lake City")
    const addressParts = r.customerAddress.split(",");
    const location = addressParts.length > 1 ? addressParts[addressParts.length - 1].trim() : "Unknown";

    // Map database status to UI status
    let uiStatus: AppointmentWithDetails["status"];
    if (r.status === "confirmed") {
      uiStatus = "scheduled";
    } else if (r.status === "completed") {
      uiStatus = "completed";
    } else if (r.status === "cancelled") {
      uiStatus = "cancelled";
    } else {
      uiStatus = r.status as AppointmentWithDetails["status"];
    }

    return {
      id: r.id,
      customerName: r.customerName,
      petName: r.petName,
      breed: r.breed,
      groomer: r.groomerName,
      time: timeStr,
      date: dateLabel,
      status: uiStatus,
      price: r.totalPrice,
      location,
      confirmationNumber: r.confirmationNumber,
    };
  });
}

/**
 * Get appointments for today
 */
export async function getTodayAppointments(): Promise<AppointmentWithDetails[]> {
  const all = await getAllAppointments();
  return all.filter((a) => a.date === "Today");
}

/**
 * Get groomer statistics
 */
export async function getGroomerStats(): Promise<GroomerStats[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayStart = today.toISOString();
  const todayEnd = tomorrow.toISOString();

  // Get all groomers first
  const allGroomers = await db.select().from(groomers);

  // Get appointment counts for today
  const appointmentCounts = await db
    .select({
      groomerId: appointments.groomer_id,
      appointmentCount: sql<number>`count(${appointments.id})`.as("count"),
    })
    .from(appointments)
    .where(and(gte(appointments.start_time, todayStart), lte(appointments.start_time, todayEnd)))
    .groupBy(appointments.groomer_id);

  const countMap = new Map(
    appointmentCounts.map((a) => [a.groomerId, Number(a.appointmentCount || 0)])
  );

  // Calculate utilization (assuming 8 hours work day, 1 hour per appointment)
  const maxAppointmentsPerDay = 8;

  return allGroomers.map((g) => ({
    name: g.name,
    appointments: countMap.get(g.id) || 0,
    utilization: Math.min(100, Math.round(((countMap.get(g.id) || 0) / maxAppointmentsPerDay) * 100)),
  }));
}

/**
 * Get weekly revenue data
 */
export async function getWeeklyRevenue(): Promise<WeeklyRevenue[]> {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Get start of week (Monday)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
  startOfWeek.setHours(0, 0, 0, 0);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyData: WeeklyRevenue[] = [];

  for (let i = 0; i < 7; i++) {
    const dayStart = new Date(startOfWeek);
    dayStart.setDate(startOfWeek.getDate() + i);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayStart.getDate() + 1);

    const dayStartISO = dayStart.toISOString();
    const dayEndISO = dayEnd.toISOString();

    const result = await db
      .select({
        totalRevenue: sql<number>`coalesce(sum(${pricing_estimates.total_price}), 0)`.as("total"),
      })
      .from(appointments)
      .innerJoin(pricing_estimates, eq(appointments.estimate_id, pricing_estimates.id))
      .where(
        and(
          gte(appointments.start_time, dayStartISO),
          lte(appointments.start_time, dayEndISO),
          eq(appointments.status, "completed")
        )
      );

    weeklyData.push({
      day: days[i],
      revenue: Number(result[0]?.totalRevenue || 0),
    });
  }

  return weeklyData;
}

/**
 * Get market statistics (by location)
 */
export async function getMarketStats(): Promise<MarketStats[]> {
  const results = await db
    .select({
      address: customers.address,
      totalPrice: pricing_estimates.total_price,
    })
    .from(appointments)
    .innerJoin(customers, eq(appointments.customer_id, customers.id))
    .innerJoin(pricing_estimates, eq(appointments.estimate_id, pricing_estimates.id))
    .where(eq(appointments.status, "completed"));

  // Group by location (extract city from address)
  const marketMap = new Map<string, { bookings: number; revenue: number }>();

  results.forEach((r) => {
    const addressParts = r.address.split(",");
    const location = addressParts.length > 1 ? addressParts[addressParts.length - 1].trim() : "Unknown";
    
    const existing = marketMap.get(location) || { bookings: 0, revenue: 0 };
    marketMap.set(location, {
      bookings: existing.bookings + 1,
      revenue: existing.revenue + Number(r.totalPrice) / 100, // Convert cents to dollars
    });
  });

  return Array.from(marketMap.entries())
    .map(([area, stats]) => ({
      area,
      bookings: stats.bookings,
      revenue: Math.round(stats.revenue),
    }))
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 5); // Top 5 markets
}

/**
 * Get customer metrics
 */
export async function getCustomerMetrics(): Promise<CustomerMetrics> {
  const totalCustomers = await db.select({ count: sql<number>`count(*)` }).from(customers);
  const customerCount = Number(totalCustomers[0]?.count || 0);

  // Calculate repeat rate (customers with more than 1 appointment)
  const repeatCustomers = await db
    .select({
      customerId: appointments.customer_id,
      count: sql<number>`count(*)`.as("appt_count"),
    })
    .from(appointments)
    .groupBy(appointments.customer_id)
    .having(sql`count(*) > 1`);

  const repeatRate = customerCount > 0 ? ((repeatCustomers.length / customerCount) * 100).toFixed(0) : "0";

  // Calculate average lifetime value (average total spent per customer)
  const customerRevenue = await db
    .select({
      customerId: appointments.customer_id,
      totalSpent: sql<number>`sum(${pricing_estimates.total_price})`.as("total"),
    })
    .from(appointments)
    .innerJoin(pricing_estimates, eq(appointments.estimate_id, pricing_estimates.id))
    .where(eq(appointments.status, "completed"))
    .groupBy(appointments.customer_id);

  const avgLifetimeValue =
    customerRevenue.length > 0
      ? customerRevenue.reduce((sum, c) => sum + Number(c.totalSpent || 0), 0) / customerRevenue.length / 100
      : 0;

  // Churn rate (simplified: customers with no appointments in last 30 days / total customers)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thirtyDaysAgoISO = thirtyDaysAgo.toISOString();

  const recentCustomers = await db
    .selectDistinct({ customerId: appointments.customer_id })
    .from(appointments)
    .where(gte(appointments.start_time, thirtyDaysAgoISO));

  const churnRate =
    customerCount > 0 ? (((customerCount - recentCustomers.length) / customerCount) * 100).toFixed(0) : "0";

  return {
    totalCustomers: customerCount,
    repeatRate: `${repeatRate}%`,
    avgLifetimeValue: `$${Math.round(avgLifetimeValue)}`,
    churnRate: `${churnRate}%`,
  };
}
