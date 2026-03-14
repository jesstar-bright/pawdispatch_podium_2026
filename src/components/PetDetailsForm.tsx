"use client";

interface PetDetailsFormProps {
  petName: string;
  breed: string;
  weight: string;
  onPetNameChange: (v: string) => void;
  onBreedChange: (v: string) => void;
  onWeightChange: (v: string) => void;
}

export default function PetDetailsForm({
  petName,
  breed,
  weight,
  onPetNameChange,
  onBreedChange,
  onWeightChange,
}: PetDetailsFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="petName" className="block text-sm font-medium text-zinc-700">
          Pet Name <span className="text-red-500">*</span>
        </label>
        <input
          id="petName"
          type="text"
          required
          value={petName}
          onChange={(e) => onPetNameChange(e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-paw-blue focus:outline-none focus:ring-1 focus:ring-paw-blue"
          placeholder="e.g., Buddy"
        />
      </div>
      <div>
        <label htmlFor="breed" className="block text-sm font-medium text-zinc-700">
          Breed <span className="text-zinc-400">(optional)</span>
        </label>
        <input
          id="breed"
          type="text"
          value={breed}
          onChange={(e) => onBreedChange(e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-paw-blue focus:outline-none focus:ring-1 focus:ring-paw-blue"
          placeholder="e.g., Golden Retriever"
        />
      </div>
      <div>
        <label htmlFor="weight" className="block text-sm font-medium text-zinc-700">
          Weight (lbs) <span className="text-zinc-400">(optional)</span>
        </label>
        <input
          id="weight"
          type="number"
          value={weight}
          onChange={(e) => onWeightChange(e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-paw-blue focus:outline-none focus:ring-1 focus:ring-paw-blue"
          placeholder="e.g., 65"
        />
      </div>
    </div>
  );
}
