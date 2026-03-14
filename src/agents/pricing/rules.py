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

MIN_PRICE_CENTS = 5000   # $50
MAX_PRICE_CENTS = 100000 # $1000

# Base price by size (small < ~15 lbs, medium ~15–40, large ~40–80, xlarge 80+)
GROOMING_BASE_PRICE_CENTS: dict[SizeBand, int] = {
    "small": 5000,   # $50
    "medium": 10000, # $100
    "large": 22000,  # $220
    "xlarge": 45000, # $450
}

# Add-ons from vision (complexity / condition)
LONG_THICK_COAT_CENTS = 18000   # $180 — more time, more product
MATTED_FUR_CENTS = 22000        # $220 — dematting labor
SPECIAL_HANDLING_CENTS = 10000  # $100 — anxious, nervous, extra care


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


def compute_grooming_price(
    *,
    size_band: SizeBand,
    long_thick_coat: bool = False,
    matted_fur: bool = False,
    special_handling: bool = False,
) -> dict:
    base_price = GROOMING_BASE_PRICE_CENTS[size_band]
    adjustments: list[dict] = []
    total_price = base_price

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

    total_price = max(MIN_PRICE_CENTS, min(MAX_PRICE_CENTS, total_price))

    factors = [{"label": f"Base ({size_band})", "amountCents": base_price}]
    for a in adjustments:
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