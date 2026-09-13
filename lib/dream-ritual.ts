/**
 * The Opening Rite — a short, moderator-led scene that plays before the dream
 * is spoken, in the spirit of a night-phase tabletop game: the Oracle narrates,
 * the dreamer answers, and each answer is folded into the interpretation.
 *
 * This module is shared by the client (to play the scene) and the server (to
 * rebuild the briefing). The client only ever sends step/choice IDs — the text
 * that reaches the model is taken from this table, never from the wire.
 */

export interface RitualAnswer {
  stepId: string;
  choiceId: string;
}

export interface RitualChoice {
  id: string;
  /** Button text — spoken by the dreamer. */
  label: string;
  /** Compact form, shown back to the dreamer once the rite is over. */
  chip: string;
  /** The Oracle's reply once the choice is made. */
  reply: string;
  /** Fed to the model as part of the dreamer's briefing. */
  briefing: string;
  /** Which seat this answer votes for. */
  seat: SeatId;
}

export interface RitualStep {
  id: string;
  /** Night-phase label, e.g. "First Watch". */
  phase: string;
  /** Lines the Oracle narrates before the question. */
  narration: string[];
  question: string;
  choices: RitualChoice[];
}

export type SeatId = "seer" | "witch" | "hunter" | "warden" | "wanderer";

export interface Seat {
  id: SeatId;
  name: string;
  /** Shown on the seat card at the end of the rite. */
  line: string;
  /** How the reading should lean for this seat. */
  tone: string;
}

export const RITUAL_STORAGE_KEY = "oniromancy.rite.v1";

/** A rite is good for one night; after that the Oracle asks again. */
export const RITUAL_TTL_MS = 12 * 60 * 60 * 1000;

export const RITUAL_OPENING: string[] = [
  "The lamps go out one by one. The circle is closed.",
  "The Oracle sets her lantern on the table between you and takes the seat across.",
  "\"Before a dream may be read, the room must know who walked in. Four watches, four answers — and the night will keep them.\"",
];

