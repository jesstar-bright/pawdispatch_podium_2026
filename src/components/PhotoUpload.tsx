"use client";

import { useCallback, useState } from "react";
import Image from "next/image";

interface PhotoUploadProps {
  onFileSelect: (file: File | null) => void;
}

export default function PhotoUpload({ onFileSelect }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      setPreview(URL.createObjectURL(file));
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const removeFile = () => {
    setPreview(null);
    onFileSelect(null);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
      }}
      className="relative flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-300"
      style={
        dragOver
          ? { borderColor: "#38bdf8", background: "rgba(56,189,248,0.05)", transform: "scale(1.01)" }
          : preview
          ? { borderColor: "transparent" }
          : { borderColor: "rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.02)" }
      }
      onClick={() => !preview && document.getElementById("photo-input")?.click()}
    >
      {preview ? (
        <div className="relative w-full h-full min-h-[280px]">
          <Image
            src={preview}
            alt="Dog photo preview"
            fill
            className="rounded-xl object-cover"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById("photo-input")?.click();
              }}
              className="p-2 rounded-full transition-colors"
              style={{ background: "rgba(15,23,42,0.8)", color: "#f1f5f9" }}
              aria-label="Replace photo"
            >
              {/* Upload icon */}
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="p-2 rounded-full transition-colors"
              style={{ background: "rgba(15,23,42,0.8)", color: "#f1f5f9" }}
              aria-label="Remove photo"
            >
              {/* X icon */}
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-8">
          <div
            className="h-16 w-16 rounded-2xl flex items-center justify-center animate-pulse-glow"
            style={{ background: "rgba(56,189,248,0.1)" }}
          >
            {/* Camera icon */}
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
          <p className="text-base font-medium" style={{ color: "#94a3b8" }}>
            Drop a photo of your dog here
          </p>
          <p className="text-sm" style={{ color: "rgba(148,163,184,0.6)" }}>
            or click to browse • JPG, PNG up to 10MB
          </p>
        </div>
      )}
      <input
        id="photo-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
    </div>
  );
}
