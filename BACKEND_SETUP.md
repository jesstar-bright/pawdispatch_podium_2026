# Backend Setup Guide

## Installation

First, install the required dependencies:

```bash
npm install drizzle-orm better-sqlite3
npm install -D drizzle-kit @types/better-sqlite3
```

## Database Initialization

The database will be automatically initialized when the server starts. The database file will be created at `data/pawdispatch.db`.

To seed the database with initial groomer data, you can:

1. **Via API endpoint** (recommended for development):
   ```bash
   curl -X POST http://localhost:3000/api/seed
   ```

2. **Via script**:
   ```bash
   npm run db:seed
   ```

## API Endpoints

All endpoints are located in `src/app/api/`:

### Pricing
- `POST /api/pricing/estimate` - Create pricing estimate (updated to save to DB)
- `GET /api/pricing/estimate/[estimateId]` - Retrieve estimate by ID

### Appointments
- `POST /api/appointments/propose` - Get available time slots
- `POST /api/appointments/confirm` - Confirm appointment booking
- `GET /api/appointments/[appointmentId]` - Retrieve appointment details

### Development
- `POST /api/seed` - Seed database (dev only)

## Database Schema

The database includes 5 tables:
- `customers` - Customer information
- `pets` - Pet information linked to customers
- `pricing_estimates` - AI-generated pricing estimates
- `groomers` - Available groomers
- `appointments` - Confirmed appointments

All tables are created automatically on first server start.

## Key Features

1. **Race Condition Protection**: The `/api/appointments/confirm` endpoint uses database transactions to prevent double-booking
2. **Automatic Customer Matching**: Customers are matched by email (creates new if not found)
3. **Confirmation Numbers**: Unique confirmation numbers in format `PD-YYYY-XXXXXX`
4. **Time Slot Generation**: Dynamic generation of 9 AM - 5 PM MST slots
5. **Data Persistence**: All data is saved to SQLite database

## Testing

You can test the endpoints using curl or Postman:

```bash
# Seed database
curl -X POST http://localhost:3000/api/seed

# Create pricing estimate (requires image file)
curl -X POST http://localhost:3000/api/pricing/estimate \
  -F "image=@dog.jpg" \
  -F "petName=Buddy" \
  -F "breed=Golden Retriever"

# Propose appointments
curl -X POST http://localhost:3000/api/appointments/propose \
  -H "Content-Type: application/json" \
  -d '{
    "estimateId": "your-estimate-id",
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "555-1234",
    "address": "123 Main St",
    "preferredDate": "2026-03-15"
  }'
```

## Notes

- The database file is stored in `data/pawdispatch.db` (gitignored)
- All timestamps are stored as ISO strings
- Foreign keys are enforced
- Indexes are created for performance on frequently queried columns
