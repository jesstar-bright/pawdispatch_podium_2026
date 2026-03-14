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
      <h1 className="text-3xl font-bold text-zinc-900">Get a Price Estimate</h1>
      <p className="mt-2 text-zinc-600">
        Upload a photo of your dog and we&apos;ll use AI to give you an instant price estimate.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <div>
          <h2 className="mb-3 text-lg font-semibold text-zinc-800">Photo</h2>
          <PhotoUpload onFileSelect={setFile} />
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold text-zinc-800">Pet Details</h2>
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
          <h2 className="mb-3 text-lg font-semibold text-zinc-800">Service</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border-2 border-paw-blue bg-blue-50 p-3 text-center text-sm font-medium text-paw-blue">
              Grooming
            </div>
            <div className="rounded-lg border border-zinc-200 p-3 text-center text-sm text-zinc-400">
              Walking <span className="block text-xs">Coming Soon</span>
            </div>
            <div className="rounded-lg border border-zinc-200 p-3 text-center text-sm text-zinc-400">
              Boarding <span className="block text-xs">Coming Soon</span>
            </div>
            <div className="rounded-lg border border-zinc-200 p-3 text-center text-sm text-zinc-400">
              Daycare <span className="block text-xs">Coming Soon</span>
            </div>
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={!file || !petName || loading}
          className="w-full rounded-full bg-paw-blue py-3 text-lg font-semibold text-white transition-colors hover:bg-paw-blue-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Analyzing with AI..." : "Get Price Estimate"}
        </button>
      </form>
    </div>
  );
}
