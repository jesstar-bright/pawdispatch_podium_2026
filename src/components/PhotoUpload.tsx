"use client";

import { useCallback, useState } from "react";
import Image from "next/image";

interface PhotoUploadProps {
  onFileSelect: (file: File) => void;
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
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
      className="relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors"
      style={
        dragOver
          ? { borderColor: "#38bdf8", background: "rgba(56,189,248,0.06)" }
          : preview
            ? { borderColor: "rgba(255,255,255,0.15)", background: "transparent" }
            : { borderColor: "rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.02)" }
      }
      onClick={() => document.getElementById("photo-input")?.click()}
    >
      {preview ? (
        <Image
          src={preview}
          alt="Dog photo preview"
          fill
          className="rounded-xl object-cover"
        />
      ) : (
        <>
          <div className="text-5xl mb-4">📷</div>
          <p className="text-lg font-medium" style={{ color: "#94a3b8" }}>
            Drop a photo of your dog here
          </p>
          <p className="mt-1 text-sm" style={{ color: "#64748b" }}>or click to browse</p>
        </>
      )}
      <input
        id="photo-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
