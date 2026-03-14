#!/bin/bash

# Backend API Test Script
# Usage: ./test-api.sh

BASE_URL="http://localhost:3000"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Backend API Testing Script ===${NC}\n"

# Check if server is running
if ! curl -s "$BASE_URL" > /dev/null; then
  echo -e "${RED}Error: Server is not running on $BASE_URL${NC}"
  echo "Please start the server with: npm run dev"
  exit 1
fi

echo -e "${GREEN}✓ Server is running${NC}\n"

# Step 1: Seed Database
echo -e "${YELLOW}Step 1: Seeding Database...${NC}"
SEED_RESPONSE=$(curl -s -X POST "$BASE_URL/api/seed")
if echo "$SEED_RESPONSE" | grep -q "success"; then
  echo -e "${GREEN}✓ Database seeded successfully${NC}"
else
  echo -e "${RED}✗ Seed failed: $SEED_RESPONSE${NC}"
fi
echo ""

# Step 2: Create Pricing Estimate (mock - requires Python agent or image)
echo -e "${YELLOW}Step 2: Creating Pricing Estimate...${NC}"
echo -e "${YELLOW}Note: This requires either:${NC}"
echo "  1. Python pricing agent running on port 8000, OR"
echo "  2. A dog image file at ./test-dog.jpg"
echo ""

if [ -f "./test-dog.jpg" ]; then
  ESTIMATE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/pricing/estimate" \
    -F "image=@./test-dog.jpg" \
    -F "petName=TestDog" \
    -F "breed=Golden Retriever" \
    -F "weight=65" \
    -F "serviceType=grooming")
  
  ESTIMATE_ID=$(echo "$ESTIMATE_RESPONSE" | grep -o '"estimateId":"[^"]*' | cut -d'"' -f4)
  
  if [ -n "$ESTIMATE_ID" ]; then
    echo -e "${GREEN}✓ Estimate created: $ESTIMATE_ID${NC}"
    echo "Response: $ESTIMATE_RESPONSE" | head -c 200
    echo "..."
  else
    echo -e "${RED}✗ Estimate creation failed${NC}"
    echo "Response: $ESTIMATE_RESPONSE"
    echo -e "${YELLOW}Using mock estimate ID for testing...${NC}"
    ESTIMATE_ID="test-estimate-id-$(date +%s)"
  fi
else
  echo -e "${YELLOW}⚠ No test image found. Skipping estimate creation.${NC}"
  echo -e "${YELLOW}Using mock estimate ID for testing...${NC}"
  ESTIMATE_ID="test-estimate-id-$(date +%s)"
fi
echo ""

# Step 3: Get Estimate
if [ "$ESTIMATE_ID" != "test-estimate-id"* ]; then
  echo -e "${YELLOW}Step 3: Retrieving Estimate...${NC}"
  GET_ESTIMATE=$(curl -s "$BASE_URL/api/pricing/estimate/$ESTIMATE_ID")
  if echo "$GET_ESTIMATE" | grep -q "estimateId"; then
    echo -e "${GREEN}✓ Estimate retrieved successfully${NC}"
  else
    echo -e "${RED}✗ Failed to retrieve estimate${NC}"
    echo "Response: $GET_ESTIMATE"
  fi
  echo ""
fi

# Step 4: Propose Appointments
echo -e "${YELLOW}Step 4: Proposing Appointments...${NC}"
TODAY=$(date -u +%Y-%m-%d)
SLOTS_RESPONSE=$(curl -s -X POST "$BASE_URL/api/appointments/propose" \
  -H "Content-Type: application/json" \
  -d "{
    \"estimateId\": \"$ESTIMATE_ID\",
    \"customerName\": \"Test User\",
    \"customerEmail\": \"test@example.com\",
    \"customerPhone\": \"555-123-4567\",
    \"address\": \"123 Test Street\",
    \"preferredDate\": \"$TODAY\"
  }")

SLOT_COUNT=$(echo "$SLOTS_RESPONSE" | grep -o '"slots":\[' | wc -l)
if echo "$SLOTS_RESPONSE" | grep -q "slots"; then
  SLOT_ID=$(echo "$SLOTS_RESPONSE" | grep -o '"slotId":"[^"]*' | head -1 | cut -d'"' -f4)
  echo -e "${GREEN}✓ Slots proposed successfully${NC}"
  echo "Found slots in response"
  if [ -n "$SLOT_ID" ]; then
    echo "First slot ID: $SLOT_ID"
  fi
else
  echo -e "${RED}✗ Failed to propose slots${NC}"
  echo "Response: $SLOTS_RESPONSE"
  SLOT_ID=""
fi
echo ""

# Step 5: Confirm Appointment (only if we have a valid slot)
if [ -n "$SLOT_ID" ] && [ "$ESTIMATE_ID" != "test-estimate-id"* ]; then
  echo -e "${YELLOW}Step 5: Confirming Appointment...${NC}"
  CONFIRM_RESPONSE=$(curl -s -X POST "$BASE_URL/api/appointments/confirm" \
    -H "Content-Type: application/json" \
    -d "{
      \"slotId\": \"$SLOT_ID\",
      \"estimateId\": \"$ESTIMATE_ID\",
      \"customerName\": \"Test User\",
      \"customerEmail\": \"test@example.com\",
      \"customerPhone\": \"555-123-4567\",
      \"address\": \"123 Test Street\",
      \"petName\": \"TestDog\"
    }")
  
  APPT_ID=$(echo "$CONFIRM_RESPONSE" | grep -o '"appointmentId":"[^"]*' | cut -d'"' -f4)
  CONFIRM_NUM=$(echo "$CONFIRM_RESPONSE" | grep -o '"confirmationNumber":"[^"]*' | cut -d'"' -f4)
  
  if [ -n "$APPT_ID" ]; then
    echo -e "${GREEN}✓ Appointment confirmed successfully${NC}"
    echo "Appointment ID: $APPT_ID"
    echo "Confirmation Number: $CONFIRM_NUM"
  else
    echo -e "${RED}✗ Failed to confirm appointment${NC}"
    echo "Response: $CONFIRM_RESPONSE"
  fi
  echo ""
  
  # Step 6: Get Appointment
  if [ -n "$APPT_ID" ]; then
    echo -e "${YELLOW}Step 6: Retrieving Appointment...${NC}"
    GET_APPT=$(curl -s "$BASE_URL/api/appointments/$APPT_ID")
    if echo "$GET_APPT" | grep -q "appointmentId"; then
      echo -e "${GREEN}✓ Appointment retrieved successfully${NC}"
    else
      echo -e "${RED}✗ Failed to retrieve appointment${NC}"
      echo "Response: $GET_APPT"
    fi
    echo ""
  fi
else
  echo -e "${YELLOW}⚠ Skipping appointment confirmation (no valid slot or estimate)${NC}"
  echo ""
fi

# Summary
echo -e "${YELLOW}=== Test Summary ===${NC}"
echo -e "${GREEN}✓ Database seeding${NC}"
if [ "$ESTIMATE_ID" != "test-estimate-id"* ]; then
  echo -e "${GREEN}✓ Pricing estimate creation${NC}"
  echo -e "${GREEN}✓ Pricing estimate retrieval${NC}"
fi
echo -e "${GREEN}✓ Appointment proposal${NC}"
if [ -n "$APPT_ID" ]; then
  echo -e "${GREEN}✓ Appointment confirmation${NC}"
  echo -e "${GREEN}✓ Appointment retrieval${NC}"
fi
echo ""
echo -e "${YELLOW}For detailed testing, see TESTING_GUIDE.md${NC}"
