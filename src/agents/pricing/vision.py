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
                            "text": """You are a dog grooming pricing classifier. Look at this dog photo and respond with a single JSON object (no markdown, no code block) with exactly these keys:
- sizeCategory: one of "small", "medium", "large", "xlarge" (small <15 lbs equivalent, medium 15-40, large 40-80, xlarge 80+)
- longThickCoat: boolean (long or very thick/dense coat)
- mattedFur: boolean (visible matting or tangles)
- specialHandling: boolean (signs of anxiety, nervousness, or that the dog may need extra care)
- breedGuess: string (optional, brief breed guess)

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
        return {
            "sizeCategory": parsed["sizeCategory"],
            "longThickCoat": bool(parsed.get("longThickCoat", False)),
            "mattedFur": bool(parsed.get("mattedFur", False)),
            "specialHandling": bool(parsed.get("specialHandling", False)),
            "breedGuess": parsed.get("breedGuess"),
        }
    except Exception:
        return None
