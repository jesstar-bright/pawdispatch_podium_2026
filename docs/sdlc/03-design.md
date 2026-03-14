## Design

This document outlines the high‑level design for Paw Dispatch based on the planned agents and workflows.

### Architecture

- **Overall style**: A Next.js front‑end with backend APIs (or server actions) that:
  - Orchestrate calls to AI/agent services (SDR assistant, pricing engine, scheduling logic).
  - Integrate with an external CRM and scheduling/notification services.
- **Key components**:
  - **Client Agent Layer**
    - SDR console UI for lead capture.
    - Pricing & scheduling UI to propose and confirm appointments.
    - Customer‑facing booking and tracking views.
  - **Business Agent Layer**
    - Pricing engine (image + metadata–driven).
    - Scheduling/orchestration logic (match availability with constraints).
    - Retention & analytics agents that read from the CRM and operational data.
    - AI marketing agent that learns from website analytics and survey data to recommend SEO and content changes.
  - **Integration Layer**
    - CRM integration module (create/update leads, contacts, opportunities, and activities).
    - Notification module (email/SMS/push abstraction).
    - Data warehouse or analytics store (even if initially just structured tables).

At runtime, a typical flow:
1. SDR captures lead → data is saved in the app and pushed to the CRM.
2. SDR or customer requests appointment → scheduling & pricing agents compute options.
3. Customer confirms an option → appointment stored, notifications sent, CRM updated.
4. After completion → tracking data and survey results written back to CRM and analytics.

### Data Design

- **Core entities (conceptual)**
  - `Customer`
    - Contact info, preferred communication channel.
    - One‑to‑many relationship with `Pet` and `Appointment`.
  - `Pet`
    - Name, species (dog), breed, age, weight band, temperament flags.
    - Links to uploaded images used by the pricing engine.
  - `Lead`
    - Captured by SDR, may convert into a `Customer`.
    - References initial requested service, notes, and preliminary pricing.
  - `Appointment`
    - Date/time window, location, service type, assigned resource (walker/driver).
    - Status (requested, proposed, confirmed, in progress, completed, cancelled).
    - Final price and any discounts applied.
  - `SurveyResponse`
    - Satisfaction rating(s), free‑text feedback.
    - Linked to `Customer` and `Appointment`.
  - `PricingInput` / `PricingResult`
    - Inputs: images, pet metadata, service type, location.
    - Output: price, explanation.

- **Storage considerations**
  - Operational data (customers, pets, appointments, survey responses) stored in the app’s primary database.
  - Images stored via object storage (e.g., cloud bucket) with references in entities.
  - Selected data mirrored into the CRM (or the CRM can be treated as the system of record for some entities).

### Interface Design

#### Internal UIs
- **SDR Console**
  - Fast form for entering lead + pet details.
  - Inline preview of pricing based on uploaded image + service selection.
  - One‑click actions to “create appointment proposal” and “log to CRM”.
- **Ops / Dispatcher View**
  - Calendar/board of upcoming appointments with filters (status, location, resource).
  - Controls to reassign walkers/drivers and update statuses.

#### Customer‑Facing Flows
- **Booking Flow**
  - Upload dog photo, enter basic details, pick desired date/time and service.
  - Show 1–3 appointment options with clear pricing and a simple confirmation step.
- **Tracking + Confirmation Page**
  - Status timeline and map (where available) for live tracking.
  - Summary of appointment details, including pet info and special instructions.

#### APIs and Integrations
- **Internal APIs**
  - `POST /api/pricing/estimate`: accept images + metadata, return price + explanation.
  - `POST /api/appointments/propose`: accept desired slot/service, return appointment options with prices.
  - `POST /api/appointments/confirm`: confirm a chosen option, trigger notifications + CRM updates.
- **External Integrations**
  - CRM connector with:
    - `syncLead`, `syncCustomer`, `syncAppointment`, `syncSurveyResponse`.
  - Notification provider wrapper (e.g., `sendConfirmation`, `sendReminder`, `sendSurveyLink`).
  - Website / CMS integration for:
    - Publishing or updating customer review snippets (subject to human approval this iteration).
    - Updating select marketing copy blocks and SEO metadata based on AI marketing agent recommendations.

### Open Design Questions

- Which specific CRM platform will we integrate with (fields and objects may differ)?
- What notification channel(s) are in scope for this phase (SMS, email, push)?
- How sophisticated should the first version of the pricing engine be:
  - Simple rules‑based on size/weight band and distance?
  - Or a more advanced model‑driven approach from day one?
- Do we treat the CRM or our own database as the primary system of record for customers and appointments?
