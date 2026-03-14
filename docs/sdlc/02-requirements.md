## Requirements

This document translates the planning for Paw Dispatch into concrete functional and non‑functional requirements.

### Functional Requirements

#### 1. SDR / Pre‑Sales Agent
- The system MUST allow an SDR to capture new lead information, including:
  - Pet parent contact details (name, email, phone, address, preferred contact method).
  - Pet details (name, species, breed if known, age, weight, temperament flags).
  - Service interests, with **grooming** as the primary in‑scope service for this iteration and other services (one‑time walk, recurring walks, boarding, etc.) captured as future/roadmap options.
- The SDR MUST be able to record notes about the lead’s specific needs and constraints.
- The system MUST create or update a corresponding record in the CRM for every lead captured.
- The SDR MUST be able to see basic pricing estimates (from the pricing engine) while talking to the customer so they can give a ballpark quote.

#### 2. Scheduling & Pricing Agent
- The system MUST accept:
  - Desired appointment date(s) and time windows.
  - Service type and duration.
  - Location (pickup/drop‑off address).
  - Pet constraints (e.g., needs solo walker, reactive to other dogs).
- The system MUST:
  - Check availability for walkers/drivers matching the constraints.
  - Generate one or more feasible appointment options (time + assigned resource).
  - Calculate a price using the pricing engine for each proposed option.
- The system MUST surface appointment options and prices back to:
  - The SDR during pre‑sales.
  - The customer via a booking/confirmation interface.
- Once a customer selects an option, the system MUST:
  - Create a confirmed appointment in the scheduling system.
  - Write the final appointment details and price back to the CRM.

#### 3. Image‑Based Pricing Engine
- The system MUST accept:
  - At least one image of the dog.
  - Basic metadata (approximate weight, breed if known, age, and temperament flags).
- The pricing engine MUST:
  - Classify size/weight band from image and metadata.
  - Use service type and location to compute a base price.
  - Apply adjustments (e.g., large dog, special handling, long distance).
- The pricing engine MUST return:
  - A price estimate.
  - A short explanation of key factors that influenced the price (for transparency to humans).

#### 4. Live Tracking & Confirmation
- For an active appointment, the system MUST:
  - Track the walker/driver’s live location (where supported).
  - Expose a status timeline (scheduled → in transit → with dog → completed).
- Customers MUST be able to:
  - View live status / basic location in a secure link or portal.
  - Receive confirmations and key status updates via email
- Completed appointments MUST:
  - Be marked as completed in the scheduling system.
  - Update the CRM with completion time and any notes.

#### 5. Retention / Customer Success Agent
- After an appointment completes, the system MUST:
  - Trigger a satisfaction survey to the customer.
  - Collect structured responses (ratings, multiple choice) and free‑text feedback.
- Survey results MUST:
  - Be written back to the CRM on the customer/account record.
  - Be tagged with the related appointment and service type.
- Based on satisfaction and behavior rules, the system SHOULD:
  - Offer follow‑up bookings (e.g., “book your next walk”, “set up weekly recurring walks”).
  - Create follow‑up tasks or opportunities in the CRM for the SDR/CS team.

#### 6. Business Analytics / Orchestrator Agents
- A data analytics agent MUST have access (read‑only) to:
  - Revenue data by service type, date range, and region.
  - Customer data (segments, lifetime value proxies).
  - Operations data (utilization, cancellations, on‑time performance).
- The analytics agent MUST be able to produce:
  - Summary metrics dashboards for leadership (e.g., bookings per day, avg revenue per appointment).
  - Cohort views of customer retention and repeat bookings.
- Orchestrator agents:
  - MUST coordinate SDR outreach sequences (e.g., follow‑up on unbooked leads).
  - MUST coordinate retention campaigns (e.g., re‑engage lapsed customers).
  - Must coordinate and push off marketing commands based on metrics 
#### 7. AI Marketing Agent