export const RITUAL_STEPS: RitualStep[] = [
  {
    id: "waking",
    phase: "First Watch",
    narration: [
      "\"You opened your eyes this morning, and something came back with you.\"",
    ],
    question: "What stayed in the room after you woke?",
    choices: [
      {
        id: "weight",
        chip: "Woke heavy",
        label: "A weight sitting on my chest.",
        reply: "\"Dread has a long memory. We will ask it what it wants.\"",
        briefing: "On waking, the dreamer carried a heaviness in the chest — dread that outlived the dream.",
        seat: "witch",
      },
      {
        id: "calm",
        chip: "Woke calm",
        label: "A strange, unearned calm.",
        reply: "\"Calm after a dream is rarely a gift. Sometimes it is a truce.\"",
        briefing: "On waking, the dreamer felt an unearned calm, as if something had been settled without their consent.",
        seat: "warden",
      },
      {
        id: "image",
        chip: "One image left",
        label: "One image, and nothing else.",
        reply: "\"A single image is a door left open on purpose.\"",
        briefing: "The dreamer retained only one vivid image; the rest of the dream dissolved on waking.",
        seat: "seer",
      },
      {
        id: "racing",
        chip: "Heart racing",
        label: "My heart, still running.",
        reply: "\"The body believed it. That is worth noting.\"",
        briefing: "The dreamer woke with a racing heart — the body reacted as though the dream were real.",
        seat: "hunter",
      },
    ],
  },
  {
    id: "recurrence",
    phase: "Second Watch",
    narration: [
      "The lantern gutters, then steadies.",
      "\"Dreams keep their own calendars.\"",
    ],
    question: "How long has this one been standing at your door?",
    choices: [
      {
        id: "first",
        chip: "First time",
        label: "It came for the first time last night.",
        reply: "\"New arrivals speak plainly. Let us hear it before it learns to hide.\"",
        briefing: "This dream arrived for the first time last night.",
        seat: "wanderer",
      },
      {
        id: "recurring",
        chip: "Recurring",
        label: "It returns, again and again.",
        reply: "\"Repetition is insistence. Something has not been answered.\"",
        briefing: "The dream is recurring — it has returned many times, which suggests an unanswered pattern in waking life.",
        seat: "seer",
      },
      {
        id: "returned",
        chip: "An old dream",
        label: "It is old — but tonight it came back.",
        reply: "\"Old dreams return when the room they were born in is rebuilt.\"",
        briefing: "An old dream from the dreamer's past has returned after a long absence, likely triggered by present circumstances.",
        seat: "witch",
      },
      {
        id: "uncertain",
        chip: "Maybe not a dream",
        label: "I am not certain it was a dream.",
        reply: "\"Then we will read it as it came, and not argue with the hour.\"",
        briefing: "The dreamer is unsure whether this was a dream at all — the boundary with waking felt thin.",
        seat: "seer",
      },
    ],
  },
  {
    id: "company",
    phase: "Third Watch",
    narration: [
      "\"No one crosses the night entirely alone. Or almost no one.\"",
    ],
    question: "Who else was awake in there with you?",
    choices: [
      {
        id: "alone",
        chip: "Alone",
        label: "No one. I was alone.",
        reply: "\"Alone is a character too. It has lines of its own.\"",
        briefing: "The dreamer was alone in the dream — solitude was part of its atmosphere.",
        seat: "wanderer",
      },
      {
        id: "known",
        chip: "A borrowed face",
        label: "Someone I know — but the face was wrong.",
        reply: "\"A borrowed face. We will ask who lent it.\"",
        briefing: "A familiar person appeared, but altered or wrong-faced — a figure borrowed from waking life and changed.",
        seat: "witch",
      },
      {
        id: "crowd",
        chip: "A crowd",
        label: "Strangers. Too many to count.",
        reply: "\"A crowd in a dream is usually one feeling wearing many coats.\"",
        briefing: "The dream was crowded with strangers, which often points to how the dreamer feels seen or judged.",
        seat: "warden",
      },
      {
        id: "presence",
        chip: "Not a person",
        label: "Something that was never a person.",
        reply: "\"Good. Those are the ones that tell the truth.\"",
        briefing: "A non-human presence moved through the dream — a force or entity rather than a person.",
        seat: "hunter",
      },
    ],
  },
  {
    id: "request",
    phase: "Last Watch",
    narration: [
      "The lantern burns low. Outside, the night is thinning.",
      "\"Before dawn takes the table, name what you came for.\"",
    ],
    question: "What should the Oracle speak to?",
    choices: [
      {
        id: "warning",
        chip: "Name the warning",
        label: "Tell me what it is warning me about.",
        reply: "\"Then I will name the warning, and not soften its edges.\"",
        briefing: "The dreamer asks the Oracle to name what the dream is warning them about.",
        seat: "seer",
      },
      {
        id: "origin",
        chip: "Name the source",
        label: "Tell me which part of me sent it.",
        reply: "\"Then we go inward. Every figure in there wore your handwriting.\"",
        briefing: "The dreamer asks which part of themselves the dream came from — lean into the inner, psychological origin of the imagery.",
        seat: "witch",
      },
      {
        id: "action",
        chip: "Name the next step",
        label: "Tell me what to do when I wake.",
        reply: "\"Then the reading ends in your hands, not mine.\"",
        briefing: "The dreamer wants practical direction — weight the reading toward what to do in waking life.",
        seat: "hunter",
      },
      {
        id: "truth",
        chip: "No soft edges",
        label: "Tell me the truth, unsoftened.",
        reply: "\"As you asked. I will not decorate it.\"",
        briefing: "The dreamer explicitly asked for an unsoftened, direct reading — do not cushion the interpretation.",
        seat: "warden",
      },
    ],
  },
];

export const SEATS: Record<SeatId, Seat> = {
  seer: {
    id: "seer",
    name: "The Seer",
    line: "You came to look, not to be comforted. The night hands you what it was hiding.",
    tone: "The dreamer sits as The Seer: foreground the hidden pattern and what the dream is trying to reveal.",
  },
  witch: {
    id: "witch",
    name: "The Witch",
    line: "You carry both the wound and the remedy. Tonight you are asked which one to use.",
    tone: "The dreamer sits as The Witch: foreground the emotional root of the dream and what it asks them to heal or release.",
  },
  hunter: {
    id: "hunter",
    name: "The Hunter",
    line: "Your dream did not come to be understood. It came to be followed.",
    tone: "The dreamer sits as The Hunter: foreground momentum and the decisive move the dream is pushing toward.",
  },
  warden: {
    id: "warden",
    name: "The Warden",
    line: "Something in you stood at a door all night, keeping it shut. Ask what was on the other side.",
    tone: "The dreamer sits as The Warden: foreground what is being protected, guarded, or held back, and at what cost.",
  },
  wanderer: {
    id: "wanderer",
    name: "The Wanderer",
    line: "No map, no lantern, no promise of morning — and still you walked it to the end.",
    tone: "The dreamer sits as The Wanderer: foreground the journey, the unfamiliar territory, and where it is leading them.",
  },
};

export const RITUAL_CLOSING: string[] = [
  "The Oracle turns the lantern down until only the wick glows.",
  "\"The circle has your answers. Now give it the dream itself — every colour you can still see.\"",
];

