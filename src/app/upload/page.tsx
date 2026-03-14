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
          <h2 className="mb-3 text-lg font-semibold" style={{ color: "#e2e8f0" }}>Photo</h2>
          <PhotoUpload onFileSelect={setFile} />
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold" style={{ color: "#e2e8f0" }}>Pet Details</h2>
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
          <h2 className="mb-3 text-lg font-semibold" style={{ color: "#e2e8f0" }}>Service</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div
              className="rounded-lg p-3 text-center text-sm font-medium"
              style={{ border: "2px solid #2563eb", background: "rgba(37,99,235,0.15)", color: "#38bdf8" }}
            >
              Grooming
            </div>
            <div
              className="rounded-lg p-3 text-center text-sm"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#64748b" }}
            >
              Walking <span className="block text-xs">Coming Soon</span>
            </div>
            <div
              className="rounded-lg p-3 text-center text-sm"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#64748b" }}
            >
              Boarding <span className="block text-xs">Coming Soon</span>
            </div>
            <div
              className="rounded-lg p-3 text-center text-sm"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#64748b" }}
            >
              Daycare <span className="block text-xs">Coming Soon</span>
            </div>
          </div>
        </div>

        {error && (
          <p className="rounded-lg p-3 text-sm" style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", color: "#fca5a5" }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={!file || !petName || loading}
          className="w-full rounded-full py-3 text-lg font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", boxShadow: "0 0 24px rgba(37,99,235,0.3)" }}
        >
          {loading ? "Analyzing with AI..." : "Get Price Estimate"}
        </button>
      </form>
    </div>
  );
}
