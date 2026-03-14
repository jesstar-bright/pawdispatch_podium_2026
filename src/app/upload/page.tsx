import { redirect } from "next/navigation";

/**
 * Canonical pricing-agent test flow lives under /agent-tests/pricing.
 * Redirect so existing links and bookmarks still work.
 */
export default function UploadPage() {
  redirect("/agent-tests/pricing/upload");
}
