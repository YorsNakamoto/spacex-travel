/** Lapisan grain statis 5% di atas konten, di bawah navbar & dialog. */
export function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="grain pointer-events-none fixed inset-0 z-40"
    />
  );
}
