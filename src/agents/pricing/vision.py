"""
Claude Vision: classify dog from image for grooming pricing.
Uses ANTHROPIC_API_KEY from environment (e.g. secrets/.env).
Features returned are used by rules.py: sizeCategory (base price), longThickCoat, mattedFur, specialHandling (add-ons).
"""

import base64
import json
from typing import TypedDict

from anthropic import Anthropic


class VisionClassification(TypedDict):
    sizeCategory: str
    longThickCoat: bool
    mattedFur: bool
    specialHandling: bool
    breedGuess: str | None
    dirtinessLevel: str  # "clean", "slightly_dirty", "moderately_dirty", "very_dirty"


def classify_dog_from_image(image_base64: str | bytes, api_key: str | None) -> VisionClassification | None:
    if not api_key:
        return None
    if isinstance(image_base64, str):
        if "," in image_base64:
            image_base64 = image_base64.split(",", 1)[1]
        data = base64.b64decode(image_base64)
    else:
        data = image_base64

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
