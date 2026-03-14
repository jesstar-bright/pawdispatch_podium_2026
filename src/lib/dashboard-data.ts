export interface AgentActivity {
  id: string;
  agent: "SDR" | "Pricing" | "Scheduling" | "Retention" | "Marketing" | "Analytics";
  action: string;
  timestamp: string;
  color: string;
}

export interface KPICard {
  label: string;
  value: string;
  change: string;
  changeType: "up" | "down" | "neutral";
}

export const KPIS: KPICard[] = [
  { label: "New Leads Today", value: "24", change: "+18%", changeType: "up" },
  { label: "Revenue Today", value: "$3,240", change: "+12%", changeType: "up" },
  { label: "Appointments", value: "18", change: "+6", changeType: "up" },
  { label: "Satisfaction", value: "98%", change: "+2%", changeType: "up" },
];

export const AGENT_ACTIVITIES: AgentActivity[] = [
  { id: "1", agent: "SDR", action: "Captured new lead: Sarah M. — Goldendoodle, South Jordan", timestamp: "2 min ago", color: "#38bdf8" },
  { id: "2", agent: "Pricing", action: "AI estimate: $75 for Luna (Lab mix, 55 lbs, medium coat)", timestamp: "5 min ago", color: "#818cf8" },
  { id: "3", agent: "Scheduling", action: "Confirmed appointment: Mike T. — Tomorrow 10 AM with Alex Rivera", timestamp: "8 min ago", color: "#a78bfa" },
  { id: "4", agent: "Retention", action: "Survey received: ⭐⭐⭐⭐⭐ from Jessica K. — 'Amazing service!'", timestamp: "12 min ago", color: "#34d399" },
  { id: "5", agent: "Marketing", action: "Updated SEO metadata for 'mobile grooming Draper UT' — ranked #3 → #1", timestamp: "15 min ago", color: "#f59e0b" },
  { id: "6", agent: "SDR", action: "Follow-up sent to unbooked lead: Tom R. — Bernedoodle, Lehi", timestamp: "18 min ago", color: "#38bdf8" },
  { id: "7", agent: "Analytics", action: "Weekly report: Revenue up 12%, 24 new customers, Draper is top market", timestamp: "22 min ago", color: "#f472b6" },
  { id: "8", agent: "Pricing", action: "AI estimate: $95 for Bear (Great Dane, 110 lbs, short coat)", timestamp: "25 min ago", color: "#818cf8" },
  { id: "9", agent: "Marketing", action: "Generated testimonial snippet from 5-star review for homepage", timestamp: "30 min ago", color: "#f59e0b" },
  { id: "10", agent: "Scheduling", action: "Reassigned 2 PM slot: Casey Martinez → Jordan Lee (schedule conflict)", timestamp: "35 min ago", color: "#a78bfa" },
];

export interface Lead {
  id: string;
  name: string;
  pet: string;
  breed: string;
  location: string;
  status: "new" | "contacted" | "qualified" | "booked" | "lost";
  source: string;
  createdAt: string;
}

export const LEADS: Lead[] = [
  { id: "L001", name: "Sarah Mitchell", pet: "Cooper", breed: "Goldendoodle", location: "South Jordan", status: "new", source: "Website", createdAt: "2 min ago" },
  { id: "L002", name: "Tom Robinson", pet: "Baxter", breed: "Bernedoodle", location: "Lehi", status: "contacted", source: "Nextdoor", createdAt: "1 hr ago" },
  { id: "L003", name: "Emily Chen", pet: "Mochi", breed: "French Bulldog", location: "Sugar House", status: "qualified", source: "Google", createdAt: "2 hrs ago" },
  { id: "L004", name: "David Larsen", pet: "Duke", breed: "Golden Retriever", location: "Draper", status: "booked", source: "Referral", createdAt: "3 hrs ago" },
  { id: "L005", name: "Maria Garcia", pet: "Bella", breed: "Shih Tzu", location: "Eagle Mountain", status: "booked", source: "Facebook", createdAt: "4 hrs ago" },
  { id: "L006", name: "Ryan Patel", pet: "Zeus", breed: "German Shepherd", location: "Highland", status: "new", source: "Website", createdAt: "5 hrs ago" },
  { id: "L007", name: "Amanda Foster", pet: "Daisy", breed: "Corgi", location: "Millcreek", status: "lost", source: "Instagram", createdAt: "1 day ago" },
  { id: "L008", name: "Jake Thompson", pet: "Rocky", breed: "Labrador", location: "Saratoga Springs", status: "qualified", source: "Google", createdAt: "1 day ago" },
];

export interface Appointment {
  id: string;
  customerName: string;
  petName: string;
  breed: string;
  service: string;
  groomer: string;
  time: string;
  date: string;
  status: "scheduled" | "in_transit" | "grooming" | "completed" | "cancelled";
  price: number;
  location: string;
}

