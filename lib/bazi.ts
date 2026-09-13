/**
 * Four Pillars of Destiny (BaZi / 生辰八字) chart calculation.
 *
 * Pure TypeScript port of the chart-casting step that the original
 * chatgpt-tarot-divination project delegated to the Python `lunar_python`
 * library. We only need the four pillars (year / month / day / hour), the
 * elemental balance and the zodiac animal — the interpretation itself is done
 * by the model, which is explicitly told not to re-cast the chart.
 *
 * Accuracy note: solar longitude uses the standard low-precision solar
 * position formula (error < 0.01°, i.e. under ~15 minutes of time). That is
 * plenty for month/year pillar boundaries except for births within minutes of
 * a solar term, which is also true of most consumer BaZi calculators.
 */

export const HEAVENLY_STEMS = [
  "Jia", "Yi", "Bing", "Ding", "Wu", "Ji", "Geng", "Xin", "Ren", "Gui",
] as const;

export const HEAVENLY_STEMS_CN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;

export const EARTHLY_BRANCHES = [
  "Zi", "Chou", "Yin", "Mao", "Chen", "Si", "Wu", "Wei", "Shen", "You", "Xu", "Hai",
] as const;

export const EARTHLY_BRANCHES_CN = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;

export const ZODIAC_ANIMALS = [
  "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake",
  "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig",
] as const;

export type FiveElement = "Wood" | "Fire" | "Earth" | "Metal" | "Water";

const STEM_ELEMENTS: FiveElement[] = [
  "Wood", "Wood", "Fire", "Fire", "Earth", "Earth", "Metal", "Metal", "Water", "Water",
];

const BRANCH_ELEMENTS: FiveElement[] = [
  "Water", "Earth", "Wood", "Wood", "Earth", "Fire",
  "Fire", "Earth", "Metal", "Metal", "Earth", "Water",
];

const STEM_YIN_YANG = (i: number) => (i % 2 === 0 ? "Yang" : "Yin");

export interface Pillar {
  stem: string;
  branch: string;
  /** e.g. "Jia Zi (甲子)" */
  label: string;
  element: FiveElement;
}

export interface BaziChart {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
  /** Chinese zodiac animal of the solar (Li Chun based) year. */
  animal: string;
  /** The stem of the day pillar — the "Day Master" in BaZi readings. */
  dayMaster: string;
  dayMasterPolarity: string;
  elementCounts: Record<FiveElement, number>;
  /** Elements with a zero count — the classic "missing" elements. */
  missingElements: FiveElement[];
  /** Human readable summary handed to the model. */
  summary: string;
}

/** Julian Day Number for a Gregorian calendar date (integer, midnight based). */
function gregorianToJdn(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/** Apparent ecliptic longitude of the Sun in degrees [0, 360). */
function solarLongitude(jd: number): number {
  const n = jd - 2451545.0;
  const L = 280.46 + 0.9856474 * n;
  const g = ((357.528 + 0.9856003 * n) * Math.PI) / 180;
  const lambda = L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g);
  return ((lambda % 360) + 360) % 360;
}

function pillar(stemIndex: number, branchIndex: number): Pillar {
  const s = ((stemIndex % 10) + 10) % 10;
  const b = ((branchIndex % 12) + 12) % 12;
  return {
    stem: HEAVENLY_STEMS[s],
    branch: EARTHLY_BRANCHES[b],
    label: `${HEAVENLY_STEMS[s]} ${EARTHLY_BRANCHES[b]} (${HEAVENLY_STEMS_CN[s]}${EARTHLY_BRANCHES_CN[b]})`,
    element: STEM_ELEMENTS[s],
  };
}

export interface BirthMoment {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
  hour: number; // 0-23
  minute: number; // 0-59
  /** Minutes to subtract from local time to reach UTC (as in Date#getTimezoneOffset). */
  timezoneOffsetMinutes?: number;
}

