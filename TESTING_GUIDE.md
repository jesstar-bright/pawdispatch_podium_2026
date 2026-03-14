# Backend API Testing Guide

This guide will walk you through testing each API endpoint to ensure everything works correctly.

## Prerequisites

1. **Install dependencies** (if not already done):
   ```bash
   npm install drizzle-orm better-sqlite3
   npm install -D drizzle-kit @types/better-sqlite3
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   The server should start on `http://localhost:3000`

3. **Verify database initialization**:
   - Check that `data/pawdispatch.db` file is created
   - The database tables are auto-created on first server start

---

## Step 1: Seed the Database

First, let's seed the database with groomers.

### Test: Seed Endpoint

```bash
curl -X POST http://localhost:3000/api/seed \
  -H "Content-Type: application/json"
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Database seeded successfully"
}
```

**Verify in Database** (optional):
```bash
# Install sqlite3 CLI if needed: brew install sqlite3
sqlite3 data/pawdispatch.db "SELECT * FROM groomers;"
```

You should see 4 groomers: Alex Rivera, Jordan Lee, Casey Martinez, Sam Taylor

---

## Step 2: Create a Pricing Estimate

### Test: POST /api/pricing/estimate

**Note**: This endpoint currently proxies to the Python pricing agent. For testing, you can either:
- Use the Python agent if it's running
- Or we'll create a mock version for testing

#### Option A: With Python Agent Running

```bash
# Make sure Python agent is running on port 8000
# Then test with a dog image:
curl -X POST http://localhost:3000/api/pricing/estimate \
  -F "image=@/path/to/dog-photo.jpg" \
  -F "petName=Buddy" \
  -F "breed=Golden Retriever" \
  -F "weight=65" \
  -F "serviceType=grooming"
```

#### Option B: Test with Mock Data (if Python agent not available)

We'll need to temporarily modify the route or create a test endpoint. For now, let's assume you have the Python agent running.

**Expected Response** (200 OK):
```json
{
  "estimateId": "550e8400-e29b-41d4-a716-446655440000",
  "basePrice": 7500,
  "adjustments": [
    { "reason": "Long/thick coat", "amount": 1500 },
    { "reason": "Large dog adjustment", "amount": 500 }
  ],
  "totalPrice": 7500,
  "sizeCategory": "large",
  "explanation": "Based on the photo, this appears to be a large breed...",
  "imageUrl": "/uploads/550e8400-e29b-41d4-a716-446655440000.jpg"
}
```

**Save the `estimateId`** - you'll need it for the next steps!

**Verify in Database**:
```bash
sqlite3 data/pawdispatch.db "SELECT id, base_price, total_price, size_category FROM pricing_estimates;"
```

---

## Step 3: Retrieve Pricing Estimate

### Test: GET /api/pricing/estimate/[estimateId]

Replace `YOUR_ESTIMATE_ID` with the estimateId from Step 2:

```bash
curl http://localhost:3000/api/pricing/estimate/YOUR_ESTIMATE_ID
```

**Expected Response** (200 OK):
```json
{
  "estimateId": "550e8400-e29b-41d4-a716-446655440000",
  "basePrice": 7500,
  "adjustments": [...],
  "totalPrice": 7500,
  "sizeCategory": "large",
  "explanation": "...",
  "imageUrl": "/uploads/..."
}
```

**Test Error Case** (404):
```bash
curl http://localhost:3000/api/pricing/estimate/invalid-id-123
```

**Expected Response** (404):
```json
{
  "error": "Not found",
  "message": "Estimate not found"
}
```

---

## Step 4: Propose Appointment Slots

### Test: POST /api/appointments/propose

Replace `YOUR_ESTIMATE_ID` with your actual estimateId:

```bash
curl -X POST http://localhost:3000/api/appointments/propose \
  -H "Content-Type: application/json" \
  -d '{
    "estimateId": "YOUR_ESTIMATE_ID",
    "customerName": "John Doe",
    "customerEmail": "john.doe@example.com",
    "customerPhone": "555-123-4567",
    "address": "123 Main Street, Denver, CO 80202",
    "preferredDate": "2026-03-15"
  }'
```

**Expected Response** (200 OK):
```json
{
  "slots": [
    {
      "slotId": "groomer-uuid-2026-03-15T16:00:00.000Z",
      "startTime": "2026-03-15T16:00:00.000Z",
      "endTime": "2026-03-15T17:00:00.000Z",
      "groomer": "Alex Rivera"
    },
    {
      "slotId": "groomer-uuid-2026-03-15T17:00:00.000Z",
      "startTime": "2026-03-15T17:00:00.000Z",
      "endTime": "2026-03-15T18:00:00.000Z",
      "groomer": "Jordan Lee"
    }
    // ... more slots
  ]
}
```

**Save a `slotId`** - you'll need it for the next step!

**Test Validation Errors**:

1. **Invalid email**:
```bash
curl -X POST http://localhost:3000/api/appointments/propose \
  -H "Content-Type: application/json" \
  -d '{
    "estimateId": "YOUR_ESTIMATE_ID",
    "customerName": "John Doe",
    "customerEmail": "invalid-email",
    "customerPhone": "555-1234",
    "address": "123 Main St",
    "preferredDate": "2026-03-15"
  }'
```

2. **Past date**:
```bash
curl -X POST http://localhost:3000/api/appointments/propose \
  -H "Content-Type: application/json" \
  -d '{
    "estimateId": "YOUR_ESTIMATE_ID",
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "555-1234",
    "address": "123 Main St",
    "preferredDate": "2020-01-01"
  }'
```

3. **Invalid estimateId**:
```bash
curl -X POST http://localhost:3000/api/appointments/propose \
  -H "Content-Type: application/json" \
  -d '{
    "estimateId": "invalid-id",
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "555-1234",
    "address": "123 Main St",
    "preferredDate": "2026-03-15"
  }'
```

---

## Step 5: Confirm Appointment

### Test: POST /api/appointments/confirm

Replace `YOUR_ESTIMATE_ID` and `YOUR_SLOT_ID` with actual values:

```bash
curl -X POST http://localhost:3000/api/appointments/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "slotId": "YOUR_SLOT_ID",
    "estimateId": "YOUR_ESTIMATE_ID",
    "customerName": "John Doe",
    "customerEmail": "john.doe@example.com",
    "customerPhone": "555-123-4567",
    "address": "123 Main Street, Denver, CO 80202",
    "petName": "Buddy",
    "notes": "Dog is friendly but nervous around new people"
  }'
```

**Expected Response** (200 OK):
```json
{
  "appointmentId": "appointment-uuid",
  "status": "confirmed",
  "startTime": "2026-03-15T16:00:00.000Z",
  "endTime": "2026-03-15T17:00:00.000Z",
  "groomer": "Alex Rivera",
  "totalPrice": 7500,
  "confirmationNumber": "PD-2026-000001"
}
```

**Save the `appointmentId` and `confirmationNumber`** for the next step!

**Verify in Database**:
```bash
# Check customer was created
sqlite3 data/pawdispatch.db "SELECT * FROM customers;"

# Check pet was created
sqlite3 data/pawdispatch.db "SELECT * FROM pets;"

# Check appointment was created
sqlite3 data/pawdispatch.db "SELECT id, confirmation_number, start_time, groomer_id FROM appointments;"

# Check pricing_estimate was linked to pet
sqlite3 data/pawdispatch.db "SELECT id, pet_id FROM pricing_estimates WHERE id = 'YOUR_ESTIMATE_ID';"
```

**Test Race Condition** (409 Conflict):
Try to book the same slot twice simultaneously:

```bash
# Terminal 1
curl -X POST http://localhost:3000/api/appointments/confirm \
  -H "Content-Type: application/json" \
  -d '{...same slotId...}'

# Terminal 2 (run immediately after)
curl -X POST http://localhost:3000/api/appointments/confirm \
  -H "Content-Type: application/json" \
  -d '{...same slotId...}'
```

One should succeed (200), the other should return 409 Conflict.

---

## Step 6: Retrieve Appointment

### Test: GET /api/appointments/[appointmentId]

Replace `YOUR_APPOINTMENT_ID` with the appointmentId from Step 5:

```bash
curl http://localhost:3000/api/appointments/YOUR_APPOINTMENT_ID
```

**Expected Response** (200 OK):
```json
{
  "appointmentId": "appointment-uuid",
  "status": "confirmed",
  "startTime": "2026-03-15T16:00:00.000Z",
  "endTime": "2026-03-15T17:00:00.000Z",
  "groomer": "Alex Rivera",
  "totalPrice": 7500,
  "confirmationNumber": "PD-2026-000001",
  "customerName": "John Doe",
  "petName": "Buddy",
  "address": "123 Main Street, Denver, CO 80202"
}
```

**Test Error Case** (404):
```bash
curl http://localhost:3000/api/appointments/invalid-id-123
```

---

## Step 7: Test Customer Reuse

### Test: Same Customer, Different Pet

Create a new estimate, then propose and confirm with the same email:

```bash
# 1. Create new estimate (different pet)
# ... (use different image/petName)

# 2. Propose with same email
curl -X POST http://localhost:3000/api/appointments/propose \
  -H "Content-Type: application/json" \
  -d '{
    "estimateId": "NEW_ESTIMATE_ID",
    "customerName": "John Doe",
    "customerEmail": "john.doe@example.com",  # Same email!
    "customerPhone": "555-123-4567",
    "address": "123 Main Street, Denver, CO 80202",
    "preferredDate": "2026-03-16"
  }'

# 3. Confirm appointment
curl -X POST http://localhost:3000/api/appointments/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "slotId": "NEW_SLOT_ID",
    "estimateId": "NEW_ESTIMATE_ID",
    "customerName": "John Doe",
    "customerEmail": "john.doe@example.com",
    "customerPhone": "555-123-4567",
    "address": "123 Main Street, Denver, CO 80202",
    "petName": "Max"  # Different pet!
  }'
```

**Verify**: Check that only ONE customer record exists, but TWO pets:
```bash
sqlite3 data/pawdispatch.db "SELECT COUNT(*) FROM customers WHERE email = 'john.doe@example.com';"
sqlite3 data/pawdispatch.db "SELECT COUNT(*) FROM pets WHERE customer_id IN (SELECT id FROM customers WHERE email = 'john.doe@example.com');"
```

---

## Step 8: Test Slot Availability

### Test: Booked Slots Are Excluded

1. Book an appointment (Step 5)
2. Propose slots for the same date/time
3. Verify the booked slot is NOT in the response

```bash
# After booking a slot, propose again for same date
curl -X POST http://localhost:3000/api/appointments/propose \
  -H "Content-Type: application/json" \
  -d '{
    "estimateId": "ANOTHER_ESTIMATE_ID",
    "customerName": "Jane Smith",
    "customerEmail": "jane@example.com",
    "customerPhone": "555-999-8888",
    "address": "456 Oak Ave",
    "preferredDate": "2026-03-15"  # Same date as booked slot
  }'
```

The previously booked slot should NOT appear in the response.

---

## Quick Test Script