export const APPOINTMENTS: Appointment[] = [
  { id: "A001", customerName: "Jessica Kim", petName: "Luna", breed: "Lab Mix", service: "Full Groom", groomer: "Alex Rivera", time: "9:00 AM", date: "Today", status: "completed", price: 7500, location: "Draper" },
  { id: "A002", customerName: "Mike Torres", petName: "Buddy", breed: "Golden Retriever", service: "Full Groom", groomer: "Jordan Lee", time: "10:30 AM", date: "Today", status: "completed", price: 9000, location: "South Jordan" },
  { id: "A003", customerName: "Sarah Mitchell", petName: "Cooper", breed: "Goldendoodle", service: "Full Groom", groomer: "Alex Rivera", time: "1:00 PM", date: "Today", status: "grooming", price: 8500, location: "South Jordan" },
  { id: "A004", customerName: "David Larsen", petName: "Duke", breed: "Golden Retriever", service: "Full Groom", groomer: "Casey Martinez", time: "2:30 PM", date: "Today", status: "in_transit", price: 7500, location: "Draper" },
  { id: "A005", customerName: "Emily Chen", petName: "Mochi", breed: "French Bulldog", service: "Bath & Trim", groomer: "Jordan Lee", time: "3:30 PM", date: "Today", status: "scheduled", price: 4500, location: "Sugar House" },
  { id: "A006", customerName: "Maria Garcia", petName: "Bella", breed: "Shih Tzu", service: "Full Groom", groomer: "Alex Rivera", time: "9:00 AM", date: "Tomorrow", status: "scheduled", price: 5500, location: "Eagle Mountain" },
  { id: "A007", customerName: "Ryan Patel", petName: "Zeus", breed: "German Shepherd", service: "Full Groom", groomer: "Casey Martinez", time: "11:00 AM", date: "Tomorrow", status: "scheduled", price: 8500, location: "Highland" },
  { id: "A008", customerName: "Jake Thompson", petName: "Rocky", breed: "Labrador", service: "Bath & Trim", groomer: "Jordan Lee", time: "1:00 PM", date: "Tomorrow", status: "scheduled", price: 5500, location: "Saratoga Springs" },
];

export const REVENUE_DATA = {
  weekly: [
    { day: "Mon", revenue: 2800 },
    { day: "Tue", revenue: 3200 },
    { day: "Wed", revenue: 2950 },
    { day: "Thu", revenue: 3600 },
    { day: "Fri", revenue: 4100 },
    { day: "Sat", revenue: 5200 },
    { day: "Sun", revenue: 1800 },
  ],
  topMarkets: [
    { area: "Draper", bookings: 42, revenue: 3150 },
    { area: "South Jordan", bookings: 38, revenue: 2850 },
    { area: "Lehi", bookings: 31, revenue: 2325 },
    { area: "Eagle Mountain", bookings: 24, revenue: 1800 },
    { area: "Sugar House", bookings: 22, revenue: 1650 },
  ],
  groomerUtilization: [
    { name: "Alex Rivera", appointments: 6, utilization: 85 },
    { name: "Jordan Lee", appointments: 5, utilization: 71 },
    { name: "Casey Martinez", appointments: 5, utilization: 71 },
  ],
  customerMetrics: {
    totalCustomers: 187,
    repeatRate: "34%",
    avgLifetimeValue: "$420",
    churnRate: "8%",
  },
};

export const MARKETING_DATA = {
  seoPerformance: [
    { keyword: "mobile dog grooming SLC", rank: 2, change: "+3", traffic: 340 },
    { keyword: "mobile grooming Draper UT", rank: 1, change: "+5", traffic: 180 },
    { keyword: "at-home dog grooming Utah", rank: 4, change: "+2", traffic: 220 },
    { keyword: "mobile pet grooming near me", rank: 8, change: "+1", traffic: 890 },
    { keyword: "dog grooming South Jordan", rank: 3, change: "new", traffic: 150 },
  ],
  recentActions: [
    { action: "Updated homepage meta description for 'mobile grooming SLC'", result: "CTR +12%", time: "15 min ago" },
    { action: "Generated FAQ: 'How does mobile grooming work?'", result: "Published", time: "1 hr ago" },
    { action: "Extracted testimonial from Sarah M. (5-star review)", result: "Pending approval", time: "2 hrs ago" },
    { action: "A/B test: 'Book Now' vs 'Get Started' CTA", result: "Book Now +8%", time: "3 hrs ago" },
    { action: "Updated SEO for 'dog grooming Draper UT'", result: "Rank #3 → #1", time: "4 hrs ago" },
    { action: "Seasonal campaign proposed: 'Spring Shed Season'", result: "Pending review", time: "5 hrs ago" },
  ],
  campaignIdeas: [
    { name: "Spring Shed Season", segment: "Busy Families", channel: "Email + Social", status: "Proposed" },
    { name: "First Groom Free Referral", segment: "All", channel: "Word of mouth", status: "Active" },
    { name: "Anxious Dog Awareness", segment: "Senior Pet Parents", channel: "Blog + SEO", status: "Draft" },
  ],
  websiteMetrics: {
    visitorsToday: 482,
    conversionRate: "4.8%",
    topLandingPage: "/upload (Get Estimate)",
    bounceRate: "32%",
  },
};
