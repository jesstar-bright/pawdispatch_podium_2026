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
        <label htmlFor="petName" className="block text-sm font-medium mb-1.5" style={{ color: "#94a3b8" }}>
          Pet Name <span style={{ color: "#38bdf8" }}>*</span>
        </label>
        <input
          id="petName"
          type="text"
          value={petName}
          onChange={(e) => onPetNameChange(e.target.value)}
          placeholder="e.g., Cooper"
          className="w-full rounded-lg px-4 py-2.5 text-sm glass-input focus:outline-none"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="breed" className="block text-sm font-medium mb-1.5" style={{ color: "#94a3b8" }}>
            Breed
          </label>
          <input
            id="breed"
            type="text"
            value={breed}
            onChange={(e) => onBreedChange(e.target.value)}
            placeholder="e.g., Goldendoodle"
            className="w-full rounded-lg px-4 py-2.5 text-sm glass-input focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="weight" className="block text-sm font-medium mb-1.5" style={{ color: "#94a3b8" }}>
            Weight (lbs)
          </label>
          <input
            id="weight"
            type="text"
            value={weight}
            onChange={(e) => onWeightChange(e.target.value)}
            placeholder="e.g., 45"
            className="w-full rounded-lg px-4 py-2.5 text-sm glass-input focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
