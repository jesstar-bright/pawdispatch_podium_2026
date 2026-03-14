"use client";

interface PetDetailsFormProps {
  petName: string;
  breed: string;
  weight: string;
  onPetNameChange: (v: string) => void;
  onBreedChange: (v: string) => void;
  onWeightChange: (v: string) => void;
}

const inputStyle = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#f1f5f9",
};

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
        <label htmlFor="petName" className="block text-sm font-medium" style={{ color: "#94a3b8" }}>
          Pet Name <span className="text-red-500">*</span>
        </label>
        <input
          id="petName"
          type="text"
          required
          value={petName}
          onChange={(e) => onPetNameChange(e.target.value)}
          className="mt-1 w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
          style={inputStyle}
          placeholder="e.g., Buddy"
        />
      </div>
      <div>
        <label htmlFor="breed" className="block text-sm font-medium" style={{ color: "#94a3b8" }}>
          Breed <span style={{ color: "#64748b" }}>(optional)</span>
        </label>
        <input
          id="breed"
          type="text"
          value={breed}
          onChange={(e) => onBreedChange(e.target.value)}
          className="mt-1 w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
          style={inputStyle}
          placeholder="e.g., Golden Retriever"
        />
      </div>
      <div>
        <label htmlFor="weight" className="block text-sm font-medium" style={{ color: "#94a3b8" }}>
          Weight (lbs) <span style={{ color: "#64748b" }}>(optional)</span>
        </label>
        <input
          id="weight"
          type="number"
          value={weight}
          onChange={(e) => onWeightChange(e.target.value)}
          className="mt-1 w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
          style={inputStyle}
          placeholder="e.g., 65"
        />
      </div>
    </div>
  );
}