Save this as `test-api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:3000"

echo "=== Step 1: Seed Database ==="
curl -X POST $BASE_URL/api/seed

echo -e "\n\n=== Step 2: Create Pricing Estimate ==="
# Note: Replace with actual image path
ESTIMATE_RESPONSE=$(curl -s -X POST $BASE_URL/api/pricing/estimate \
  -F "image=@dog.jpg" \
  -F "petName=Buddy" \
  -F "breed=Golden Retriever")
echo $ESTIMATE_RESPONSE | jq '.'

ESTIMATE_ID=$(echo $ESTIMATE_RESPONSE | jq -r '.estimateId')
echo "Estimate ID: $ESTIMATE_ID"

echo -e "\n\n=== Step 3: Get Estimate ==="
curl -s $BASE_URL/api/pricing/estimate/$ESTIMATE_ID | jq '.'

echo -e "\n\n=== Step 4: Propose Appointments ==="
SLOTS_RESPONSE=$(curl -s -X POST $BASE_URL/api/appointments/propose \
  -H "Content-Type: application/json" \
  -d "{
    \"estimateId\": \"$ESTIMATE_ID\",
    \"customerName\": \"John Doe\",
    \"customerEmail\": \"john@example.com\",
    \"customerPhone\": \"555-1234\",
    \"address\": \"123 Main St\",
    \"preferredDate\": \"2026-03-15\"
  }")
echo $SLOTS_RESPONSE | jq '.'

SLOT_ID=$(echo $SLOTS_RESPONSE | jq -r '.slots[0].slotId')
echo "Slot ID: $SLOT_ID"

echo -e "\n\n=== Step 5: Confirm Appointment ==="
APPT_RESPONSE=$(curl -s -X POST $BASE_URL/api/appointments/confirm \
  -H "Content-Type: application/json" \
  -d "{
    \"slotId\": \"$SLOT_ID\",
    \"estimateId\": \"$ESTIMATE_ID\",
    \"customerName\": \"John Doe\",
    \"customerEmail\": \"john@example.com\",
    \"customerPhone\": \"555-1234\",
    \"address\": \"123 Main St\",
    \"petName\": \"Buddy\"
  }")
echo $APPT_RESPONSE | jq '.'

APPT_ID=$(echo $APPT_RESPONSE | jq -r '.appointmentId')
echo "Appointment ID: $APPT_ID"

echo -e "\n\n=== Step 6: Get Appointment ==="
curl -s $BASE_URL/api/appointments/$APPT_ID | jq '.'
```

Make it executable and run:
```bash
chmod +x test-api.sh
./test-api.sh
```

---

## Common Issues & Solutions

### Issue: "Database not initialized"
**Solution**: Restart the dev server. The database auto-initializes on first import.

### Issue: "Foreign key constraint failed"
**Solution**: Make sure you're using valid UUIDs and that referenced records exist.

### Issue: "Slot already booked" (409)
**Solution**: This is expected! The slot was already booked. Try a different slot.

### Issue: "Estimate not found" (404)
**Solution**: Make sure the estimateId exists. Check with GET endpoint first.

---

## Database Inspection Commands

```bash
# View all customers
sqlite3 data/pawdispatch.db "SELECT * FROM customers;"

# View all pets
sqlite3 data/pawdispatch.db "SELECT * FROM pets;"

# View all estimates
sqlite3 data/pawdispatch.db "SELECT id, base_price, total_price, size_category FROM pricing_estimates;"

# View all appointments
sqlite3 data/pawdispatch.db "SELECT id, confirmation_number, start_time, status FROM appointments;"

# View all groomers
sqlite3 data/pawdispatch.db "SELECT * FROM groomers;"

# Check relationships
sqlite3 data/pawdispatch.db "
  SELECT 
    a.confirmation_number,
    c.name as customer,
    p.name as pet,
    g.name as groomer,
    a.start_time
  FROM appointments a
  JOIN customers c ON a.customer_id = c.id
  JOIN pets p ON a.pet_id = p.id
  JOIN groomers g ON a.groomer_id = g.id;
"
```

---

## Next Steps

Once all tests pass:
1. ✅ Database persists data correctly
2. ✅ All endpoints return expected responses
3. ✅ Validation works (email, dates, etc.)
4. ✅ Race conditions are prevented
5. ✅ Customer reuse works
6. ✅ Booked slots are excluded

Your backend is ready for the frontend to integrate!