/** Parses "YYYY-MM-DD HH:mm" / "YYYY-MM-DDTHH:mm" (and optional ":ss"). */
export function parseBirthMoment(
  input: string,
  timezoneOffsetMinutes = 0
): BirthMoment | null {
  const m = input
    .trim()
    .match(/^(\d{4})-(\d{1,2})-(\d{1,2})[T ](\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return null;
  const [, y, mo, d, h, mi] = m;
  const moment: BirthMoment = {
    year: Number(y),
    month: Number(mo),
    day: Number(d),
    hour: Number(h),
    minute: Number(mi),
    timezoneOffsetMinutes,
  };
  if (
    moment.month < 1 || moment.month > 12 ||
    moment.day < 1 || moment.day > 31 ||
    moment.hour > 23 || moment.minute > 59 ||
    moment.year < 1900 || moment.year > 2100
  ) {
    return null;
  }
  return moment;
}

export function castBaziChart(moment: BirthMoment): BaziChart {
  const { year, month, day, hour, minute } = moment;
  const tzOffset = moment.timezoneOffsetMinutes ?? 0;

  // --- Day pillar: continuous sexagenary count anchored on 2000-01-07 = Jia Zi.
  // In BaZi the day flips at 23:00 (the start of the Zi hour), not at midnight.
  const rollsOver = hour >= 23;
  const jdn = gregorianToJdn(year, month, day) + (rollsOver ? 1 : 0);
  const dayStem = (jdn + 9) % 10;
  const dayBranch = (jdn + 1) % 12;

  // --- Solar longitude at the moment of birth (converted to UT).
  const jdUt =
    gregorianToJdn(year, month, day) - 0.5 + (hour * 60 + minute + tzOffset) / 1440;
  const lambda = solarLongitude(jdUt);

  // --- Year pillar: the solar year turns at Li Chun (sun at 315°).
  let solarYear = year;
  if (month <= 2 && !(lambda >= 315 || lambda < 270)) solarYear = year - 1;
  const yearStem = (((solarYear - 4) % 10) + 10) % 10;
  const yearBranch = (((solarYear - 4) % 12) + 12) % 12;

  // --- Month pillar: month index counted from Li Chun; branch starts at Yin.
  const monthIndex = Math.floor((((lambda - 315) % 360) + 360) % 360 / 30); // 0 = Yin month
  const monthBranch = (2 + monthIndex) % 12;
  // "Five Tigers" rule: the Yin month stem follows the year stem.
  const monthStem = ((yearStem % 5) * 2 + 2 + monthIndex) % 10;

  // --- Hour pillar: two-hour branches starting with Zi (23:00-00:59).
  const hourBranch = Math.floor((((hour + 1) % 24) / 2)) % 12;
  const hourStem = ((dayStem % 5) * 2 + hourBranch) % 10;

  const pillars = {
    year: pillar(yearStem, yearBranch),
    month: pillar(monthStem, monthBranch),
    day: pillar(dayStem, dayBranch),
    hour: pillar(hourStem, hourBranch),
  };

  const elementCounts: Record<FiveElement, number> = {
    Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0,
  };
  const stemIdx = [yearStem, monthStem, dayStem, hourStem];
  const branchIdx = [yearBranch, monthBranch, dayBranch, hourBranch];
  stemIdx.forEach((i) => (elementCounts[STEM_ELEMENTS[i]] += 1));
  branchIdx.forEach((i) => (elementCounts[BRANCH_ELEMENTS[i]] += 1));

  const missingElements = (Object.keys(elementCounts) as FiveElement[]).filter(
    (e) => elementCounts[e] === 0
  );

  const summary =
    `Year pillar ${pillars.year.label}, Month pillar ${pillars.month.label}, ` +
    `Day pillar ${pillars.day.label}, Hour pillar ${pillars.hour.label}. ` +
    `Day Master: ${STEM_YIN_YANG(dayStem)} ${STEM_ELEMENTS[dayStem]} (${HEAVENLY_STEMS[dayStem]}). ` +
    `Zodiac animal: ${ZODIAC_ANIMALS[yearBranch]}. ` +
    `Element balance — ` +
    (Object.keys(elementCounts) as FiveElement[])
      .map((e) => `${e}: ${elementCounts[e]}`)
      .join(", ") +
    (missingElements.length ? `. Missing: ${missingElements.join(", ")}.` : ".");

  return {
    ...pillars,
    animal: ZODIAC_ANIMALS[yearBranch],
    dayMaster: `${STEM_YIN_YANG(dayStem)} ${STEM_ELEMENTS[dayStem]}`,
    dayMasterPolarity: STEM_YIN_YANG(dayStem),
    elementCounts,
    missingElements,
    summary,
  };
}
