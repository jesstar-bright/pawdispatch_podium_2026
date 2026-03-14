"""
FastAPI server for the Pricing Agent.
POST /estimate — multipart: image file, petName, breed?, weight?
POST /estimate/json — JSON: petName, breed?, weight?, image? (base64)
Returns same shape as lead-to-booking spec.
"""

import base64
import uuid
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .engine import analyze_dog_photo


class EstimateJsonBody(BaseModel):
    petName: str
    breed: str | None = None
    weight: float | None = None
    image: str | None = None  # base64 data URL or raw base64

app = FastAPI(title="PawDispatch Pricing Agent", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/estimate")
async def estimate(
    image: UploadFile = File(...),
    petName: str = Form(...),
    breed: str | None = Form(None),
    weight: str | None = Form(None),
):
    """Accept multipart form (image + petName, breed?, weight?). Returns estimate + estimateId."""
    if not petName.strip():
        raise HTTPException(status_code=400, detail="petName is required")
    weight_num = None
    if weight and weight.strip():
        try:
            weight_num = float(weight.strip())
        except ValueError:
            weight_num = None
    image_bytes = await image.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="image file is required")

    try:
        result = analyze_dog_photo(
            image_bytes,
            {"petName": petName.strip(), "breed": breed.strip() if breed else None, "weight": weight_num},
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Unable to generate pricing estimate. Please try again.",
        ) from e

    estimate_id = str(uuid.uuid4())
    return {
        "estimateId": estimate_id,
        "basePrice": result["basePrice"],
        "adjustments": result["adjustments"],
        "totalPrice": result["totalPrice"],
        "sizeCategory": result["sizeCategory"],
        "explanation": result["explanation"],
        "imageUrl": "",
    }


@app.post("/estimate/json")
async def estimate_json(body: EstimateJsonBody):
    """JSON body: petName, breed?, weight?, image? (base64)."""
    if not body.petName.strip():
        raise HTTPException(status_code=400, detail="petName is required")
    image_bytes = b""
    if body.image and body.image.strip():
        raw = body.image.strip()
        if "," in raw:
            raw = raw.split(",", 1)[1]
        try:
            image_bytes = base64.b64decode(raw)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid base64 image")
    try:
        result = analyze_dog_photo(
            image_bytes,
            {"petName": body.petName.strip(), "breed": body.breed, "weight": body.weight},
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Unable to generate pricing estimate. Please try again.",
        ) from e
    estimate_id = str(uuid.uuid4())
    return {
        "estimateId": estimate_id,
        "basePrice": result["basePrice"],
        "adjustments": result["adjustments"],
        "totalPrice": result["totalPrice"],
        "sizeCategory": result["sizeCategory"],
        "explanation": result["explanation"],
        "imageUrl": "",
    }


@app.get("/health")
def health():
    return {"status": "ok"}
