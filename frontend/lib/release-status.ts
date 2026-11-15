export type ReleaseAvailability = "available" | "coming-soon";

export function isAvailable(availability: ReleaseAvailability) {
  return availability === "available";
}