const STEP_BY_ID = new Map(RITUAL_STEPS.map((step) => [step.id, step]));

const MAX_SCANNED_ANSWERS = 32;

/**
 * Resolves untrusted {stepId, choiceId} pairs against the table above.
 * Unknown IDs and duplicates are dropped, so nothing a client sends can reach
 * the model as free text.
 */
export const resolveRitualAnswers = (
  answers: unknown
): { step: RitualStep; choice: RitualChoice }[] => {
  if (!Array.isArray(answers)) return [];

  const seen = new Set<string>();
  const resolved: { step: RitualStep; choice: RitualChoice }[] = [];

  // One answer per step is kept, so the output is bounded by the rite itself;
  // the slice only stops us walking an absurdly long array.
  for (const entry of answers.slice(0, MAX_SCANNED_ANSWERS)) {
    if (!entry || typeof entry !== "object") continue;
    const { stepId, choiceId } = entry as Partial<RitualAnswer>;
    if (typeof stepId !== "string" || typeof choiceId !== "string") continue;
    if (seen.has(stepId)) continue;

    const step = STEP_BY_ID.get(stepId);
    const choice = step?.choices.find((c) => c.id === choiceId);
    if (!step || !choice) continue;

    seen.add(stepId);
    resolved.push({ step, choice });
  }

  return resolved;
};

/** The seat the dreamer takes, decided by which way their answers leaned. */
export const deriveSeat = (answers: RitualAnswer[]): Seat => {
  const resolved = resolveRitualAnswers(answers);
  if (resolved.length === 0) return SEATS.wanderer;

  const tally = new Map<SeatId, number>();
  for (const { choice } of resolved) {
    tally.set(choice.seat, (tally.get(choice.seat) ?? 0) + 1);
  }

  let best: SeatId = resolved[resolved.length - 1].choice.seat;
  let bestCount = tally.get(best) ?? 0;
  for (const [seat, count] of tally) {
    if (count > bestCount) {
      best = seat;
      bestCount = count;
    }
  }

  return SEATS[best];
};

/**
 * Builds the prompt fragment describing what the dreamer said during the rite.
 * Returns an empty string when the rite was skipped.
 */
export const buildRitualBriefing = (answers: unknown): string => {
  const resolved = resolveRitualAnswers(answers);
  if (resolved.length === 0) return "";

  const seat = deriveSeat(resolved.map(({ step, choice }) => ({
    stepId: step.id,
    choiceId: choice.id,
  })));

  const lines = resolved.map(({ choice }) => `- ${choice.briefing}`).join("\n");

  return [
    "Before speaking, the dreamer answered the Oracle's opening rite. Use this context to ground the reading:",
    lines,
    seat.tone,
    "Weave this context in naturally. Never quote these notes, never mention that questions were asked, and never refer to seats or rites in your output.",
  ].join("\n");
};

export interface StoredRite {
  answers: RitualAnswer[];
  completedAt: number;
  /** True when the dreamer walked past the rite instead of sitting through it. */
  skipped: boolean;
}

/** Reads the rite kept from this night, if it has not gone stale. */
export const loadRite = (): StoredRite | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(RITUAL_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<StoredRite>;
    if (typeof parsed?.completedAt !== "number") return null;
    if (Date.now() - parsed.completedAt > RITUAL_TTL_MS) {
      window.localStorage.removeItem(RITUAL_STORAGE_KEY);
      return null;
    }

    return {
      answers: resolveRitualAnswers(parsed.answers).map(({ step, choice }) => ({
        stepId: step.id,
        choiceId: choice.id,
      })),
      completedAt: parsed.completedAt,
      skipped: parsed.skipped === true,
    };
  } catch {
    return null;
  }
};

export const saveRite = (answers: RitualAnswer[], skipped = false): void => {
  if (typeof window === "undefined") return;
  try {
    const rite: StoredRite = { answers, completedAt: Date.now(), skipped };
    window.localStorage.setItem(RITUAL_STORAGE_KEY, JSON.stringify(rite));
  } catch {
    // Private browsing or a full quota — the rite simply replays next visit.
  }
};

export const clearRite = (): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(RITUAL_STORAGE_KEY);
  } catch {
    // Ignored — nothing depends on the rite being forgotten.
  }
};

/** Compact summary of a finished rite, for showing back to the dreamer. */
export const describeRite = (
  answers: RitualAnswer[]
): { seat: Seat; chips: string[] } => ({
  seat: deriveSeat(answers),
  chips: resolveRitualAnswers(answers).map(({ choice }) => choice.chip),
});
