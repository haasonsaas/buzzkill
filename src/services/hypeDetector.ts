
export const HYPE_WORDS = [
  "AI-powered", "revolutionary", "next-gen", "paradigm", "synergy",
  "military-grade", "cutting-edge", "world-class", "unprecedented",
  "transformative", "enterprise-grade", "turnkey", "end-to-end"
];

export const COLOR_SCALE = ["#8bc34a", "#ffc107", "#ff5722"];

export function calculateHypeScore(text: string): number {
  const lowerText = text.toLowerCase();
  return HYPE_WORDS.reduce(
    (count, word) => count + (lowerText.includes(word.toLowerCase()) ? 1 : 0),
    0
  );
}

export function getHypeColor(score: number): string {
  const idx = Math.min(score, COLOR_SCALE.length - 1);
  return COLOR_SCALE[idx];
}
