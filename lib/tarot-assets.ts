
export const TAROT_IMAGES: Record<string, string> = {
  "The Fool": "/images/tarot/the_fool.webp",
  "The Magician": "/images/tarot/the_magician.webp",
  "The High Priestess": "/images/tarot/the_high_priestess.webp",
  "The Empress": "/images/tarot/the_empress.webp",
  "The Emperor": "/images/tarot/the_emperor.webp",
  "The Hierophant": "/images/tarot/the_hierophant.webp",
  "The Lovers": "/images/tarot/the_lovers.webp",
  "The Chariot": "/images/tarot/the_chariot.webp",
  "Strength": "/images/tarot/strength.webp",
  "The Hermit": "/images/tarot/the_hermit.webp",
  "Wheel of Fortune": "/images/tarot/wheel_of_fortune.webp",
  "Justice": "/images/tarot/justice.webp",
  "The Hanged Man": "/images/tarot/the_hanged_man.webp",
  "Death": "/images/tarot/death.webp",
  "Temperance": "/images/tarot/temperance.webp",
  "The Devil": "/images/tarot/the_devil.webp",
  "The Tower": "/images/tarot/the_tower.webp",
  "The Star": "/images/tarot/the_star.webp",
  "The Moon": "/images/tarot/the_moon.webp",
  "The Sun": "/images/tarot/the_sun.webp",
  "Judgement": "/images/tarot/judgement.webp",
  "The World": "/images/tarot/the_world.webp",
};

export const getTarotCardImage = (cardName: string): string => {
    if (!cardName) return "";
    const normalized = cardName.trim();
    return TAROT_IMAGES[normalized] || "";
};
