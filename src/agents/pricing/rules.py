"""
Grooming pricing rules — aligned with lead-to-booking spec.
Small < 15 lbs $35, Medium 15–40 $55, Large 40–80 $75, XLarge 80+ $95.
Long/thick coat +$15, Matted fur +$20, Special handling +$10.
"""

from typing import Literal

SizeBand = Literal["small", "medium", "large", "xlarge"]

GROOMING_BASE_PRICE_CENTS: dict[SizeBand, int] = {
    "small": 3500,
    "medium": 5500,
    "large": 7500,
    "xlarge": 9500,
}

LONG_THICK_COAT_CENTS = 1500
MATTED_FUR_CENTS = 2000
SPECIAL_HANDLING_CENTS = 1000


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
            "reason": "Special handling (anxious/aggressive)",
            "amount": SPECIAL_HANDLING_CENTS,
        })

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
