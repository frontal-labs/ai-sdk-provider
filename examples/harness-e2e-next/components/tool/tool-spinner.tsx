/**
 * Loading spinner for harness tool views, absolutely positioned just left of
 * the tool label.
 *
 * The outer span owns the position and vertical centering (via flexbox over a
 * line-height-tall box) while the inner span owns the spin. Keeping these on
 * separate elements is required: Tailwind's `animate-spin` animates the
 * element's `transform`, so a centering `-translate-y-1/2` on the same element
 * would be clobbered every frame, making the spinner drift instead of rotate.
 */
export default function ToolSpinner() {
  return (
    <span
      aria-label="Running"
      className="absolute top-0 -left-5 flex h-5 items-center"
    >
      <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
    </span>
  );
}
