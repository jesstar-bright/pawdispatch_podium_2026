"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { PRICING_ESTIMATE_STORAGE_KEY, setStoredEstimate } from "./types";

const ESTIMATE_ENDPOINT = "/api/pricing/estimate";

export interface PricingAgentUploadFormProps {
  /** Called after a successful estimate; receive estimateId to redirect or update state. */
  onSuccess?: (estimateId: string) => void;
  /** Optional class for the wrapper. */
  className?: string;
  /** Optional title override. */
  title?: string;
  /** Optional description override. */
  description?: string;
}

/**
 * Standalone form for testing the Pricing Agent: dog photo + pet details → POST /api/pricing/estimate.
 * Does not render nav or layout; use in any page or embed in the main app.
 */
export function PricingAgentUploadForm({
  onSuccess,
  className = "",
  title = "Get a price estimate",
  description = "Upload a photo of your dog and add a few details. We'll use AI to give you a fair grooming quote.",
}: PricingAgentUploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [petName, setPetName] = useState("");
  const [breed, setBreed] = useState("");
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = e.target.files?.[0];
    if (!chosen) return;
    if (!chosen.type.startsWith("image/")) {
      setError("Please choose an image file (e.g. JPG, PNG).");
      return;
    }
    setError(null);
    setFile(chosen);
    setPreview(URL.createObjectURL(chosen));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const chosen = e.dataTransfer.files?.[0];
    if (chosen?.type.startsWith("image/")) {
      setError(null);
      setFile(chosen);
      setPreview(URL.createObjectURL(chosen));
    } else {
      setError("Please drop an image file.");
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!file) {
      setError("Please upload a photo of your dog.");
      return;
    }
    const name = petName.trim();
    if (!name) {
      setError("Please enter your pet's name.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("petName", name);
      if (breed.trim()) formData.append("breed", breed.trim());
      if (weight.trim()) formData.append("weight", weight.trim());
      formData.append("serviceType", "grooming");

      const res = await fetch(ESTIMATE_ENDPOINT, { method: "POST", body: formData });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? data.error ?? "Something went wrong.");
      }

      const result = await res.json();
      if (result.estimateId) {
        setStoredEstimate(result);
        onSuccess?.(result.estimateId);
      } else {
        throw new Error("No estimate ID returned.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to get estimate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{title}</h2>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">{description}</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Dog photo <span className="text-red-500">*</span>
          </label>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-100/50 p-6 transition dark:border-zinc-600 dark:bg-zinc-800/50 hover:border-zinc-400 dark:hover:border-zinc-500"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {preview ? (
              <div className="relative h-40 w-40 overflow-hidden rounded-lg">
                <Image src={preview} alt="Dog" fill className="object-cover" unoptimized />
              </div>
            ) : (
              <p className="text-center text-zinc-500 dark:text-zinc-400">
                Drag & drop a photo here, or click to choose
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Pet details</h3>
          <div>
            <label htmlFor="pricing-agent-petName" className="block text-sm text-zinc-600 dark:text-zinc-400">
              Pet name <span className="text-red-500">*</span>
            </label>
            <input
              id="pricing-agent-petName"
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="e.g. Max"
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
          <div>
            <label htmlFor="pricing-agent-breed" className="block text-sm text-zinc-600 dark:text-zinc-400">
              Breed <span className="text-zinc-400">(optional)</span>
            </label>
            <input
              id="pricing-agent-breed"
              type="text"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder="e.g. Golden Retriever"
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
          <div>
            <label htmlFor="pricing-agent-weight" className="block text-sm text-zinc-600 dark:text-zinc-400">
              Weight (lbs) <span className="text-zinc-400">(optional)</span>
            </label>
            <input
              id="pricing-agent-weight"
              type="text"
              inputMode="decimal"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 45"
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Service</h3>
          <div className="mt-2 flex items-center gap-2">
            <input type="radio" id="pricing-agent-grooming" name="serviceType" value="grooming" defaultChecked className="h-4 w-4" />
            <label htmlFor="pricing-agent-grooming" className="text-zinc-700 dark:text-zinc-300">Grooming</label>
          </div>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Other services coming soon.</p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-zinc-900 py-4 font-medium text-white transition disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {loading ? "Getting your estimate…" : "Get price estimate"}
        </button>
      </form>
    </div>
  );
}
