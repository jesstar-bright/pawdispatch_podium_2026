"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PhotoUpload from "@/components/PhotoUpload";
import PetDetailsForm from "@/components/PetDetailsForm";
import { submitPricingEstimate } from "@/lib/api";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [petName, setPetName] = useState("");
  const [breed, setBreed] = useState("");
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !petName) return;
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("petName", petName);
      formData.append("serviceType", "grooming");
      if (breed) formData.append("breed", breed);
      if (weight) formData.append("weight", weight);
      const estimate = await submitPricingEstimate(formData);
      sessionStorage.setItem(`estimate-${estimate.estimateId}`, JSON.stringify(estimate));
      router.push(`/pricing/${estimate.estimateId}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold" style={{ color: "#f1f5f9" }}>Get a Price Estimate</h1>
      <p className="mt-2" style={{ color: "#94a3b8" }}>
        Upload a photo of your dog and we&apos;ll use AI to give you an instant price estimate.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider" style={{ color: "rgba(148,163,184,0.6)" }}>
            Photo
          </h2>
          <PhotoUpload onFileSelect={setFile} />
        </div>

        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider" style={{ color: "rgba(148,163,184,0.6)" }}>
            Pet Details
          </h2>
          <PetDetailsForm
            petName={petName}
            breed={breed}
            weight={weight}
            onPetNameChange={setPetName}
            onBreedChange={setBreed}
            onWeightChange={setWeight}
          />
        </div>

        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider" style={{ color: "rgba(148,163,184,0.6)" }}>
            Service
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div
              className="rounded-lg p-3 text-center text-sm font-medium"
              style={{ border: "2px solid #2563eb", background: "rgba(37,99,235,0.15)", color: "#38bdf8" }}
            >
              Grooming
            </div>
            {["Walking", "Boarding", "Daycare"].map((svc) => (
              <div
                key={svc}
                className="rounded-lg p-3 text-center text-sm"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#64748b" }}
              >
                {svc}
                <span className="block text-xs mt-0.5">Coming Soon</span>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <p
            className="rounded-lg p-3 text-sm"
            style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", color: "#fca5a5" }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!file || !petName || loading}
          className="w-full btn-cta py-3.5 text-lg"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              {/* Spinner */}
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3V4a10 10 0 100 10h-2a8 8 0 01-8-8z" />
              </svg>
              Analyzing with AI...
            </span>
          ) : (
            "Get Price Estimate"
          )}
        </button>
      </form>
    </div>
  );
}
