/**
 * Plum Blossom Numerology (梅花易数) hexagram casting.
 *
 * The original project handed the two raw numbers straight to the model and
 * asked it to "cast the hexagram". Models are unreliable at that, so we cast
 * the hexagram deterministically here and let the model do what it is good at:
 * interpreting it.
 *
 * Method: first number mod 8 -> upper trigram, second number mod 8 -> lower
 * trigram, sum of both mod 6 -> the moving (changing) line, counted from the
 * bottom. Changing that line yields the relating hexagram.
 */

export interface Trigram {
  /** Pre-heaven (Fu Xi) number, 1-8. */
  number: number;
  name: string;
  chinese: string;
  symbol: string;
  image: string;
  attribute: string;
  /** Lines from bottom to top, 1 = yang, 0 = yin. */
  lines: [number, number, number];
}

/** Indexed by pre-heaven number - 1: Qian, Dui, Li, Zhen, Xun, Kan, Gen, Kun. */
export const TRIGRAMS: Trigram[] = [
  { number: 1, name: "Qian", chinese: "乾", symbol: "☰", image: "Heaven", attribute: "Creative, strong", lines: [1, 1, 1] },
  { number: 2, name: "Dui", chinese: "兌", symbol: "☱", image: "Lake", attribute: "Joyous, open", lines: [1, 1, 0] },
  { number: 3, name: "Li", chinese: "離", symbol: "☲", image: "Fire", attribute: "Clinging, radiant", lines: [1, 0, 1] },
  { number: 4, name: "Zhen", chinese: "震", symbol: "☳", image: "Thunder", attribute: "Arousing, moving", lines: [1, 0, 0] },
  { number: 5, name: "Xun", chinese: "巽", symbol: "☴", image: "Wind", attribute: "Gentle, penetrating", lines: [0, 1, 1] },
  { number: 6, name: "Kan", chinese: "坎", symbol: "☵", image: "Water", attribute: "Abysmal, dangerous", lines: [0, 1, 0] },
  { number: 7, name: "Gen", chinese: "艮", symbol: "☶", image: "Mountain", attribute: "Still, resting", lines: [0, 0, 1] },
  { number: 8, name: "Kun", chinese: "坤", symbol: "☷", image: "Earth", attribute: "Receptive, yielding", lines: [0, 0, 0] },
];

/** King Wen numbers: KING_WEN[lowerIndex][upperIndex] with trigrams in pre-heaven order. */
const KING_WEN: number[][] = [
  [1, 43, 14, 34, 9, 5, 26, 11],
  [10, 58, 38, 54, 61, 60, 41, 19],
  [13, 49, 30, 55, 37, 63, 22, 36],
  [25, 17, 21, 51, 42, 3, 27, 24],
  [44, 28, 50, 32, 57, 48, 18, 46],
  [6, 47, 64, 40, 59, 29, 4, 7],
  [33, 31, 56, 62, 53, 39, 52, 15],
  [12, 45, 35, 16, 20, 8, 23, 2],
];

