"""
Claude Vision: classify dog from image for grooming pricing.
Uses ANTHROPIC_API_KEY from environment. Supports (1) direct AI price in $50-$5000 from image,
(2) classifier for rule-based fallback (sizeCategory, longThickCoat, mattedFur, specialHandling).
"""

import base64
import json
from typing import TypedDict

from anthropic import Anthropic

# Price range for AI estimate: $50 to $5000 (in cents)
MIN_PRICE_CENTS = 5000   # $50
MAX_PRICE_CENTS = 500000  # $5000


class VisionClassification(TypedDict):
    sizeCategory: str
    longThickCoat: bool
    mattedFur: bool
    specialHandling: bool
    breedGuess: str | None
    dirtinessLevel: str  # "clean", "slightly_dirty", "moderately_dirty", "very_dirty"


class AIPriceResult(TypedDict):
    estimatedPriceCents: int
    explanation: str
    sizeCategory: str


def _image_bytes_from_input(image_base64: str | bytes) -> bytes:
    """Normalize image input to raw bytes."""
    if isinstance(image_base64, str):
        if "," in image_base64:
            image_base64 = image_base64.split(",", 1)[1]
        return base64.b64decode(image_base64)
    return image_base64


def estimate_price_from_image(image_base64: str | bytes, api_key: str | None) -> AIPriceResult | None:
    """
    Ask Claude to estimate grooming price from the dog photo. Returns a price between $50 and $5000.
    """
    if not api_key:
        return None
    data = _image_bytes_from_input(image_base64) if isinstance(image_base64, str) else image_base64
    if not data:
        return None
    try:
        client = Anthropic(api_key=api_key)
        resp = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=512,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": "image/jpeg",
                                "data": base64.b64encode(data).decode("ascii"),
                            },
                        },
                        {
                            "type": "text",
                            "text": """You are a dog grooming pricing expert. Look at this dog photo and estimate the total grooming price.

Respond with a single JSON object (no markdown, no code block) with exactly these keys:
- estimatedPriceCents: number (integer, total price in cents; must be between 5000 and 500000, i.e. $50 to $5000)
- explanation: string (1-2 sentences explaining the estimate, e.g. size, coat, condition, special needs)
- sizeCategory: one of "small", "medium", "large", "xlarge"

Consider: size/weight, coat length and density, matting/tangles, breed difficulty, and any special handling. Only output the JSON object.""",
                        },
                    ],
                }
            ],
        )
        text = (resp.content[0].text if resp.content else "").strip()
        if not text:
            return None
        parsed = json.loads(text)
        cents = int(parsed.get("estimatedPriceCents", 0))
        cents = max(MIN_PRICE_CENTS, min(MAX_PRICE_CENTS, cents))
        explanation = str(parsed.get("explanation", "AI estimate from photo.")).strip() or "AI estimate from photo."
        size_cat = parsed.get("sizeCategory", "large")
        if size_cat not in ("small", "medium", "large", "xlarge"):
            size_cat = "large"
        return {
            "estimatedPriceCents": cents,
            "explanation": explanation,
            "sizeCategory": size_cat,
        }
    except Exception:
        return None


def classify_dog_from_image(image_base64: str | bytes, api_key: str | None) -> VisionClassification | None:
    if not api_key:
        return None
    data = _image_bytes_from_input(image_base64) if isinstance(image_base64, str) else image_base64
    if not data:
        return None
    try:
        client = Anthropic(api_key=api_key)
        resp = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=512,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": "image/jpeg",
                                "data": base64.b64encode(data).decode("ascii"),
                            },
                        },
                        {
                            "type": "text",
                            "text": """You are a dog grooming pricing classifier. Analyze this dog photo carefully and respond with a single JSON object (no markdown, no code block) with exactly these keys:

- sizeCategory: one of "small", "medium", "large", "xlarge" (small <15 lbs equivalent, medium 15-40, large 40-80, xlarge 80+)

- longThickCoat: boolean (long or very thick/dense coat that requires more grooming time and products)

- mattedFur: boolean (visible matting, tangles, or severely knotted fur that requires dematting)

- specialHandling: boolean (signs of anxiety, nervousness, fear, or behavioral indicators that the dog may need extra care and patience during grooming)

- breedGuess: string (optional, brief breed guess)

- dirtinessLevel: one of "clean", "slightly_dirty", "moderately_dirty", "very_dirty" 
  IMPORTANT: Carefully examine the dog's coat, paws, and overall appearance to assess dirtiness:
  - "clean": Dog appears clean, well-maintained, minimal dirt or stains
  - "slightly_dirty": Some visible dirt, mud, or stains on paws, legs, or coat - requires extra cleaning time
  - "moderately_dirty": Noticeable dirt, mud, or stains covering significant portions of the body - requires extensive cleaning
  - "very_dirty": Dog is heavily soiled with mud, dirt, stains, or appears to have been in very dirty conditions - requires deep cleaning and deodorizing

Only output the JSON object.""",
                        },
                    ],
                }
            ],
        )
        text = (resp.content[0].text if resp.content else "").strip()
        if not text:
            return None
        parsed = json.loads(text)
        if parsed.get("sizeCategory") not in ("small", "medium", "large", "xlarge"):
            return None
        dirtiness = parsed.get("dirtinessLevel", "clean")
        if dirtiness not in ("clean", "slightly_dirty", "moderately_dirty", "very_dirty"):
            dirtiness = "clean"
        return {
            "sizeCategory": parsed["sizeCategory"],
            "longThickCoat": bool(parsed.get("longThickCoat", False)),
            "mattedFur": bool(parsed.get("mattedFur", False)),
            "specialHandling": bool(parsed.get("specialHandling", False)),
            "breedGuess": parsed.get("breedGuess"),
            "dirtinessLevel": dirtiness,
        }
    except Exception:
        return None