- The AI marketing agent MUST:
  - Ingest website analytics and SEO signals (page views, search terms, landing pages, conversion events) on a regular cadence, including signals relevant to discovery and advertising via AI assistants (e.g., ChatGPT).
  - Ingest customer survey responses and satisfaction metrics from the Retention / Customer Success agent.
  - Ingest operational data from the Business Analytics / Orchestrator agents (e.g., most profitable customer segments, under‑utilized time windows, repeat booking patterns).
  - Identify high‑value, positive survey responses suitable for public testimonials and social proof.

- The agent MUST be able to define and refine **marketing strategy** for the grooming business by:
  - Segmenting customers (e.g., busy professionals, families with multiple dogs, first‑time groom customers) and mapping value propositions to each segment.
  - Prioritizing target segments and campaigns based on potential revenue, margins, and current utilization of grooming capacity.
  - Recommending a positioning and messaging strategy (e.g., “mobile, stress‑free grooming at your doorstep for busy pet parents”) and keeping this strategy in sync with observed customer feedback and performance data.
  - Identifying seasonal or trend‑based opportunities (e.g., “spring shed”, “holiday grooming”, “back‑to‑school routines”) and proposing time‑boxed campaigns.

- The agent MUST be able to **execute marketing operations** autonomously within guardrails by:
  - Update marketing copy, headlines, and SEO keywords for the website focused on mobile pet grooming and the defined target segments.
  - Generating structured “review” snippets and testimonial blocks from satisfied customer survey responses for use on the website’s review/testimonial section.
  - Update to landing pages (layout emphasis, call‑to‑action wording, grooming package descriptions) to improve conversion for grooming appointments.
  - Optimizing for discovery via search and AI assistants by:
    - Maintaining a prioritized list of key phrases and intents (e.g., “mobile dog grooming near me”, “at‑home grooming for anxious dogs in Utah County”).
    - Proposing FAQ entries and content pieces that directly answer high‑intent queries likely to surface in assistants like ChatGPT.

- The agent MUST:
  - Feed summarized marketing performance metrics and insights back into the Business Analytics / Orchestrator agents (e.g., campaign performance, segment‑level conversion, review volume and sentiment).
  - Run experiments (A/B tests) on messaging or page variants and evaluate outcomes using agreed‑upon metrics (e.g., conversion to booked grooming appointment, email click‑through).
  - Publish website, content, and SEO changes in a human‑readable change log and live.
  - Respect business constraints set by humans (e.g., budget caps for paid placements, geo‑targeting boundaries, brand/style guidelines) and surface alerts when a proposed strategy would exceed those constraints.

### Non‑Functional Requirements

#### Performance, Reliability, and Availability
- The system SHOULD:
  - Return pricing and scheduling options within a few seconds under normal load.
  - Support peak usage during local commute hours without significant degradation.
- Core booking and scheduling workflows MUST be resilient to partial failures:
  - If pricing fails, the system SHOULD surface a graceful “unable to price” state and notify an operator.
  - If CRM updates fail, the system MUST retry and log failures for later reconciliation.

#### Security and Compliance
- All customer and pet data MUST:
  - Be transmitted over encrypted channels (HTTPS/TLS).
  - Be stored in compliance with applicable privacy laws (exact set TBD; likely standard US consumer privacy).
- Access controls MUST:
  - Limit SDRs and operations staff to only the data they need.
  - Protect live tracking links so only authorized customers can view them.

#### Usability and Accessibility
- Internal tools for SDRs and operations SHOULD:
  - Be optimized for fast data entry during live calls.
  - Surface key information (price, availability, notes) without excessive navigation.
- Customer‑facing flows SHOULD:
  - Work well on mobile devices.
  - Follow basic accessibility best practices (contrast, labels, keyboard navigation).

### Constraints

#### Technical Constraints
- The solution SHOULD:
  - Integrate with the existing CRM chosen for the project (exact product TBD).
  - Use the existing Next.js/TypeScript stack of the Paw Dispatch app where feasible.
- Image‑based pricing MAY:
  - Depend on one or more external AI APIs and associated rate limits.

#### Organizational and Regulatory Constraints
- Timebox: this implementation is initially scoped for a hackathon timeframe, so:
  - Additional “nice to have” agents (payment, HR, fleet commander) are explicitly OUT OF SCOPE for this phase.
  - The focus MUST remain on SDR, scheduling/pricing, tracking, and retention flows.