/** Hexagram names indexed by King Wen number - 1. */
export const HEXAGRAMS: { chinese: string; name: string }[] = [
  { chinese: "乾", name: "The Creative" },
  { chinese: "坤", name: "The Receptive" },
  { chinese: "屯", name: "Difficulty at the Beginning" },
  { chinese: "蒙", name: "Youthful Folly" },
  { chinese: "需", name: "Waiting" },
  { chinese: "訟", name: "Conflict" },
  { chinese: "師", name: "The Army" },
  { chinese: "比", name: "Holding Together" },
  { chinese: "小畜", name: "Taming Power of the Small" },
  { chinese: "履", name: "Treading" },
  { chinese: "泰", name: "Peace" },
  { chinese: "否", name: "Standstill" },
  { chinese: "同人", name: "Fellowship with Others" },
  { chinese: "大有", name: "Possession in Great Measure" },
  { chinese: "謙", name: "Modesty" },
  { chinese: "豫", name: "Enthusiasm" },
  { chinese: "隨", name: "Following" },
  { chinese: "蠱", name: "Work on What Has Been Spoiled" },
  { chinese: "臨", name: "Approach" },
  { chinese: "觀", name: "Contemplation" },
  { chinese: "噬嗑", name: "Biting Through" },
  { chinese: "賁", name: "Grace" },
  { chinese: "剝", name: "Splitting Apart" },
  { chinese: "復", name: "Return" },
  { chinese: "無妄", name: "Innocence" },
  { chinese: "大畜", name: "Taming Power of the Great" },
  { chinese: "頤", name: "Nourishment" },
  { chinese: "大過", name: "Preponderance of the Great" },
  { chinese: "坎", name: "The Abysmal Water" },
  { chinese: "離", name: "The Clinging Fire" },
  { chinese: "咸", name: "Influence" },
  { chinese: "恆", name: "Duration" },
  { chinese: "遯", name: "Retreat" },
  { chinese: "大壯", name: "Power of the Great" },
  { chinese: "晉", name: "Progress" },
  { chinese: "明夷", name: "Darkening of the Light" },
  { chinese: "家人", name: "The Family" },
  { chinese: "睽", name: "Opposition" },
  { chinese: "蹇", name: "Obstruction" },
  { chinese: "解", name: "Deliverance" },
  { chinese: "損", name: "Decrease" },
  { chinese: "益", name: "Increase" },
  { chinese: "夬", name: "Breakthrough" },
  { chinese: "姤", name: "Coming to Meet" },
  { chinese: "萃", name: "Gathering Together" },
  { chinese: "升", name: "Pushing Upward" },
  { chinese: "困", name: "Oppression" },
  { chinese: "井", name: "The Well" },
  { chinese: "革", name: "Revolution" },
  { chinese: "鼎", name: "The Cauldron" },
  { chinese: "震", name: "The Arousing Thunder" },
  { chinese: "艮", name: "Keeping Still Mountain" },
  { chinese: "漸", name: "Development" },
  { chinese: "歸妹", name: "The Marrying Maiden" },
  { chinese: "豐", name: "Abundance" },
  { chinese: "旅", name: "The Wanderer" },
  { chinese: "巽", name: "The Gentle Wind" },
  { chinese: "兌", name: "The Joyous Lake" },
  { chinese: "渙", name: "Dispersion" },
  { chinese: "節", name: "Limitation" },
  { chinese: "中孚", name: "Inner Truth" },
  { chinese: "小過", name: "Preponderance of the Small" },
  { chinese: "既濟", name: "After Completion" },
  { chinese: "未濟", name: "Before Completion" },
];

export interface HexagramCast {
  upper: Trigram;
  lower: Trigram;
  /** Six lines bottom to top, 1 = yang, 0 = yin. */
  lines: number[];
  number: number;
  name: string;
  chinese: string;
  /** 1-6, counted from the bottom. */
  movingLine: number;
  relating: { number: number; name: string; chinese: string; lines: number[] };
  /** Human readable summary handed to the model. */
  summary: string;
}

const trigramFromNumber = (n: number): Trigram => {
  const idx = ((n % 8) + 8) % 8; // 0 maps to Kun (8), matching the classic method
  return TRIGRAMS[idx === 0 ? 7 : idx - 1];
};

const hexagramLines = (upper: Trigram, lower: Trigram): number[] => [
  ...lower.lines,
  ...upper.lines,
];

const lookup = (upper: Trigram, lower: Trigram) =>
  KING_WEN[lower.number - 1][upper.number - 1];

const describe = (num: number) => HEXAGRAMS[num - 1];

export function castHexagram(num1: number, num2: number): HexagramCast {
  const upper = trigramFromNumber(Math.trunc(Math.abs(num1)));
  const lower = trigramFromNumber(Math.trunc(Math.abs(num2)));
  const sum = Math.trunc(Math.abs(num1)) + Math.trunc(Math.abs(num2));
  const movingLine = sum % 6 === 0 ? 6 : sum % 6;

  const lines = hexagramLines(upper, lower);
  const number = lookup(upper, lower);
  const primary = describe(number);

  const changedLines = [...lines];
  changedLines[movingLine - 1] = changedLines[movingLine - 1] === 1 ? 0 : 1;
  const relUpperLines = changedLines.slice(3) as [number, number, number];
  const relLowerLines = changedLines.slice(0, 3) as [number, number, number];
  const matches = (t: Trigram, l: number[]) => t.lines.every((v, i) => v === l[i]);
  const relUpper = TRIGRAMS.find((t) => matches(t, relUpperLines))!;
  const relLower = TRIGRAMS.find((t) => matches(t, relLowerLines))!;
  const relNumber = lookup(relUpper, relLower);
  const relating = { number: relNumber, ...describe(relNumber), lines: changedLines };

  const summary =
    `Upper trigram ${upper.name} ${upper.symbol} (${upper.chinese}, ${upper.image}), ` +
    `lower trigram ${lower.name} ${lower.symbol} (${lower.chinese}, ${lower.image}). ` +
    `Primary hexagram: #${number} ${primary.name} (${primary.chinese}). ` +
    `Moving line: line ${movingLine} counted from the bottom. ` +
    `Relating hexagram: #${relNumber} ${relating.name} (${relating.chinese}).`;

  return {
    upper,
    lower,
    lines,
    number,
    name: primary.name,
    chinese: primary.chinese,
    movingLine,
    relating,
    summary,
  };
}
