"""
Pricing engine: image + metadata -> Claude Vision (optional) -> rules -> estimate.
"""

import os

from . import rules, vision


def analyze_dog_photo(image_bytes: bytes, metadata: dict) -> dict:
    """
    Main entry: analyze dog photo and return pricing estimate.
    metadata: { "petName": str, "breed": str | None, "weight": float | None }
    Returns: { sizeCategory, basePrice, adjustments, totalPrice, explanation }
    """
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    weight = metadata.get("weight")
    size_band = rules.size_band_from_weight_lbs(weight)
    long_thick_coat = False
    matted_fur = False
    special_handling = False

    dirtiness_level = "clean"
    if image_bytes and api_key:
        classification = vision.classify_dog_from_image(image_bytes, api_key)
        if classification:
            size_band = classification["sizeCategory"]
            long_thick_coat = classification.get("longThickCoat", False)
            matted_fur = classification.get("mattedFur", False)
            special_handling = classification.get("specialHandling", False)
            dirtiness_level = classification.get("dirtinessLevel", "clean")

    result = rules.compute_grooming_price(
        size_band=size_band,
        long_thick_coat=long_thick_coat,
        matted_fur=matted_fur,
        special_handling=special_handling,
        dirtiness_level=dirtiness_level,
    )
    explanation = rules.build_explanation(
        result["factors"], result["totalPrice"]
    )
    return {
        "sizeCategory": size_band,
        "basePrice": result["basePrice"],
        "adjustments": result["adjustments"],
        "totalPrice": result["totalPrice"],
        "explanation": explanation,
    }
