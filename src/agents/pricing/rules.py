"""
Grooming pricing rules. Price range: $50 min, $1000 max (cents: 5000–100000).

Pricing features (from Claude Vision image analysis):
- sizeCategory: small / medium / large / xlarge → base price
- longThickCoat: + time and product → add-on
- mattedFur: dematting labor → add-on
- specialHandling: anxious/nervous, extra care → add-on

Total is clamped to [MIN_PRICE_CENTS, MAX_PRICE_CENTS].
"""

from typing import Literal

SizeBand = Literal["small", "medium", "large", "xlarge"]

# Pricing rules
# Base price (weight + dirtiness) should range from $60 to $150
# Other services should range from $30 to $80
MIN_PRICE_CENTS = 6000   # $60 (minimum base)
MAX_PRICE_CENTS = 100000 # $1000 (maximum total)

# Base prices by size (weight-based)
GROOMING_BASE_PRICE_CENTS: dict[SizeBand, int] = {
    "small": 6000,   # $60
    "medium": 7500,  # $75
    "large": 9000,   # $90
    "xlarge": 10500, # $105
}

# Dirtiness adjustments (part of base price calculation)
# These adjust the base price to stay within $60-$150 range
SLIGHTLY_DIRTY_CENTS = 1000    # $10
MODERATELY_DIRTY_CENTS = 2500   # $25
VERY_DIRTY_CENTS = 4500         # $45

# Other services (range $30-$80)
LONG_THICK_COAT_CENTS = 5000    # $50
MATTED_FUR_CENTS = 6000          # $60
SPECIAL_HANDLING_CENTS = 4000   # $40


def size_band_from_weight_lbs(weight_lbs: float | None) -> SizeBand:
    if weight_lbs is None or weight_lbs <= 0:
        return "medium"
    if weight_lbs < 15:
        return "small"
    if weight_lbs < 40:
        return "medium"
    if weight_lbs < 80:
        return "large"
    return "xlarge"


DirtinessLevel = Literal["clean", "slightly_dirty", "moderately_dirty", "very_dirty"]


def compute_grooming_price(
    *,
    size_band: SizeBand,
    long_thick_coat: bool = False,
    matted_fur: bool = False,
    special_handling: bool = False,
    dirtiness_level: DirtinessLevel = "clean",
) -> dict:
    # Start with base price by size (weight-based)
    size_base_price = GROOMING_BASE_PRICE_CENTS[size_band]
    adjustments: list[dict] = []
    
    # Add dirtiness adjustment (base + dirtiness = $60-$150 range)
    dirtiness_adjustment = 0
    if dirtiness_level == "slightly_dirty":
        dirtiness_adjustment = SLIGHTLY_DIRTY_CENTS
        adjustments.append({"reason": "Slightly dirty (extra cleaning time)", "amount": SLIGHTLY_DIRTY_CENTS})
    elif dirtiness_level == "moderately_dirty":
        dirtiness_adjustment = MODERATELY_DIRTY_CENTS
        adjustments.append({"reason": "Moderately dirty (extensive cleaning required)", "amount": MODERATELY_DIRTY_CENTS})
    elif dirtiness_level == "very_dirty":
        dirtiness_adjustment = VERY_DIRTY_CENTS
        adjustments.append({"reason": "Very dirty (deep cleaning and deodorizing)", "amount": VERY_DIRTY_CENTS})
    
    # Base price = size + dirtiness (should be $60-$150)
    base_price = size_base_price + dirtiness_adjustment
    
    # Ensure base price stays within $60-$150 range
    BASE_MAX_CENTS = 15000  # $150
    base_price = max(MIN_PRICE_CENTS, min(BASE_MAX_CENTS, base_price))
    
    # Calculate total starting from base price (size + dirtiness)
    total_price = base_price

    # Add other services (range $30-$80 each)
    if long_thick_coat:
        total_price += LONG_THICK_COAT_CENTS
        adjustments.append({"reason": "Long/thick coat", "amount": LONG_THICK_COAT_CENTS})
    if matted_fur:
        total_price += MATTED_FUR_CENTS
        adjustments.append({"reason": "Matted fur", "amount": MATTED_FUR_CENTS})
    if special_handling:
        total_price += SPECIAL_HANDLING_CENTS
        adjustments.append({
            "reason": "Special handling (anxious/extra care)",
            "amount": SPECIAL_HANDLING_CENTS,
        })

    # Clamp total price to maximum
    total_price = max(MIN_PRICE_CENTS, min(MAX_PRICE_CENTS, total_price))

    # Build factors - base price includes size + dirtiness
    dirtiness_text = f", {dirtiness_level.replace('_', ' ')}" if dirtiness_level != "clean" else ""
    factors = [{"label": f"Base ({size_band}{dirtiness_text})", "amountCents": base_price}]
    for a in adjustments:
        # Only include other services in factors (dirtiness is already in base)
        if "dirty" not in a["reason"]:
            factors.append({"label": a["reason"], "amountCents": a["amount"]})

    return {
        "basePrice": base_price,
        "adjustments": adjustments,
        "totalPrice": total_price,
        "factors": factors,
    }


def build_explanation(factors: list[dict], total_price_cents: int) -> str:
    parts = [f"{f['label']}: ${f['amountCents'] / 100:.2f}" for f in factors]
    return f"Total ${total_price_cents / 100:.2f} — {'; '.join(parts)}."