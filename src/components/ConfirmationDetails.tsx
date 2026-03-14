"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/api";
import type { AppointmentConfirmation } from "@/lib/api";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function CheckCircleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: "#16a34a" }}
      className="mx-auto mb-4"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-muted-foreground"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function DollarSignIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

export default function ConfirmationDetails({
  confirmation,
}: {
  confirmation: AppointmentConfirmation;
}) {
  const [copied, setCopied] = useState(false);

  const copyNumber = () => {
    navigator.clipboard.writeText(confirmation.confirmationNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rows = [
    { icon: <CalendarIcon />, label: "Date", value: formatDate(confirmation.startTime) },
    {
      icon: <ClockIcon />,
      label: "Time",
      value: `${formatTime(confirmation.startTime)} – ${formatTime(confirmation.endTime)}`,
    },
    { icon: <UserIcon />, label: "Groomer", value: confirmation.groomer },
    { icon: <DollarSignIcon />, label: "Total", value: formatPrice(confirmation.totalPrice) },
  ];

  return (
    <div className="glass-card p-8">
      <div className="text-center mb-6">
        <CheckCircleIcon />
        <h1 className="text-2xl font-extrabold text-foreground">Booking Confirmed!</h1>
        <button
          onClick={copyNumber}
          className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg glass-card-inner transition-colors"
          style={{ cursor: "pointer" }}
        >
          <span className="text-lg font-mono font-bold text-paw-cyan">
            {confirmation.confirmationNumber}
          </span>
          <CopyIcon />
          {copied && (
            <span className="text-xs" style={{ color: "#16a34a" }}>
              Copied!
            </span>
          )}
        </button>
      </div>

      <div className="space-y-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1.25rem" }}>
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {row.icon}
              {row.label}
            </div>
            <span className="text-sm font-medium text-foreground">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
