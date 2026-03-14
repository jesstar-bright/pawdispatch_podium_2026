# Manual API Testing - Quick Reference

## Prerequisites
```bash
# 1. Install dependencies
npm install drizzle-orm better-sqlite3 drizzle-kit @types/better-sqlite3

# 2. Start server
npm run dev
```

## Quick Test Sequence

### 1. Seed Database
```bash
curl -X POST http://localhost:3000/api/seed
```
**Expected**: `{"success":true,"message":"Database seeded successfully"}`

---

### 2. Create Pricing Estimate
**Note**: Requires Python agent OR test image

```bash
# Option A: With Python agent (port 8000)
curl -X POST http://localhost:3000/api/pricing/estimate \
  -F "image=@dog.jpg" \
  -F "petName=Buddy" \
  -F "breed=Golden Retriever" \
  -F "weight=65"

# Save the estimateId from response!
```

**Expected Response**:
```json
{
  "estimateId": "uuid-here",
  "basePrice": 7500,
  "totalPrice": 7500,
  "sizeCategory": "large",
  ...
}
```

---

### 3. Get Estimate
```bash
# Replace ESTIMATE_ID with actual ID from step 2
curl http://localhost:3000/api/pricing/estimate/ESTIMATE_ID
```

---

### 4. Propose Appointments
```bash
curl -X POST http://localhost:3000/api/appointments/propose \
  -H "Content-Type: application/json" \
  -d '{
    "estimateId": "ESTIMATE_ID",
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "555-1234",
    "address": "123 Main St",
    "preferredDate": "2026-03-15"
  }'
```

**Save the slotId from response!**

---

### 5. Confirm Appointment
```bash
curl -X POST http://localhost:3000/api/appointments/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "slotId": "SLOT_ID",
    "estimateId": "ESTIMATE_ID",
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "555-1234",
    "address": "123 Main St",
    "petName": "Buddy"
  }'
```

**Save the appointmentId and confirmationNumber!**

---

### 6. Get Appointment
```bash
curl http://localhost:3000/api/appointments/APPOINTMENT_ID
```

---

## Verify Data in Database

```bash
# Install sqlite3 if needed
brew install sqlite3  # macOS
# or
sudo apt-get install sqlite3  # Linux

# View all data
sqlite3 data/pawdispatch.db "SELECT * FROM customers;"
sqlite3 data/pawdispatch.db "SELECT * FROM pets;"
sqlite3 data/pawdispatch.db "SELECT * FROM pricing_estimates;"
sqlite3 data/pawdispatch.db "SELECT * FROM appointments;"
sqlite3 data/pawdispatch.db "SELECT * FROM groomers;"
```

---

## Test Error Cases

### Invalid Email
```bash
curl -X POST http://localhost:3000/api/appointments/propose \
  -H "Content-Type: application/json" \
  -d '{"estimateId":"...","customerEmail":"invalid-email",...}'
```
**Expected**: 400 Bad Request

### Past Date
```bash
curl -X POST http://localhost:3000/api/appointments/propose \
  -H "Content-Type: application/json" \
  -d '{"estimateId":"...","preferredDate":"2020-01-01",...}'
```
**Expected**: 400 Bad Request

### Invalid Estimate ID
```bash
curl http://localhost:3000/api/pricing/estimate/invalid-id
```
**Expected**: 404 Not Found

### Double Booking (Race Condition)
```bash
# Run this twice quickly with same slotId
curl -X POST http://localhost:3000/api/appointments/confirm \
  -H "Content-Type: application/json" \
  -d '{"slotId":"SAME_SLOT_ID",...}'
```
**Expected**: First succeeds (200), second fails (409 Conflict)

---

## Using jq for Pretty Output

Install jq: `brew install jq` (macOS) or `sudo apt-get install jq` (Linux)

Then pipe responses:
```bash
curl ... | jq '.'
```

Example:
```bash
curl http://localhost:3000/api/pricing/estimate/ESTIMATE_ID | jq '.'
```
