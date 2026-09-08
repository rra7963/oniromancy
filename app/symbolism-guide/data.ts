export interface SymbolData {
  name: string;
  category: string;
  meaning: string;
  longDescription?: string;
  jungianArchetype?: string;
  scenarios?: { scenario: string; interpretation: string }[];
  keywords?: string[];
  culturalSignificance?: string;
  emotionalResonance?: string;
}

export const symbols: SymbolData[] = [
  // Animals
  {
    name: "Snake",
    category: "Animals",
    meaning: "Transformation, healing, rebirth, or hidden threats.",
    longDescription: "Dreaming about snakes is one of the most common dream experiences. The snake represents the cycle of life, death, and rebirth (shedding skin). In Jungian psychology, it symbolizes the 'Kundalini' energy or the Shadow. A snake dream can indicate a person who cannot be trusted, or a major transformation happening in your life.",
    jungianArchetype: "The Shadow or The Self (Transformation)",
    keywords: ["snake bite", "killing a snake", "green snake", "black snake", "rattlesnake", "cobra", "serpent", "shedding skin"],
    culturalSignificance: "In Christianity, the snake is the tempter (Satan). In Hinduism, it represents Kundalini energy (divine power). In medicine, the Caduceus (two snakes) symbolizes healing.",
    emotionalResonance: "Fear, Awe, Disgust, or Intrigue.",
    scenarios: [
      { scenario: "Snake bite dream", interpretation: "A 'wake-up call' from your subconscious. You are ignoring a toxic situation or person." },
      { scenario: "Killing a snake", interpretation: "You are overcoming a fear or asserting dominance over a difficult situation." },
      { scenario: "Green snake", interpretation: "New beginnings, growth, and connection to nature/instincts." },
      { scenario: "Black snake", interpretation: "A hidden threat or deep, repressed emotional darkness." }
    ]
  },
  {
    name: "Wolf",
    category: "Animals",
    meaning: "Instinct, survival, freedom, or social connection.",
    longDescription: "Wolves in dreams bridge the gap between our civilized selves and our wild, instinctual nature. They represent appetite—for freedom, for connection, or for survival. A wolf can be a guide to the unconscious, teaching you to trust your gut feelings.",
    jungianArchetype: "The Shadow (Wild Instincts)",
    keywords: ["wolf pack", "howling wolf", "white wolf", "chased by wolf", "werewolf", "alpha wolf"],
    culturalSignificance: "In Norse mythology, Fenrir is a giant wolf. In Native American culture, the wolf is often seen as a teacher and pathfinder.",
    emotionalResonance: "Fear, Loyalty, Wildness.",
    scenarios: [
      { scenario: "Being chased by a wolf", interpretation: "You are running away from your own instincts or aggression. You fear losing control." },
      { scenario: "A friendly wolf", interpretation: "You are in harmony with your instincts. A powerful alliance is forming in your life." },
      { scenario: "A howling wolf", interpretation: "Your subconscious is crying out for attention. You may feel isolated or in need of your 'pack'." }
    ]
  },
  {
    name: "Lion",
    category: "Animals",
    meaning: "Courage, strength, royalty, and aggression.",
    longDescription: "The lion is the 'King of Beasts' and represents raw power, courage, and authority. In dreams, a lion can symbolize your own personal power or a threatening authority figure. It is related to the sun and masculine energy.",
    jungianArchetype: "The Self (Solar Aspect)",
    keywords: ["lion attack", "friendly lion", "lioness", "king of beasts", "roaring lion", "lion cage"],
    culturalSignificance: "The Lion of Judah in Christianity represents strength. In astrology, Leo is ruled by the Sun, symbolizing ego and vitality.",
    emotionalResonance: "Courage, Pride, Intimidation.",
    scenarios: [
      { scenario: "Taming a lion", interpretation: "You are successfully integrating your aggression and power into a constructive force." },
      { scenario: "Lion attacking", interpretation: "You are being overwhelmed by your own anger or a powerful external force." },
      { scenario: "Lion in a cage", interpretation: "Your power is being repressed or restricted." }
    ]
  },
  {
    name: "Cat",
    category: "Animals",
    meaning: "Feminine power, independence, spiritual protection, or deception.",
    longDescription: "Cats are symbols of independence, intuition, and the feminine principle. In ancient Egypt, they were guardians of the underworld. In dreams, they often point to your intuitive side or your relationship with women. Unlike dogs, cats are not always eager to please, representing boundaries and self-sufficiency.",
    jungianArchetype: "The Anima (Feminine Principle)",
    keywords: ["black cat", "kitten", "aggressive cat", "white cat", "talking cat", "stray cat"],
    culturalSignificance: "In Ancient Egypt, Bastet was the cat goddess of home and protection. In medieval Europe, cats were unfairly associated with witchcraft.",
    emotionalResonance: "Mystery, Comfort, or Distrust.",
    scenarios: [
      { scenario: "A black cat", interpretation: "Fear of your own intuition or superstition. Alternatively, a sign of deep psychic ability awakening." },
      { scenario: "An aggressive cat", interpretation: "You are having trouble with the feminine aspect of yourself or a female figure in your life." },
      { scenario: "A kitten", interpretation: "Vulnerability and the need for nurturing. You are developing a new sense of independence." }
    ]
  },
  {
    name: "Dog",
    category: "Animals",
    meaning: "Loyalty, friendship, protection, or betrayal.",
    longDescription: "The dog is 'man's best friend' and represents loyalty, unconditional love, and protection. However, an aggressive dog can represent a betrayal of trust or an internal conflict where you feel attacked by your own conscience.",
    jungianArchetype: "The Guardian",
    keywords: ["barking dog", "dog bite", "puppy", "lost dog", "dead dog", "playing with dog"],
    culturalSignificance: "Cerberus guarded the underworld in Greek myth. In modern culture, dogs represent faithfulness and unconditional love.",
    emotionalResonance: "Love, Safety, or Betrayal.",
    scenarios: [
      { scenario: "A barking dog", interpretation: "Someone (or your own conscience) is trying to warn you about a danger you haven't noticed." },
      { scenario: "Being bitten by a dog", interpretation: "A betrayal by a friend or a feeling of guilt is gnawing at you." },
      { scenario: "A lost dog", interpretation: "You have lost your confidence or your sense of loyalty to yourself." }
    ]
  },
  {
    name: "Owl",
    category: "Animals",
    meaning: "Wisdom, secrets, mystery, and transition.",
    longDescription: "Owls can see in the dark, making them symbols of wisdom and the ability to see what others cannot (intuition). They are also associated with death and transition in many cultures, representing the end of a cycle.",
    jungianArchetype: "The Wise Old Man / Spirit Guide",
    keywords: ["white owl", "owl hooting", "owl attacking", "night bird", "barn owl"],
    culturalSignificance: "Associated with Athena (wisdom) in Greece. In some Native American traditions, owls are omens of death or transition.",
    emotionalResonance: "Wisdom, Mystery, Unease.",
    scenarios: [
      { scenario: "Owl staring at you", interpretation: "Your subconscious is trying to make you aware of a hidden truth." },
      { scenario: "Owl hooting", interpretation: "A warning of potential danger or bad news." },
      { scenario: "Flying owl", interpretation: "Silent observation; gaining a higher perspective on a dark situation." }
    ]
  },
  {
    name: "Spider",
    category: "Animals",
    meaning: "Creativity, patience, or feeling trapped.",
    longDescription: "The spider is the weaver of destiny. It represents the creative force—spinning a web from its own body. However, it also represents the 'ensnaring mother' or feeling trapped in a sticky situation (a web of lies).",
    jungianArchetype: "The Great Mother (Dark Aspect)",
    keywords: ["spider web", "tarantula", "killing spider", "spider bite", "black widow"],
    culturalSignificance: "Grandmother Spider is a creator figure in Native American myth. In the West, often associated with fear and entrapment.",
    emotionalResonance: "Disgust, Fear, or Admiration.",
    scenarios: [
      { scenario: "Being caught in a web", interpretation: "You feel trapped by a relationship, job, or your own negative thought patterns." },
      { scenario: "A giant spider", interpretation: "A small problem has been magnified by your fear. Or, an overbearing maternal figure is dominating your thoughts." },
      { scenario: "Killing a spider", interpretation: "You are destroying something you created, or rejecting a controlling influence." }
    ]
  },
  {
    name: "Bear",
    category: "Animals",
    meaning: "Strength, introspection (hibernation), or an overwhelming mother figure.",
    longDescription: "The bear is a symbol of raw strength and the cycle of nature (hibernation). It represents the need to go inward for answers. It is also associated with the 'possessive mother' complex—warm and cuddly but potentially crushing.",
    jungianArchetype: "The Great Mother (Protective/Possessive)",
    keywords: ["grizzly bear", "polar bear", "teddy bear", "bear attack", "hibernation"],
    culturalSignificance: "In Native American lore, the bear is often a healer and protector. In alchemy, the bear represents the chaotic, primal matter.",
    emotionalResonance: "Power, Protection, Threat.",
    scenarios: [
      { scenario: "A sleeping bear", interpretation: "Latent power or a period of introspection. Let sleeping dogs (or bears) lie." },
      { scenario: "Being chased by a bear", interpretation: "You are avoiding a big, hairy problem. Often relates to an overpowering authority figure." },
      { scenario: "Fighting a bear", interpretation: "You are grappling with your own animal nature or a powerful obstacle." }
    ]
  },
  {
    name: "Bird",
    category: "Animals",
    meaning: "Freedom, spiritual aspiration, or news.",
    longDescription: "Birds are messengers of the gods. They represent the element of Air—thoughts, ideas, and the spirit. Because they can fly, they symbolize the ability to rise above earthly problems and see the 'bigger picture'.",
    jungianArchetype: "The Self (Spiritual Aspect)",
    keywords: ["flying bird", "caged bird", "dead bird", "flock of birds", "blue bird"],
    culturalSignificance: "In many religions, birds (like doves) represent the soul or the Holy Spirit.",
    emotionalResonance: "Freedom, Hope, or Limitation.",
    scenarios: [
      { scenario: "A caged bird", interpretation: "You feel restricted and unable to express your true self or ideas." },
      { scenario: "Flying with birds", interpretation: "A high degree of spiritual freedom and lucidity." },
      { scenario: "A dead bird", interpretation: "Disappointment, a loss of freedom, or the death of an idea." }
    ]
  },
  {
    name: "Eagle",
    category: "Animals",
    meaning: "Vision, power, spiritual dominance, and freedom.",
    longDescription: "The eagle flies higher than any other bird. It represents divine perspective, spiritual power, and the ability to see clearly from a distance. It is a solar symbol, linked to the conscious mind and high intellect.",
    jungianArchetype: "The Spirit / The Father",
    keywords: ["bald eagle", "eagle flying", "eagle landing", "bird of prey"],
    culturalSignificance: "Symbol of Zeus (Greek) and Jupiter (Roman). Often represents national power and spiritual authority.",
    emotionalResonance: "Power, Clarity, Dominance.",
    scenarios: [
      { scenario: "Eagle soaring", interpretation: "You are rising above mundane problems and gaining a spiritual perspective." },
      { scenario: "Eagle attacking prey", interpretation: "Decisive action; seizing an opportunity with precision." },
      { scenario: "Caged eagle", interpretation: "Your spirit is broken; you feel limited by your circumstances." }
    ]
  },
  {
    name: "Horse",
    category: "Animals",
    meaning: "Vitality, sexual energy, and power.",
    longDescription: "The horse represents physical stamina, sexual energy (libido), and the driving force of life. In psychology, the horse is the instinctual energy that the rider (the conscious ego) must learn to guide.",
    jungianArchetype: "The Libido (Life Energy)",
    keywords: ["riding horse", "white horse", "black horse", "wild horse", "falling off horse"],
    culturalSignificance: "Pegasus (winged horse) represents poetic inspiration. Horses are universal symbols of freedom and travel.",
    emotionalResonance: "Vitality, Freedom, Control.",
    scenarios: [
      { scenario: "Riding a wild horse", interpretation: "You are trying to control your passions or a chaotic situation." },
      { scenario: "Falling off a horse", interpretation: "You have lost control of your drives or ambitions." },
      { scenario: "A white horse", interpretation: "Purity, spiritual enlightenment, and success." }
    ]
  },
  {
    name: "Fish",
    category: "Animals",
    meaning: "Insights from the unconscious, fertility, and transformation.",
    longDescription: "Fish live in the water (the unconscious), so catching a fish represents bringing a hidden insight to the surface. They are also ancient symbols of fertility and Christianity (spiritual food).",
    jungianArchetype: "The Self (Content of the Unconscious)",
    keywords: ["catching fish", "eating fish", "goldfish", "swimming fish", "dead fish"],
    culturalSignificance: "The Ichthys is a symbol of Christ. In China, fish symbolize abundance and wealth.",
    emotionalResonance: "Insight, Abundance, Unease.",
    scenarios: [
      { scenario: "Catching a big fish", interpretation: "You have gained a significant insight or 'caught' a big opportunity." },
      { scenario: "Fish out of water", interpretation: "You feel uncomfortable and out of your element." },
      { scenario: "Eating fish", interpretation: "You are integrating new spiritual or emotional nourishment." }
    ]
  },
  {
    name: "Butterfly",
    category: "Animals",
    meaning: "Metamorphosis, social success, and the soul.",
    longDescription: "The butterfly is the ultimate symbol of transformation. It starts as a crawling caterpillar, enters the tomb of the cocoon, and emerges as a flying creature. It represents the soul's journey and the ability to change.",
    jungianArchetype: "The Soul (Psyche)",
    keywords: ["monarch butterfly", "cocoon", "caterpillar", "colorful butterfly"],
    culturalSignificance: "In Greek, 'Psyche' means both soul and butterfly. It represents the soul's rebirth.",
    emotionalResonance: "Joy, Hope, Transformation.",
    scenarios: [
      { scenario: "A butterfly landing on you", interpretation: "A blessing, good luck, or a validation of your personal growth." },
      { scenario: "Catching a butterfly", interpretation: "You are trying to possess something beautiful that is meant to be free (like a relationship)." },
      { scenario: "A dead butterfly", interpretation: "Unrealized potential or the end of a beautiful phase." }
    ]
  },
  {
    name: "Rabbit",
    category: "Animals",
    meaning: "Fertility, abundance, fear, and speed.",
    longDescription: "Rabbits are famous for their reproductive speed, making them symbols of abundance and fertility. However, they are also prey animals, representing timidity and fear. 'Going down the rabbit hole' suggests entering the unknown.",
    jungianArchetype: "The Trickster (sometimes) / Fertility",
    keywords: ["white rabbit", "bunny", "chasing rabbit", "rabbit hole"],
    culturalSignificance: "Associated with Easter and spring (rebirth). In folklore, the rabbit is often a trickster figure.",
    emotionalResonance: "Anxiety, Playfulness, Fertility.",
    scenarios: [
      { scenario: "Chasing a rabbit", interpretation: "You are pursuing a fleeting idea or opportunity." },
      { scenario: "Rabbit hiding", interpretation: "You are afraid to face a challenge; avoidance." },
      { scenario: "White rabbit", interpretation: "A guide into the subconscious (like in Alice in Wonderland)." }
    ]
  },
  {
    name: "Shark",
    category: "Animals",
    meaning: "Danger, aggression, and deep emotional fear.",
    longDescription: "Sharks are predators of the deep (the unconscious). They represent a ruthless, unfeeling threat. Unlike a wolf (hot aggression), a shark is cold aggression. It can symbolize a fear of being devoured by your own emotions or a hostile environment.",
    jungianArchetype: "The Shadow (Devouring)",
    keywords: ["shark attack", "swimming with sharks", "great white shark", "ocean danger"],
    culturalSignificance: "In Polynesian culture, sharks can be guardian spirits, but generally represent danger in the deep.",
    emotionalResonance: "Terror, Vulnerability, Panic.",
    scenarios: [
      { scenario: "Shark attack", interpretation: "You feel attacked by a powerful, unfeeling force or person." },
      { scenario: "Swimming with sharks", interpretation: "You are in a dangerous environment but handling it calmly." },
      { scenario: "Shark fin", interpretation: "A warning of approaching danger." }
    ]
  },
  {
    name: "Ants",
    category: "Animals",
    meaning: "Hard work, annoyance, or feeling insignificant.",
    longDescription: "Ants are industrious but can be pests. Dreaming of them often represents the small, nagging annoyances of daily life. Alternatively, it can represent hard work, community, and conformity.",
    jungianArchetype: "Collective Instinct",
    keywords: ["ant hill", "red ants", "ants crawling", "killing ants", "insect infestation"],
    culturalSignificance: "Proverbs often cite the ant as a model of wisdom and preparation (Aesop's Fables).",
    emotionalResonance: "Annoyance, Diligence, Insignificance.",
    scenarios: [
      { scenario: "Ants crawling on you", interpretation: "Something is 'getting under your skin'; minor annoyances are overwhelming you." },
      { scenario: "Ant hill", interpretation: "Productivity, organization, or feeling like just another worker." },
      { scenario: "Killing ants", interpretation: "You are trying to eliminate small stressors from your life." }
    ]
  },
  {
    name: "Rats",
    category: "Animals",
    meaning: "Betrayal, disease, or resourcefulness.",
    longDescription: "Rats are often seen as pests or carriers of disease. Dreaming of them can represent a fear of betrayal ('smelling a rat') or feelings of unworthiness. However, rats are also incredibly intelligent survivors, representing resourcefulness in hard times.",
    jungianArchetype: "The Shadow (Scavenger)",
    keywords: ["dead rat", "killing rats", "rat bite", "mouse", "vermin"],
    culturalSignificance: "In the Chinese Zodiac, the Rat is the first animal, symbolizing wit and wealth. In the West, often associated with plague and filth.",
    emotionalResonance: "Disgust, Fear, Suspicion.",
    scenarios: [
      { scenario: "Rats biting you", interpretation: "Someone you trust may be betraying you, or guilt is gnawing at you." },
      { scenario: "Dead rat", interpretation: "A betrayal has been exposed, or a period of sneakiness is ending." },
      { scenario: "Pet rat", interpretation: "You are befriending your shadow side or accepting a 'reject' part of yourself." }
    ]
  },
  {
    name: "Cockroaches",
    category: "Animals",
    meaning: "Resilience, filth, or hidden problems.",
    longDescription: "Cockroaches are survivors. They hide in the dark and multiply. Dreaming of them suggests there are unclean thoughts or hidden problems in your life that you are afraid to uncover. They also represent resilience—problems that just won't die.",
    jungianArchetype: "The Shadow (Unclean)",
    keywords: ["killing cockroach", "bug infestation", "roaches", "insects"],
    culturalSignificance: "Universally reviled as pests, but biologically respected for their survival skills.",
    emotionalResonance: "Revulsion, Anxiety, Persistence.",
    scenarios: [
      { scenario: "Cockroaches scattering", interpretation: "You are trying to hide your bad habits or secrets from the light." },
      { scenario: "Infestation", interpretation: "Your mind is cluttered with negative thoughts or anxiety." },
      { scenario: "Killing a cockroach", interpretation: "You are trying to 'clean up' your life or eliminate a persistent problem." }
    ]
  },

  // Nature & Elements
  {
    name: "Water",
    category: "Nature",
    meaning: "Emotions, the subconscious, and intuition.",
    longDescription: "Water is the universal symbol for emotions and the unconscious mind. Its state in the dream reflects your emotional state. Is it clear or muddy? Calm or stormy? Deep or shallow?",
    jungianArchetype: "The Unconscious",
    keywords: ["ocean", "river", "swimming", "drowning", "flood", "clear water"],
    culturalSignificance: "Water is essential for life and baptism (purification) in many religions. It represents the flow of the Tao.",
    emotionalResonance: "Peace, Fear, Depth.",
    scenarios: [
      { scenario: "Drowning", interpretation: "You are overwhelmed by emotions or a situation you cannot control." },
      { scenario: "Swimming calmly", interpretation: "You are at peace with your emotions and navigating life's currents well." },
      { scenario: "A tidal wave", interpretation: "A massive emotional upheaval is coming or has happened." }
    ]
  },
  {
    name: "Fire",
    category: "Nature",
    meaning: "Passion, destruction, purification, or anger.",
    longDescription: "Fire transforms everything it touches. It can warm you (passion, energy) or burn you (anger, destruction). It is the element of will and action. Alchemically, it represents purification.",
    jungianArchetype: "Transformation / Energy",
    keywords: ["house fire", "burning", "campfire", "flame", "smoke"],
    culturalSignificance: "Prometheus stole fire for humanity. It represents civilization, but also hellfire.",
    emotionalResonance: "Passion, Anger, Danger.",
    scenarios: [
      { scenario: "House on fire", interpretation: "A complete transformation of the self, or a destructive rage consuming your life." },
      { scenario: "Lighting a fire", interpretation: "You are initiating a new project or relationship; sparking creativity." },
      { scenario: "Being burned", interpretation: "You are playing with dangerous emotions or a risky situation." }
    ]
  },
  {
    name: "Tree",
    category: "Nature",
    meaning: "Growth, connection, stability, and the self.",
    longDescription: "Trees represent the structure of the self. The roots are the unconscious/past, the trunk is the conscious life, and the branches are aspirations/future. The Tree of Life connects heaven and earth.",
    jungianArchetype: "The Self / Axis Mundi",
    keywords: ["climbing tree", "falling tree", "forest", "roots", "leaves"],
    culturalSignificance: "Yggdrasil (World Tree) in Norse myth. The Bodhi Tree in Buddhism.",
    emotionalResonance: "Stability, Growth, Connection.",
    scenarios: [
      { scenario: "Climbing a tree", interpretation: "Ambition; striving for a higher position or perspective." },
      { scenario: "Falling tree", interpretation: "Loss of stability or security; an era is ending." },
      { scenario: "Dead tree", interpretation: "Infertility, lack of growth, or feeling emotionally drained." }
    ]
  },
  {
    name: "Moon",
    category: "Nature",
    meaning: "Femininity, mystery, cycles, and the unconscious.",
    longDescription: "The moon rules the tides and the night. It represents the feminine principle (Yin), intuition, and things that are hidden. It reflects the sun's light, symbolizing how we reflect on our inner world.",
    jungianArchetype: "The Anima / The Mother",
    keywords: ["full moon", "crescent moon", "moonlight", "eclipse"],
    culturalSignificance: "Associated with goddesses like Artemis and Selene. Rules the emotional tides in astrology.",
    emotionalResonance: "Mystery, Calm, Madness.",
    scenarios: [
      { scenario: "Full moon", interpretation: "Illumination, height of power, or 'lunacy' (emotional instability)." },
      { scenario: "Eclipse", interpretation: "A feminine aspect of yourself is being overshadowed or hidden." },
      { scenario: "Two moons", interpretation: "Confusion, duality, or being pulled in two emotional directions." }
    ]
  },
  {
    name: "Sun",
    category: "Nature",
    meaning: "Masculinity, consciousness, clarity, and success.",
    longDescription: "The sun is the source of life and light. It represents the masculine principle (Yang), the conscious ego, and clarity. It chases away the shadows of fear and doubt.",
    jungianArchetype: "The Father / The Ego",
    keywords: ["sunrise", "sunset", "sunshine", "bright sun"],
    culturalSignificance: "Ra (Egypt) and Apollo (Greece). The center of the solar system, representing the Self.",
    emotionalResonance: "Joy, Clarity, Energy.",
    scenarios: [
      { scenario: "Sunrise", interpretation: "New beginnings, hope, and awakening." },
      { scenario: "Sunset", interpretation: "Closure, the end of a cycle, or rest." },
      { scenario: "Sunburn", interpretation: "You are overexposed or 'burnt out' from too much conscious effort." }
    ]
  },
  {
    name: "Forest",
    category: "Nature",
    meaning: "The unknown, the unconscious mind, and exploration.",
    longDescription: "In fairy tales, the hero must always enter the dark forest to find their destiny. The forest represents the unconscious mind—full of life but dark and confusing. It is a place of testing and initiation.",
    jungianArchetype: "The Unconscious Realm",
    keywords: ["lost in forest", "woods", "dark forest", "jungle"],
    culturalSignificance: "The setting for many Grimm's fairy tales (Hansel and Gretel). A place of magic and danger.",
    emotionalResonance: "Fear, Mystery, Enchantment.",
    scenarios: [
      { scenario: "Lost in a forest", interpretation: "You are confused about your path in life or lost in your own thoughts." },
      { scenario: "Finding a clearing", interpretation: "A moment of clarity or sanctuary amidst confusion." },
      { scenario: "Scary forest", interpretation: "You are afraid to explore your own hidden depths." }
    ]
  },
  {
    name: "Mountain",
    category: "Nature",
    meaning: "Obstacles, ambition, and spiritual ascent.",
    longDescription: "Mountains represent the highest aspirations of humanity. Climbing one is hard work, representing the struggle to achieve a goal. Standing at the peak represents higher consciousness and success.",
    jungianArchetype: "The Ascent / The Goal",
    keywords: ["climbing mountain", "falling off mountain", "snowy mountain", "peak"],
    culturalSignificance: "Mount Olympus, Mount Sinai. Places where humans meet the divine.",
    emotionalResonance: "Awe, Struggle, Achievement.",
    scenarios: [
      { scenario: "Climbing a mountain", interpretation: "You are working hard toward a goal. The steepness reflects the difficulty." },
      { scenario: "Falling from a mountain", interpretation: "Fear of failure or a sudden setback in your career/status." },
      { scenario: "Ideally beautiful mountain", interpretation: "A spiritual vision or a lofty ideal you are striving for." }
    ]
  },
  {
    name: "Ocean",
    category: "Nature",
    meaning: "The vast collective unconscious, infinite possibilities, or chaos.",
    longDescription: "Unlike a river or lake, the ocean is boundless. It represents the Collective Unconscious—the shared history of all humanity. It is the primordial soup of life, terrifyingly deep and infinitely wide.",
    jungianArchetype: "The Collective Unconscious",
    keywords: ["sea", "waves", "beach", "tide", "underwater"],
    culturalSignificance: "The origin of all life. Poseidon/Neptune rules the deep.",
    emotionalResonance: "Vastness, Overwhelm, Peace.",
    scenarios: [
      { scenario: "Stormy ocean", interpretation: "You are at the mercy of powerful collective forces or deep emotional trauma." },
      { scenario: "Floating on the ocean", interpretation: "Trusting the flow of life and surrendering control." },
      { scenario: "Deep sea diving", interpretation: "You are bravely exploring the deepest parts of your psyche." }
    ]
  },
  {
    name: "Storm",
    category: "Nature",
    meaning: "Conflict, release of tension, and sudden change.",
    longDescription: "Storms are violent but often necessary to clear the air. They represent a buildup of emotional tension that must be released. Lightning represents a flash of insight that strikes suddenly.",
    jungianArchetype: "Catharsis",
    keywords: ["thunderstorm", "lightning", "hurricane", "rain storm"],
    culturalSignificance: "Associated with wrath of gods (Thor, Zeus).",
    emotionalResonance: "Tension, Release, Fear.",
    scenarios: [
      { scenario: "Chasing a storm", interpretation: "You are attracted to drama or chaos." },
      { scenario: "Hiding from a storm", interpretation: "You are avoiding a necessary conflict or emotional release." },
      { scenario: "After the storm", interpretation: "Peace, clarity, and a fresh start after a crisis." }
    ]
  },
  {
    name: "Tornado",
    category: "Nature",
    meaning: "Destructive emotional outbursts, chaos, and lack of control.",
    longDescription: "A tornado is a focused column of destructive energy. It usually represents a specific situation or emotion spinning out of control in your waking life. Unlike a general storm, a tornado is a targeted threat.",
    jungianArchetype: "Destructive Force",
    keywords: ["twister", "funnel cloud", "tornado warning", "storm shelter"],
    culturalSignificance: "A symbol of sudden, unavoidable disaster (Wizard of Oz).",
    emotionalResonance: "Panic, Helplessness, Chaos.",
    scenarios: [
      { scenario: "Watching a tornado from afar", interpretation: "You are aware of a destructive situation but feel safe for now." },
      { scenario: "Caught in a tornado", interpretation: "You feel overwhelmed by emotions or external events; loss of control." },
      { scenario: "Multiple tornadoes", interpretation: "You are facing threats from multiple directions; high stress." }
    ]
  },
  {
    name: "Tsunami",
    category: "Nature",
    meaning: "Overwhelming emotions, life changes, or fear of the unknown.",
    longDescription: "A tsunami or tidal wave represents a massive emotional upheaval. Unlike a regular storm, it is an unstoppable force of nature, often symbolizing a repressed emotion that has built up to a breaking point. It suggests you are being 'swept away' by life events or your own feelings.",
    jungianArchetype: "The Unconscious (Destructive Aspect)",
    keywords: ["tidal wave", "flood", "giant wave", "running from water"],
    culturalSignificance: "Represents the overwhelming power of nature vs humanity.",
    emotionalResonance: "Overwhelm, Terror, Awe.",
    scenarios: [
      { scenario: "Running from a tsunami", interpretation: "You are trying to escape a major life change or emotional breakdown." },
      { scenario: "Watching a tsunami hit", interpretation: "You feel helpless witnessing a disaster in your life or society." },
      { scenario: "Surviving a tsunami", interpretation: "You have the resilience to withstand a major crisis." }
    ]
  },
  {
    name: "Ice",
    category: "Nature",
    meaning: "Frozen emotions, stagnation, and isolation.",
    longDescription: "Ice is water (emotion) that has become solid and cold. It represents suppressed feelings, a cold relationship, or a situation that is 'frozen' and not moving.",
    jungianArchetype: "Stagnation",
    keywords: ["freezing", "snow", "icicles", "frozen lake"],
    culturalSignificance: "Dante's lowest circle of hell is ice, representing the total lack of love.",
    emotionalResonance: "Coldness, Isolation, Stasis.",
    scenarios: [
      { scenario: "Walking on thin ice", interpretation: "You are in a precarious situation; danger of emotional breakthrough." },
      { scenario: "Ice melting", interpretation: "You are beginning to open up emotionally; a thaw in relations." },
      { scenario: "Trapped in ice", interpretation: "You feel emotionally paralyzed or numb." }
    ]
  },
  {
    name: "Rain",
    category: "Nature",
    meaning: "Sadness, cleansing, and fertility.",
    longDescription: "Rain is water falling from the heavens. It can represent tears (sadness) or cleansing (washing away the old). It is also necessary for growth (fertility).",
    jungianArchetype: "Cleansing / Grief",
    keywords: ["raining", "storm", "wet", "umbrella"],
    culturalSignificance: "Rain is often seen as a blessing for crops, but also represents gloom/depression.",
    emotionalResonance: "Sadness, Relief, Refreshment.",
    scenarios: [
      { scenario: "Walking in rain", interpretation: "You are letting yourself feel your emotions; washing away stress." },
      { scenario: "Heavy storm", interpretation: "Overwhelming grief or emotional turbulence." },
      { scenario: "Rainbow after rain", interpretation: "Hope and promise after a difficult emotional time." }
    ]
  },
  {
    name: "Rainbow",
    category: "Nature",
    meaning: "Hope, promise, and the bridge between worlds.",
    longDescription: "The rainbow appears after the storm. It is a bridge between heaven and earth. In dreams, it is a universally positive symbol of hope, spiritual connection, and the end of troubles.",
    jungianArchetype: "The Bridge",
    keywords: ["colors", "pot of gold", "double rainbow", "sky"],
    culturalSignificance: "In the Bible, God's covenant with Noah. In Norse myth, the Bifrost bridge.",
    emotionalResonance: "Hope, Joy, Wonder.",
    scenarios: [
      { scenario: "Double rainbow", interpretation: "Exceptional good luck and spiritual harmony." },
      { scenario: "Touching a rainbow", interpretation: "A miraculous realization or achieving an impossible goal." },
      { scenario: "Fading rainbow", interpretation: "A fleeting hope or missed opportunity." }
    ]
  },
  {
    name: "Earthquake",
    category: "Nature",
    meaning: "Instability, sudden change, and shaking foundations.",
    longDescription: "An earthquake shakes the very ground you stand on. It symbolizes a major threat to your stability—financial, emotional, or familial. It suggests that your 'foundation' is not as solid as you thought.",
    jungianArchetype: "Destruction / Rebuilding",
    keywords: ["tremor", "ground shaking", "aftershock", "rubble"],
    culturalSignificance: "A sign of divine anger or earth changes in many myths.",
    emotionalResonance: "Instability, Fear, Insecurity.",
    scenarios: [
      { scenario: "House shaking", interpretation: "Your family life or personal identity is under threat." },
      { scenario: "Ground opening up", interpretation: "Fear of being swallowed by a situation; total loss of security." },
      { scenario: "Aftershocks", interpretation: "The lingering effects of a recent trauma or change." }
    ]
  },

  // Body
  {
    name: "Teeth Falling Out",
    category: "Body",
    meaning: "Anxiety about appearance, communication issues, or powerlessness.",
    longDescription: "This is one of the most common dream motifs. Freud linked it to castration anxiety (loss of power). Jung linked it to birthing/change (teeth fall out so new ones can grow). Modern interpretations focus on anxiety about how others perceive you or regret over words spoken.",
    jungianArchetype: "Transition / Loss of Persona",
    keywords: ["teeth crumbling", "spitting out teeth", "losing teeth", "dentist", "rotten teeth", "bloody teeth"],
    culturalSignificance: "In many cultures, losing teeth is associated with death or illness in the family. Psychologically, it is linked to the loss of youthful vigor or potency.",
    emotionalResonance: "Panic, Shame, Helplessness.",
    scenarios: [
      { scenario: "Crumbling teeth", interpretation: "You feel your self-image is falling apart; loss of confidence." },
      { scenario: "Spitting out teeth", interpretation: "You said something you regret and want to take back." },
      { scenario: "Pulling out a loose tooth", interpretation: "You are ready to let go of something that is no longer serving you." }
    ]
  },
  {
    name: "Pregnancy",
    category: "Body",
    meaning: "New ideas, creativity, growth, and potential.",
    longDescription: "Dreaming of being pregnant is rarely about a literal baby. It symbolizes a 'gestation' period for a new idea, project, or career path. Something new is growing inside you that is not yet ready to be born into the world.",
    jungianArchetype: "Creation / Rebirth",
    keywords: ["pregnant belly", "baby bump", "giving birth", "pregnancy test"],
    culturalSignificance: "Symbol of fertility and the miracle of life.",
    emotionalResonance: "Anticipation, Anxiety, Creativity.",
    scenarios: [
      { scenario: "Positive pregnancy test", interpretation: "Confirmation that a new phase of life is beginning." },
      { scenario: "Giving birth", interpretation: "The realization of a project or idea; hard work paying off." },
      { scenario: "Someone else pregnant", interpretation: "You are noticing growth or change in someone close to you." }
    ]
  },
  {
    name: "Naked in Public",
    category: "Body",
    meaning: "Vulnerability, shame, or a desire for transparency.",
    longDescription: "Clothes represent our 'Persona'—the mask we wear for society. Being naked means the mask is gone. If you feel ashamed, you fear being 'found out' or exposed. If you feel free, you desire authenticity and have nothing to hide.",
    jungianArchetype: "The Persona (Stripped)",
    keywords: ["nudity", "no clothes", "exposed", "embarrassment"],
    culturalSignificance: "The story of The Emperor's New Clothes addresses the fear of exposure and truth.",
    emotionalResonance: "Shame, Vulnerability, Freedom.",
    scenarios: [
      { scenario: "Naked at work/school", interpretation: "Imposter syndrome; fear that you are unprepared or unqualified." },
      { scenario: "Nobody notices you are naked", interpretation: "Your fears are unfounded; people are not judging you as harshly as you think." },
      { scenario: "Enjoying being naked", interpretation: "A desire for freedom from social constraints." }
    ]
  },
  {
    name: "Hair",
    category: "Body",
    meaning: "Strength, virility, and thoughts.",
    longDescription: "Hair grows from the head, symbolizing thoughts and ideas. It is also linked to Samson—strength and virility. Changes to hair represent changes to your identity or way of thinking.",
    jungianArchetype: "Mental Energy",
    keywords: ["haircut", "losing hair", "long hair", "baldness", "shaving"],
    culturalSignificance: "Samson lost his strength when his hair was cut. Monks shave heads to symbolize renouncing worldly ego.",
    emotionalResonance: "Vanity, Loss, Renewal.",
    scenarios: [
      { scenario: "Cutting hair", interpretation: "A desire for change, or a feeling of loss of power/strength." },
      { scenario: "Hair falling out", interpretation: "Fear of aging, loss of appeal, or feeling 'weak'." },
      { scenario: "Washing hair", interpretation: "Clearing your mind; getting rid of old thoughts." }
    ]
  },
  {
    name: "Hands",
    category: "Body",
    meaning: "Agency, capability, and connection.",
    longDescription: "Hands are how we manipulate the world. They represent our ability to 'handle' life. They also represent connection (holding hands) or aggression (fists).",
    jungianArchetype: "Agency",
    keywords: ["washing hands", "holding hands", "fist", "injured hand"],
    culturalSignificance: "Pilate washing his hands (absolving guilt). Hamsa hand (protection).",
    emotionalResonance: "Capability, Guilt, Connection.",
    scenarios: [
      { scenario: "Tied hands", interpretation: "Helplessness; you feel unable to act in a situation." },
      { scenario: "Washing hands", interpretation: "Guilt (Lady Macbeth); trying to absolve yourself of responsibility." },
      { scenario: "Giant hands", interpretation: "You feel capable and ready to tackle big tasks." }
    ]
  },
  {
    name: "Eyes",
    category: "Body",
    meaning: "Perception, judgment, and enlightenment.",
    longDescription: "Eyes are the windows to the soul. They represent how we see the world and how the world sees us. Blindness represents a refusal to see the truth.",
    jungianArchetype: "Consciousness",
    keywords: ["blindness", "staring", "blue eyes", "third eye"],
    culturalSignificance: "Eye of Horus (protection). The All-Seeing Eye (divine providence).",
    emotionalResonance: "Clarity, Fear of Judgment, Insight.",
    scenarios: [
      { scenario: "Losing an eye", interpretation: "Your perspective is damaged; you are only seeing half the picture." },
      { scenario: "Third eye", interpretation: "Spiritual awakening and intuition." },
      { scenario: "Being watched", interpretation: "Paranoia or a feeling of guilt/judgment." }
    ]
  },
  {
    name: "Blood",
    category: "Body",
    meaning: "Life force, energy, pain, or sacrifice.",
    longDescription: "Blood is the essence of life. Losing it means losing energy. Seeing it can be shocking, representing emotional pain or a physical warning. In women, it is tied to fertility cycles.",
    jungianArchetype: "Life Essence",
    keywords: ["bleeding", "wound", "red blood", "menstruation"],
    culturalSignificance: "Blood covenants. The Holy Grail (Sangreal). Symbol of sacrifice and family lineage.",
    emotionalResonance: "Shock, Vitality, Pain.",
    scenarios: [
      { scenario: "Bleeding wound", interpretation: "You are emotionally hurt and 'leaking' energy." },
      { scenario: "Blood on hands", interpretation: "Guilt; feeling responsible for something bad." },
      { scenario: "Drinking blood", interpretation: "A desperate need for vitality or strength." }
    ]
  },
  {
    name: "Vomit",
    category: "Body",
    meaning: "Rejection, disgust, or purging negativity.",
    longDescription: "Vomiting is a violent rejection of something you have swallowed. In dreams, it represents the need to 'purge' a toxic emotion, belief, or experience. You are getting rid of something that is making you sick. It is unpleasant but healing.",
    jungianArchetype: "Purgation",
    keywords: ["throwing up", "sick", "nausea", "purging"],
    culturalSignificance: "Associated with sickness but also spiritual cleansing (ayahuasca ceremonies).",
    emotionalResonance: "Disgust, Relief, Sickness.",
    scenarios: [
      { scenario: "Vomiting uncontrollably", interpretation: "You have held in negative feelings for too long and they are forcing their way out." },
      { scenario: "Seeing someone vomit", interpretation: "You are disgusted by someone else's behavior or 'toxic' energy." },
      { scenario: "Feeling better after vomiting", interpretation: "A sign of relief and cleansing after a difficult period." }
    ]
  },

  // Actions
  {
    name: "Falling",
    category: "Actions",
    meaning: "Loss of control, insecurity, or fear of failure.",
    longDescription: "Falling dreams are a sign of insecurity and anxiety. You may feel like you are losing control of a situation in your career or relationship. The sensation often wakes you up (hypnic jerk). It asks: Where in your life do you lack support?",
    jungianArchetype: "Loss of Ego Control",
    keywords: ["falling down", "falling from height", "tripping", "cliff"],
    culturalSignificance: "The Fall of Man (loss of innocence). Lucifer falling from heaven.",
    emotionalResonance: "Panic, Insecurity, Shock.",
    scenarios: [
      { scenario: "Falling endlessly", interpretation: "You feel completely out of control and unsupported in waking life." },
      { scenario: "Landing safely", interpretation: "You will overcome your current difficulties; resilience." },
      { scenario: "Falling from building", interpretation: "Fear of losing your social status or reputation." }
    ]
  },
  {
    name: "Flying",
    category: "Actions",
    meaning: "Freedom, liberation, and rising above problems.",
    longDescription: "Flying is the ultimate wish-fulfillment dream. It represents breaking free from gravity (earthly burdens). If you are flying, you feel empowered and capable. It can also suggest a desire to escape reality.",
    jungianArchetype: "Transcendence",
    keywords: ["floating", "levitation", "superman", "wings"],
    culturalSignificance: "Icarus flew too close to the sun (hubris). Angels and deities fly.",
    emotionalResonance: "Euphoria, Freedom, Power.",
    scenarios: [
      { scenario: "Trouble staying in air", interpretation: "You lack confidence in your new plans or freedom." },
      { scenario: "Flying high", interpretation: "Euphoria, success, and a higher perspective on life." },
      { scenario: "Being chased while flying", interpretation: "You are trying to rise above a problem that keeps dragging you down." }
    ]
  },
  {
    name: "Running Away",
    category: "Actions",
    meaning: "Avoidance, fear, and escaping responsibility.",
    longDescription: "Dreaming of running away suggests you are avoiding a confrontation or a difficult emotion in your waking life. The pursuer—whether a monster, a killer, or a shadow—usually represents a rejected part of yourself (your Shadow) or a responsibility you are refusing to face. Instead of running, Jungian psychology suggests turning around to face the pursuer to integrate its energy.",
    jungianArchetype: "The Shadow (Avoidance)",
    keywords: ["chase dream", "being chased", "fleeing", "escaping", "pursuit"],
    culturalSignificance: "A universal anxiety theme. The 'fight or flight' response activated in sleep.",
    emotionalResonance: "Anxiety, Fear, Desperation.",
    scenarios: [
      { scenario: "Running in slow motion", interpretation: "Frustration; you feel unable to make progress or escape a situation. A common anxiety dream." },
      { scenario: "Running away from someone", interpretation: "You are avoiding a specific relationship issue or an aspect of your own personality that this person represents." },
      { scenario: "Running from a killer", interpretation: "You are 'killing off' a vital part of your own potential by ignoring it. The killer is a radical demand for change." },
      { scenario: "Running away from home", interpretation: "A desire for independence or a feeling that your current environment no longer supports your growth." },
      { scenario: "Running from an animal", interpretation: "You are avoiding your own natural instincts or primal emotions (anger, lust, hunger)." }
    ]
  },
  {
    name: "Running Towards",
    category: "Actions",
    meaning: "Ambition, desire, and pursuing a goal.",
    longDescription: "Running towards something represents drive and determination. You have a clear goal in sight. The ease of the run reflects your confidence.",
    jungianArchetype: "The Quest",
    keywords: ["sprinting", "race", "hurrying", "catching"],
    culturalSignificance: "The Marathon. Life as a race.",
    emotionalResonance: "Determination, Urgency, Competitiveness.",
    scenarios: [
      { scenario: "Running a race", interpretation: "You feel competitive or compared to others." },
      { scenario: "Running to catch someone", interpretation: "Fear of abandonment or missed connection." },
      { scenario: "Running effortlessly", interpretation: "You are in the 'flow' state; things are going well." }
    ]
  },
  {
    name: "Exam",
    category: "Actions",
    meaning: "Performance anxiety, fear of judgment, and self-worth.",
    longDescription: "Exam dreams are very common among high-achievers. They represent a fear of being tested or judged in waking life. Often, they occur when you feel unprepared for a challenge at work or in a relationship.",
    jungianArchetype: "The Judge / The Critic",
    keywords: ["test", "failing exam", "unprepared", "school test", "late for exam"],
    culturalSignificance: "Reflects the modern pressure of education and standardized testing as a measure of worth.",
    emotionalResonance: "Anxiety, Inadequacy, Stress.",
    scenarios: [
      { scenario: "Unprepared for exam", interpretation: "You feel unprepared for a current challenge; fear of being exposed as a fraud." },
      { scenario: "Late for exam", interpretation: "You feel you are missing an opportunity or running out of time." },
      { scenario: "Cannot find exam room", interpretation: "You are unsure of what is expected of you." }
    ]
  },
  {
    name: "Dying",
    category: "Actions",
    meaning: "Endings, transformation, and new beginnings.",
    longDescription: "Death in dreams is rarely literal. It represents the death of the OLD so the NEW can be born. It is a symbol of transition—graduation, marriage, a new job all involve the 'death' of a previous state.",
    jungianArchetype: "Rebirth",
    keywords: ["death", "funeral", "dying in dream", "dead body"],
    culturalSignificance: "The Tarot 'Death' card signifies transformation, not physical death.",
    emotionalResonance: "Grief, Acceptance, Peace.",
    scenarios: [
      { scenario: "Your own death", interpretation: "You are undergoing a major personal transformation." },
      { scenario: "Death of a parent", interpretation: "You are becoming more independent; cutting the cord." },
      { scenario: "Talking to dead people", interpretation: "Seeking wisdom from the past or unresolved grief." }
    ]
  },
  {
    name: "Killing",
    category: "Actions",
    meaning: "Repressed anger or the need to eliminate a trait in yourself.",
    longDescription: "Killing is an act of extreme aggression. In dreams, the victim usually represents a part of yourself you want to get rid of. Killing a monster is a heroic act of overcoming fear.",
    jungianArchetype: "Shadow Integration",
    keywords: ["murder", "fighting", "violence", "weapon"],
    culturalSignificance: "The Hero slaying the Dragon is a classic myth of overcoming the lower self.",
    emotionalResonance: "Anger, Guilt, Power.",
    scenarios: [
      { scenario: "Killing a stranger", interpretation: "You are trying to repress a part of your shadow side." },
      { scenario: "Killing in self-defense", interpretation: "You are standing up for yourself against internal or external threats." },
      { scenario: "Witnessing a murder", interpretation: "You feel helpless about a change or loss happening around you." }
    ]
  },
  {
    name: "Searching",
    category: "Actions",
    meaning: "Seeking answers, identity, or a missing part of oneself.",
    longDescription: "Searching implies something is missing. It is the quest for wholeness. What you are searching for gives the clue—keys (answers), money (worth), or a person (connection).",
    jungianArchetype: "The Seeker",
    keywords: ["lost item", "looking for something", "quest", "missing person"],
    culturalSignificance: "The Quest for the Holy Grail. The search for truth.",
    emotionalResonance: "Frustration, Hope, Curiosity.",
    scenarios: [
      { scenario: "Searching for a room", interpretation: "Looking for a new aspect of your personality or potential." },
      { scenario: "Searching for a lost child", interpretation: "Trying to recover your innocence or creativity." },
      { scenario: "Searching endlessly", interpretation: "Frustration and lack of direction in waking life." }
    ]
  },
  {
    name: "Driving",
    category: "Actions",
    meaning: "Control over one's life path.",
    longDescription: "The car is your vehicle through life. Driving it represents how you are managing your life path. Are you in the driver's seat, or is someone else?",
    jungianArchetype: "Ego Control",
    keywords: ["driving car", "road trip", "steering", "brakes"],
    culturalSignificance: "Cars are modern symbols of status and autonomy.",
    emotionalResonance: "Control, Freedom, Anxiety.",
    scenarios: [
      { scenario: "Brakes not working", interpretation: "You feel your life is spiraling out of control." },
      { scenario: "Someone else driving", interpretation: "You are letting others make decisions for you." },
      { scenario: "Lost while driving", interpretation: "You are unsure of your goals or direction." }
    ]
  },
  {
    name: "Kissing",
    category: "Actions",
    meaning: "Integration, acceptance, and union.",
    longDescription: "Kissing represents a desire for union. Kissing someone of the opposite sex often represents the integration of the Anima (feminine) and Animus (masculine). It signifies accepting the qualities that person represents.",
    jungianArchetype: "Union / Coniunctio",
    keywords: ["making out", "romance", "love", "intimacy"],
    culturalSignificance: "The 'Kiss of Peace'. A symbol of betrayal (Judas) or love (Romeo & Juliet).",
    emotionalResonance: "Love, Desire, Discomfort.",
    scenarios: [
      { scenario: "Kissing a stranger", interpretation: "You are accepting a new or hidden part of yourself." },
      { scenario: "Kissing an enemy", interpretation: "Reconciliation with a conflicting part of your psyche; forgiveness." },
      { scenario: "Unwanted kiss", interpretation: "You feel violated or forced to accept something you dislike." }
    ]
  },
  {
    name: "Shooting",
    category: "Actions",
    meaning: "Aggression, focused energy, or power struggles.",
    longDescription: "Guns represent power and male aggression. Shooting implies a desire to hurt or control. Being shot suggests you feel victimized or targeted in waking life. It is a violent release of pent-up energy.",
    jungianArchetype: "Power / Conflict",
    keywords: ["gun", "bullet", "war", "violence"],
    culturalSignificance: "Guns are symbols of both protection and violence in modern culture.",
    emotionalResonance: "Anger, Fear, Power.",
    scenarios: [
      { scenario: "Being shot", interpretation: "You feel wounded by someone's words or actions." },
      { scenario: "Shooting someone", interpretation: "You are directing anger towards a specific person or part of yourself." },
      { scenario: "Gun jammed", interpretation: "Feelings of impotence or inability to defend yourself." }
    ]
  },
  {
    name: "Kidnapping",
    category: "Actions",
    meaning: "Loss of control or being forced into a situation.",
    longDescription: "Being kidnapped is a terrifying loss of autonomy. It suggests you feel trapped by circumstances or controlled by someone else in your waking life. It can also mean a part of your personality has been 'hijacked' by fear or addiction.",
    jungianArchetype: "The Victim / Loss of Soul",
    keywords: ["abduction", "hostage", "captive", "ransom"],
    culturalSignificance: "The Rape of Persephone myth (being taken to the underworld).",
    emotionalResonance: "Helplessness, Fear, Trap.",
    scenarios: [
      { scenario: "Being kidnapped", interpretation: "You feel powerless and controlled by external forces." },
      { scenario: "Kidnapping someone", interpretation: "You are trying to force someone (or a part of yourself) to comply with your will." },
      { scenario: "Escaping kidnappers", interpretation: "You are reclaiming your independence and power." }
    ]
  },
  {
    name: "Cheating",
    category: "Actions",
    meaning: "Insecurity, neglect, or guilt.",
    longDescription: "Dreaming that your partner is cheating is rarely prophetic. It usually points to your own insecurity or a feeling that your partner's attention is focused elsewhere (work, hobbies). If YOU are cheating, it suggests you are not being true to your own values or are neglecting your current relationship.",
    jungianArchetype: "Betrayal / Shadow",
    keywords: ["adultery", "affair", "unfaithful", "betrayal"],
    culturalSignificance: "Violation of sacred vows. A common theme in drama and literature.",
    emotionalResonance: "Jealousy, Guilt, Insecurity.",
    scenarios: [
      { scenario: "Partner cheating", interpretation: "You feel neglected or insecure in the relationship." },
      { scenario: "You cheating", interpretation: "Guilt about a desire; or you are 'cheating' yourself out of happiness." },
      { scenario: "Cheating with an ex", interpretation: "Falling back into old, comfortable but potentially toxic habits." }
    ]
  },

  // Objects
  {
    name: "House",
    category: "Objects",
    meaning: "The self. Different rooms represent different aspects of personality.",
    longDescription: "The house is the architectural representation of the Self. The facade is the Persona. The kitchen is digestion/nourishment. The bedroom is intimacy/rest. The basement is the subconscious.",
    jungianArchetype: "The Self Structure",
    keywords: ["home", "rooms", "mansion", "abandoned house", "moving house"],
    culturalSignificance: "Home is where the heart is. In Jungian analysis, the house IS the dreamer.",
    emotionalResonance: "Comfort, Security, or Unrest.",
    scenarios: [
      { scenario: "Discovering a new room", interpretation: "You are discovering a new talent or aspect of yourself." },
      { scenario: "House falling apart", interpretation: "You feel physically or emotionally unstable." },
      { scenario: "Childhood home", interpretation: "Revisiting old patterns, memories, or roots." }
    ]
  },
  {
    name: "Mirror",
    category: "Objects",
    meaning: "Self-reflection, identity, and truth.",
    longDescription: "Mirrors show us who we are—or who we fear we are. They represent truth, vanity, and self-examination. In myths, mirrors can trap the soul or show the future.",
    jungianArchetype: "Self-Reflection",
    keywords: ["reflection", "looking glass", "broken mirror", "vanity"],
    culturalSignificance: "Narcissus fell in love with his reflection. Mirrors are often covered after death in folklore.",
    emotionalResonance: "Vanity, Fear, Identity.",
    scenarios: [
      { scenario: "No reflection", interpretation: "Loss of identity; feeling invisible." },
      { scenario: "Broken mirror", interpretation: "Distorted self-image; fear of bad luck." },
      { scenario: "Seeing a stranger in mirror", interpretation: "You do not recognize who you have become; dissociation." }
    ]
  },
  {
    name: "Car",
    category: "Objects",
    meaning: "Your physical body or ego, and how you navigate life.",
    longDescription: "Similar to 'Driving', the car object itself represents your physical body and social status. Is it a wreck? A luxury car? A bus?",
    jungianArchetype: "The Body / Persona Vehicle",
    keywords: ["automobile", "crash", "stolen car", "parked car"],
    culturalSignificance: "Status symbol in modern society. Freedom of movement.",
    emotionalResonance: "Pride, Status, Frustration.",
    scenarios: [
      { scenario: "Car stolen", interpretation: "Identity theft; feeling stripped of your path or status." },
      { scenario: "Car crash", interpretation: "A conflict between your goals and reality; you are heading for disaster." },
      { scenario: "Cannot find parked car", interpretation: "You have lost your drive or direction in life." }
    ]
  },
  {
    name: "Key",
    category: "Objects",
    meaning: "Knowledge, opportunities, and solutions.",
    longDescription: "Keys open doors. They represent the power to access new areas of life, knowledge, or the heart. A key is a solution to a problem.",
    jungianArchetype: "The Solution",
    keywords: ["lock", "opening", "losing keys", "golden key"],
    culturalSignificance: "Keys to the Kingdom. St. Peter holds the keys to heaven.",
    emotionalResonance: "Hope, Frustration, Access.",
    scenarios: [
      { scenario: "Losing keys", interpretation: "Frustration; missed opportunities; confusion." },
      { scenario: "Finding a key", interpretation: "You have found the answer or the way forward." },
      { scenario: "Key doesn't fit", interpretation: "You are trying to force a solution that doesn't work." }
    ]
  },
  {
    name: "Phone",
    category: "Objects",
    meaning: "Communication and connection.",
    longDescription: "Phones connect us to others. In dreams, they often represent telepathy or the need to communicate. Technical difficulties with phones represent communication breakdowns.",
    jungianArchetype: "Connection",
    keywords: ["smartphone", "calling", "texting", "broken phone"],
    culturalSignificance: "Modern symbol of constant connection and information.",
    emotionalResonance: "Anxiety, Connection, Isolation.",
    scenarios: [
      { scenario: "Cannot dial number", interpretation: "Frustration in expressing yourself or reaching someone." },
      { scenario: "Phone ringing", interpretation: "A message from your unconscious is trying to get through." },
      { scenario: "Broken screen", interpretation: "You are not seeing the connection clearly." }
    ]
  },
  {
    name: "Money",
    category: "Objects",
    meaning: "Self-worth, energy, and power.",
    longDescription: "Money is a symbol of value. In dreams, it rarely means actual cash—it means self-worth, energy, or time. 'Spending' money is spending energy.",
    jungianArchetype: "Value / Libido",
    keywords: ["cash", "coins", "wallet", "stealing money", "rich"],
    culturalSignificance: "Root of all evil? Or divine blessing? Represents power in society.",
    emotionalResonance: "Greed, Security, Anxiety.",
    scenarios: [
      { scenario: "Finding money", interpretation: "A boost in self-confidence or energy." },
      { scenario: "Losing money", interpretation: "You feel drained or unworthy." },
      { scenario: "Stealing money", interpretation: "You feel you need to take what you aren't getting naturally (love/attention)." }
    ]
  },
  {
    name: "Door",
    category: "Objects",
    meaning: "Transitions and opportunities.",
    longDescription: "Doors are thresholds. Passing through one means entering a new phase. A closed door is a barrier; an open door is an invitation.",
    jungianArchetype: "The Threshold",
    keywords: ["locked door", "knocking", "doorway", "open door"],
    culturalSignificance: "Janus is the god of doorways and beginnings.",
    emotionalResonance: "Curiosity, Fear, Opportunity.",
    scenarios: [
      { scenario: "Locked door", interpretation: "You are blocked from what you want; or you are protecting yourself." },
      { scenario: "Knocking on door", interpretation: "Seeking permission or attention." },
      { scenario: "Door won't close", interpretation: "You cannot shut out a problem or past issue." }
    ]
  },
  {
    name: "Clock",
    category: "Objects",
    meaning: "Time, mortality, and urgency.",
    longDescription: "Clocks remind us of the passage of time. They can represent anxiety about deadlines, aging, or the feeling that 'time is running out'.",
    jungianArchetype: "Time / Mortality",
    keywords: ["watch", "alarm", "ticking", "late"],
    culturalSignificance: "Chronos (Time) eats his children. Memento Mori.",
    emotionalResonance: "Urgency, Anxiety, Regret.",
    scenarios: [
      { scenario: "Clock moving fast", interpretation: "Life is moving too fast for you; anxiety." },
      { scenario: "Clock stopped", interpretation: "A timeless moment; or death/stagnation." },
      { scenario: "Late for something", interpretation: "You feel unprepared or that you are missing out." }
    ]
  },
  {
    name: "Train",
    category: "Objects",
    meaning: "Life path, destiny, and social conformity.",
    longDescription: "Unlike a car (which you drive), a train runs on a fixed track. It represents a path that is laid out for you—destiny, social expectations, or a collective journey. It can symbolize feeling 'on track' or 'off the rails'.",
    jungianArchetype: "Collective Path",
    keywords: ["railway", "subway", "train station", "missed train"],
    culturalSignificance: "The 'Train of Life'. Symbol of industrial progress and destiny.",
    emotionalResonance: "Momentum, Destiny, Lack of Control.",
    scenarios: [
      { scenario: "Missing a train", interpretation: "Fear of missing an opportunity or being left behind by society." },
      { scenario: "Wrong train", interpretation: "You are on a life path that doesn't feel right for you." },
      { scenario: "Train crash", interpretation: "A catastrophic failure of your plans or a collision with destiny." }
    ]
  },
  {
    name: "Bus",
    category: "Objects",
    meaning: "Collective journey, waiting, or lack of control.",
    longDescription: "A bus is a public vehicle. Unlike a car (individual path), a bus represents a journey taken with others (society, family, work team). It implies you are following a set route rather than driving yourself.",
    jungianArchetype: "Collective Persona",
    keywords: ["bus stop", "school bus", "bus driver", "missed bus"],
    culturalSignificance: "Public transport represents the 'common' path.",
    emotionalResonance: "Patience, Conformity, frustration.",
    scenarios: [
      { scenario: "Missing the bus", interpretation: "You feel you are missing out on a collective opportunity or falling behind peers." },
      { scenario: "Wrong bus", interpretation: "You are following a crowd or path that is not right for you." },
      { scenario: "Bus crash", interpretation: "A group project or social structure you rely on is failing." }
    ]
  },
  {
    name: "Boat",
    category: "Objects",
    meaning: "Navigating emotions or spiritual journey.",
    longDescription: "A boat floats on water (emotions/unconscious). It represents how you navigate your emotional life. A sturdy boat means you handle feelings well. A sinking boat means you are overwhelmed.",
    jungianArchetype: "The Vessel",
    keywords: ["ship", "sailing", "canoe", "yacht", "sinking"],
    culturalSignificance: "Charon's boat crosses the river Styx. Noah's Ark.",
    emotionalResonance: "Adventure, Fear of Drowning, Safety.",
    scenarios: [
      { scenario: "Sinking boat", interpretation: "You are being overwhelmed by your emotions or a crisis." },
      { scenario: "Rowing a boat", interpretation: "You are putting in hard emotional work to move forward." },
      { scenario: "Cruise ship", interpretation: "You are coasting through life, perhaps ignoring deeper issues." }
    ]
  },
  {
    name: "Luggage",
    category: "Objects",
    meaning: "Emotional baggage or preparing for a change.",
    longDescription: "Luggage carries your personal belongings. In dreams, it usually represents 'emotional baggage'—past hurts, memories, and responsibilities you carry with you. Losing it can mean freedom, or a loss of identity.",
    jungianArchetype: " The Burden / Persona",
    keywords: ["suitcase", "packing", "lost luggage", "baggage claim"],
    culturalSignificance: "We all 'carry' our past.",
    emotionalResonance: "Burden, Preparedness, Loss.",
    scenarios: [
      { scenario: "Heavy luggage", interpretation: "You are carrying too many burdens or past regrets." },
      { scenario: "Losing your luggage", interpretation: "You are letting go of your past identity or feeling unprepared for a journey." },
      { scenario: "Packing luggage", interpretation: "You are preparing for a major life change or transition." }
    ]
  },
  {
    name: "Shoes",
    category: "Objects",
    meaning: "Your path in life, grounding, or identity.",
    longDescription: "Shoes protect our feet as we walk our path. They represent your grounding in reality and your direction in life. Losing shoes suggests you have lost your way or your foundation.",
    jungianArchetype: "The Path / Standpoint",
    keywords: ["barefoot", "sneakers", "high heels", "lost shoes"],
    culturalSignificance: "Cinderella's glass slipper (identity). Removing shoes on holy ground (humility).",
    emotionalResonance: "Groundedness, Vulnerability, Identity.",
    scenarios: [
      { scenario: "Lost shoes", interpretation: "You are unsure of your direction or identity." },
      { scenario: "New shoes", interpretation: "You are embarking on a new path or adopting a new approach to life." },
      { scenario: "Shoes don't fit", interpretation: "You are trying to live a life that doesn't suit who you really are." }
    ]
  },
  {
    name: "Spider Web",
    category: "Objects",
    meaning: "Feeling trapped, creativity, or manipulation.",
    longDescription: "While the spider is the weaver, the web is the trap (or the creation). Dreaming of a web often suggests you feel entangled in a complicated situation, relationship, or lies. It can also represent the intricate connections of your life.",
    jungianArchetype: "The Labyrinth / Trap",
    keywords: ["cobweb", "sticky", "entangled", "weaving"],
    culturalSignificance: "The Web of Wyrd (fate). Indra's Net (connection of all things).",
    emotionalResonance: "Entrapment, Awe, Confusion.",
    scenarios: [
      { scenario: "Walking into a web", interpretation: "You have inadvertently walked into a difficult situation." },
      { scenario: "Clearing spider webs", interpretation: "You are clearing away old problems or neglecting duties." },
      { scenario: "Beautiful web", interpretation: "Appreciation for the complexity of life or a creative project." }
    ]
  },
  {
    name: "Mask",
    category: "Objects",
    meaning: "Identity, concealment, and the social self.",
    longDescription: "We all wear masks (Personas) to function in society. Dreaming of a mask suggests you are hiding your true self or are trying to understand who someone really is beneath their facade.",
    jungianArchetype: "The Persona",
    keywords: ["disguise", "costume", "hiding face", "masquerade"],
    culturalSignificance: "Used in theater and ritual to channel spirits or adopt roles.",
    emotionalResonance: "Deception, Mystery, Protection.",
    scenarios: [
      { scenario: "Removing a mask", interpretation: "Revealing the truth; vulnerability." },
      { scenario: "Cannot take mask off", interpretation: "You have lost your true self to your social role." },
      { scenario: "Someone wearing a mask", interpretation: "You suspect someone is being deceitful or fake." }
    ]
  },
  {
    name: "Bicycle",
    category: "Objects",
    meaning: "Balance, personal effort, and independence.",
    longDescription: "Unlike a car (driven by engine) or bus (driven by others), a bicycle requires your own effort and balance to move. It represents a journey that relies solely on your own energy and skill.",
    jungianArchetype: "Personal Balance",
    keywords: ["bike ride", "pedaling", "cycling", "training wheels"],
    culturalSignificance: "Symbol of childhood freedom and eco-friendly travel.",
    emotionalResonance: "Balance, Effort, Freedom.",
    scenarios: [
      { scenario: "Riding uphill", interpretation: "You are facing a struggle but handling it with your own strength." },
      { scenario: "Falling off bike", interpretation: "Loss of balance in life; trying to do too much." },
      { scenario: "Broken chain", interpretation: "You have lost the drive or connection to move forward." }
    ]
  },
  {
    name: "Egg",
    category: "Objects",
    meaning: "Potential, new life, and fragility.",
    longDescription: "The egg contains the germ of life. It represents unrealized potential, a new idea, or the universe before creation. Breaking an egg can mean destruction or the necessary breaking of a shell to allow growth.",
    jungianArchetype: "The Self (Germinal)",
    keywords: ["hatching", "nest", "Easter egg", "cooking eggs"],
    culturalSignificance: "Cosmic Egg myths (universe born from egg). Easter symbol of resurrection.",
    emotionalResonance: "Potential, Fragility, Hope.",
    scenarios: [
      { scenario: "Hatching egg", interpretation: "A new idea or phase of life is being born." },
      { scenario: "Broken egg", interpretation: "Disappointment; or vulnerability (walking on eggshells)." },
      { scenario: "Golden egg", interpretation: "A realization of great spiritual or creative value." }
    ]
  },
  {
    name: "Gold",
    category: "Objects",
    meaning: "Spiritual value, perfection, and the Self.",
    longDescription: "Gold is the perfect metal—it does not rust. In alchemy and dreams, it represents the highest value, not necessarily money, but spiritual wholeness, wisdom, and the true Self.",
    jungianArchetype: "The Self (Perfection)",
    keywords: ["treasure", "jewelry", "nugget", "gilded"],
    culturalSignificance: "The goal of the Alchemist. Symbol of divinity and royalty.",
    emotionalResonance: "Value, Greed, Awe.",
    scenarios: [
      { scenario: "Finding gold", interpretation: "Discovering a valuable talent or truth within yourself." },
      { scenario: "Burying gold", interpretation: "Hiding your talents or true value from the world." },
      { scenario: "Melting gold", interpretation: "Refining your character through a difficult process." }
    ]
  },
  {
    name: "Window",
    category: "Objects",
    meaning: "Perspective, outlook, and opportunity.",
    longDescription: "Windows allow us to see out (perspective) and let light in (consciousness). A window represents your outlook on life. Looking in represents introspection; looking out represents expectation.",
    jungianArchetype: "Perception",
    keywords: ["glass", "view", "curtains", "looking out"],
    culturalSignificance: "Eyes are the windows to the soul. Defenestration (throwing out of window) is rejection.",
    emotionalResonance: "Hope, Separation, Clarity.",
    scenarios: [
      { scenario: "Broken window", interpretation: "Your view of the world is distorted; or vulnerability." },
      { scenario: "Opening a window", interpretation: "Letting in new ideas or opportunities." },
      { scenario: "Looking out window", interpretation: "Waiting for something; feeling separated from the world." }
    ]
  },
  {
    name: "Wall",
    category: "Objects",
    meaning: "Obstacles, boundaries, and protection.",
    longDescription: "A wall stops movement. It can be a frustration (obstacle) or a comfort (protection). Hitting a wall means you have gone as far as you can go in a certain direction.",
    jungianArchetype: "The Barrier",
    keywords: ["brick wall", "fence", "barrier", "climbing wall"],
    culturalSignificance: "Great Wall of China. Berlin Wall (separation). Walls of Jericho.",
    emotionalResonance: "Frustration, Safety, Separation.",
    scenarios: [
      { scenario: "Climbing a wall", interpretation: "Overcoming an obstacle or challenge." },
      { scenario: "Building a wall", interpretation: "You are putting up defenses to protect yourself." },
      { scenario: "Wall collapsing", interpretation: "Your defenses are crumbling; or a breakthrough." }
    ]
  },
  {
    name: "Ladder",
    category: "Objects",
    meaning: "Ascension, ambition, and risky progress.",
    longDescription: "A ladder allows you to climb higher, but it is less stable than stairs. It represents spiritual or career ascent that requires focus and balance. Dreaming of a ladder often connects to 'Jacob's Ladder'—a connection to the divine.",
    jungianArchetype: "Ascension",
    keywords: ["climbing", "heights", "rung", "falling"],
    culturalSignificance: "Jacob's Ladder to heaven. Superstition about walking under ladders.",
    emotionalResonance: "Ambition, Vertigo, Effort.",
    scenarios: [
      { scenario: "Climbing a ladder", interpretation: "You are rising in status or consciousness." },
      { scenario: "Broken rung", interpretation: "A flaw in your plan or a setback in your climb." },
      { scenario: "Falling off ladder", interpretation: "Failure due to lack of caution or over-ambition." }
    ]
  },
  {
    name: "Book",
    category: "Objects",
    meaning: "Knowledge, destiny, and memories.",
    longDescription: "Books contain wisdom. Dreaming of a book suggests you are seeking answers or need to 'read' a situation better. A book can also represent your own life story (The Book of Life).",
    jungianArchetype: "Logos / Wisdom",
    keywords: ["reading", "library", "pages", "writing"],
    culturalSignificance: "Holy Books (Bible, Quran). The Akashic Records.",
    emotionalResonance: "Curiosity, Wisdom, Authority.",
    scenarios: [
      { scenario: "Reading a book", interpretation: "You are learning something new or realizing a truth." },
      { scenario: "Writing a book", interpretation: "You are taking control of your own narrative or legacy." },
      { scenario: "Book with blank pages", interpretation: "Your future is unwritten; endless possibilities." }
    ]
  },
  {
    name: "Toilet",
    category: "Objects",
    meaning: "Privacy, releasing negativity, and embarrassment.",
    longDescription: "Dreams about toilets are incredibly common and usually relate to the need to 'let go' of waste (negative emotions, toxic situations). If the toilet is clogged or public, it represents an inability to express yourself privately or fear of social embarrassment.",
    jungianArchetype: "Purification / Shadow",
    keywords: ["bathroom", "restroom", "poop", "overflowing toilet"],
    culturalSignificance: "Taboo subject in polite society, but essential for health.",
    emotionalResonance: "Shame, Relief, Urgency.",
    scenarios: [
      { scenario: "Toilet overflowing", interpretation: "Your emotions are spilling out; you can no longer hold back your feelings." },
      { scenario: "Using a public toilet", interpretation: "Lack of privacy; you feel exposed or judged in your personal life." },
      { scenario: "Clogged toilet", interpretation: "Emotional constipation; you are unable to release negative feelings." }
    ]
  },
  {
    name: "Airplane",
    category: "Objects",
    meaning: "Ambition, career path, and higher perspective.",
    longDescription: "Airplanes represent our journey through life, specifically our career or spiritual goals. Taking off represents the start of a venture. Crashing represents a fear of failure or a plan going wrong.",
    jungianArchetype: "Ascension",
    keywords: ["airport", "flight", "pilot", "crash"],
    culturalSignificance: "Modern symbol of global connection and technological triumph.",
    emotionalResonance: "Ambition, Fear of Crashing, Excitement.",
    scenarios: [
      { scenario: "Missing a flight", interpretation: "Fear of missing an opportunity; feeling unprepared for a new phase." },
      { scenario: "Plane crash", interpretation: "Anxiety about a project failing; unrealistic goals crashing down." },
      { scenario: "Flying a plane", interpretation: "You are in control of your destiny and career path." }
    ]
  },
  {
    name: "Elevator",
    category: "Objects",
    meaning: "Ups and downs of life, status, and loss of control.",
    longDescription: "Elevators take us to different levels of consciousness or social status. Going up represents success and higher awareness. Going down represents exploring the subconscious or a loss of status. Falling elevators represent a complete lack of control.",
    jungianArchetype: "Vertical Movement",
    keywords: ["lift", "falling elevator", "stuck", "floors"],
    culturalSignificance: "Modern convenience that removes the effort of climbing (contrast with stairs).",
    emotionalResonance: "Anxiety, Passivity, Vertigo.",
    scenarios: [
      { scenario: "Elevator falling", interpretation: "Terrifying loss of control; fear of a crash in your career or life." },
      { scenario: "Stuck in elevator", interpretation: "Feeling trapped in your current situation or career level." },
      { scenario: "Elevator going sideways", interpretation: "Your life is taking an unexpected, unconventional direction." }
    ]
  },

  // People
  {
    name: "Baby",
    category: "People",
    meaning: "New beginnings, potential, vulnerability, or the 'inner child'.",
    longDescription: "Babies represent pure potential and innocence. They also represent something that needs constant care and attention (a new project, a new idea).",
    jungianArchetype: "The Divine Child",
    keywords: ["infant", "newborn", "crying baby", "pregnant"],
    culturalSignificance: "Baby Jesus. Cupid. Symbol of the future.",
    emotionalResonance: "Tenderness, Responsibility, Anxiety.",
    scenarios: [
      { scenario: "Crying baby", interpretation: "A part of you is neglected and needs attention." },
      { scenario: "Giving birth", interpretation: "You are bringing something new into the world (creativity)." },
      { scenario: "Lost baby", interpretation: "You have lost touch with your potential or innocence." }
    ]
  },
  {
    name: "Stranger",
    category: "People",
    meaning: "The Shadow (rejected parts of self) or the Anima/Animus.",
    longDescription: "Strangers in dreams are often aspects of ourselves we haven't met yet. If they are scary, they are the Shadow. If they are attractive, they may be the Anima/Animus (soul mate).",
    jungianArchetype: "The Unknown Self",
    keywords: ["unknown person", "intruder", "stalker", "new friend"],
    culturalSignificance: "Xenia (Greek hospitality to strangers). Stranger Danger.",
    emotionalResonance: "Curiosity, Fear, Attraction.",
    scenarios: [
      { scenario: "Being chased by stranger", interpretation: "You are running from yourself." },
      { scenario: "Kissing a stranger", interpretation: "Integrating a new quality into your personality." },
      { scenario: "Stranger in your house", interpretation: "A new aspect of yourself is moving in." }
    ]
  },
  {
    name: "Ex-Partner",
    category: "People",
    meaning: "Unresolved feelings, patterns repeating, or integrating lessons.",
    longDescription: "Dreaming of an ex is rarely about them—it's about what they represent. The time you were together, the feelings you had, or the mistakes you made. It's about closure or pattern recognition.",
    jungianArchetype: "Projected Anima/Animus",
    keywords: ["boyfriend", "girlfriend", "divorce", "breakup"],
    culturalSignificance: "Reflects our relationship history and learning.",
    emotionalResonance: "Nostalgia, Regret, Anger.",
    scenarios: [
      { scenario: "Getting back together", interpretation: "You are integrating the lessons from that relationship; or slipping into old habits." },
      { scenario: "Fighting with ex", interpretation: "Unresolved conflict within yourself regarding that time in your life." },
      { scenario: "Ex is ignoring you", interpretation: "You are ready to move on and let go." }
    ]
  },
  {
    name: "Mother",
    category: "People",
    meaning: "Nurturing, intuition, or the 'Mother' archetype.",
    longDescription: "The mother is the source of life. In dreams, she represents comfort, nurturing, and intuition. The negative mother represents smothering, devouring, or controlling behavior.",
    jungianArchetype: "The Great Mother",
    keywords: ["mom", "maternal", "hugging", "fighting mom"],
    culturalSignificance: "Mother Earth (Gaia). Virgin Mary. Kali (Devouring Mother).",
    emotionalResonance: "Comfort, Suffocation, Love.",
    scenarios: [
      { scenario: "Fighting with mother", interpretation: "Struggle for independence and establishing boundaries." },
      { scenario: "Mother dying", interpretation: "A major transition into adulthood; loss of security." },
      { scenario: "Being hugged by mother", interpretation: "Need for comfort and regression to safety." }
    ]
  },
  {
    name: "Father",
    category: "People",
    meaning: "Authority, protection, or the 'Father' archetype.",
    longDescription: "The father represents the law, society, authority, and protection. He is the guide to the outer world. The negative father represents tyranny, judgment, and rigidity.",
    jungianArchetype: "The Wise Old Man / The Tyrant",
    keywords: ["dad", "patriarch", "strict", "protection"],
    culturalSignificance: "God the Father. Zeus. The King.",
    emotionalResonance: "Safety, Judgment, Rebellion.",
    scenarios: [
      { scenario: "Father is angry", interpretation: "Guilt; fear of judgment or authority." },
      { scenario: "Father is absent", interpretation: "Lack of guidance or discipline; needing to father yourself." },
      { scenario: "Killing the father", interpretation: "Overthrowing old beliefs or authority to find your own path." }
    ]
  },
  {
    name: "Ghost",
    category: "People",
    meaning: "Unresolved past, guilt, or memories.",
    longDescription: "Ghosts are things that are dead but won't stay buried. They represent unfinished business, repressed memories, or guilt that haunts you. They can also represent parts of yourself you have 'killed off'.",
    jungianArchetype: "The Shadow / Complex",
    keywords: ["spirit", "haunting", "dead person", "phantom"],
    culturalSignificance: "Ancestor worship. Restless spirits seeking peace.",
    emotionalResonance: "Fear, Guilt, Sadness.",
    scenarios: [
      { scenario: "Being haunted", interpretation: "You are unable to escape your past or a guilty secret." },
      { scenario: "Talking to a ghost", interpretation: "Trying to resolve an old issue or find closure." },
      { scenario: "Becoming a ghost", interpretation: "Feeling invisible, disconnected, or detached from reality." }
    ]
  },
  {
    name: "Alien",
    category: "People",
    meaning: "The unknown, innovation, or feeling alienated.",
    longDescription: "Aliens represent something completely foreign to your conscious mind. They can symbolize new ideas that seem 'out of this world' or a feeling of not belonging (alienation). In Jungian terms, they are often a projection of the 'Self' as a superior intelligence.",
    jungianArchetype: "The Other / Higher Intelligence",
    keywords: ["UFO", "extraterrestrial", "abduction", "outer space"],
    culturalSignificance: "Modern mythology of technology and the 'other'.",
    emotionalResonance: "Wonder, Fear, Alienation.",
    scenarios: [
      { scenario: "Abducted by aliens", interpretation: "You feel your life is being hijacked by forces you don't understand; or a forced expansion of consciousness." },
      { scenario: "Friendly alien", interpretation: "Discovering a new, strange talent or idea." },
      { scenario: "Alien invasion", interpretation: "Fear of your personal space or culture being overtaken by outsiders." }
    ]
  },
  {
    name: "Zombie",
    category: "People",
    meaning: "Burnout, conformity, and mindless habits.",
    longDescription: "Zombies are dead but walking. They represent people or habits that are draining your energy. They can symbolize a fear of losing your individuality to the 'mob' or feeling dead inside due to burnout.",
    jungianArchetype: "The Shadow (Mindless)",
    keywords: ["undead", "apocalypse", "infection", "eating brains"],
    culturalSignificance: "Modern symbol of consumerism, pandemics, and loss of self.",
    emotionalResonance: "Dread, Exhaustion, Disgust.",
    scenarios: [
      { scenario: "Chased by zombies", interpretation: "You are running from stress, responsibilities, or a toxic social environment." },
      { scenario: "Killing zombies", interpretation: "You are actively fighting against bad habits or social pressure." },
      { scenario: "Loved one becomes zombie", interpretation: "You feel you have lost the emotional connection to this person; they have changed." }
    ]
  },
  {
    name: "Vampire",
    category: "People",
    meaning: "Energy drain, seduction, and parasitic relationships.",
    longDescription: "Vampires feed on life force. In dreams, they represent people or situations that drain you emotionally ('energy vampires'). They also represent a dangerous seduction—something that is bad for you but tempting.",
    jungianArchetype: "The Shadow (Parasitic)",
    keywords: ["dracula", "biting", "blood sucker", "immortal"],
    culturalSignificance: "Symbol of forbidden desire and the violation of death boundaries.",
    emotionalResonance: "Drain, Seduction, Fear.",
    scenarios: [
      { scenario: "Bitten by vampire", interpretation: "You are succumbing to a negative influence or addiction." },
      { scenario: "Falling in love with vampire", interpretation: "Attraction to danger or a toxic partner." },
      { scenario: "Turning into vampire", interpretation: "You are becoming selfish or using others for your own needs." }
    ]
  },
  {
    name: "Witch",
    category: "People",
    meaning: "Feminine power, magic, destruction, or creation.",
    longDescription: "The witch is a powerful symbol of the feminine. She can be the 'Wise Woman' (healer) or the 'Wicked Witch' (destroyer). She represents the power of intuition and the ability to change reality.",
    jungianArchetype: "The Great Mother (Magical/Terrible)",
    keywords: ["spell", "broomstick", "crone", "magic"],
    culturalSignificance: "Persecuted figure in history; symbol of female empowerment in modern times.",
    emotionalResonance: "Power, Fear, Awe.",
    scenarios: [
      { scenario: "Being cast a spell on", interpretation: "You feel manipulated by someone else's will or charm." },
      { scenario: "Flying on broom", interpretation: "You are embracing your own unconventional power and freedom." },
      { scenario: "Friendly witch", interpretation: "You are connecting with your intuition and inner wisdom." }
    ]
  },
  {
    name: "Clown",
    category: "People",
    meaning: "The mask, absurdity, and hidden sadness or fear.",
    longDescription: "Clowns wear a painted smile to hide their true face. They represent the absurdity of life. A scary clown (common phobia) represents a trusted figure who is secretly dangerous, or the fear of being ridiculed.",
    jungianArchetype: "The Trickster",
    keywords: ["circus", "scary clown", "joker", "laughter"],
    culturalSignificance: "The Court Jester who speaks truth to power. Pennywise (fear of childhood trauma).",
    emotionalResonance: "Absurdity, Fear, Mockery.",
    scenarios: [
      { scenario: "Killer clown", interpretation: "Something that should be fun has turned threatening; fear of humiliation." },
      { scenario: "Sad clown", interpretation: "You are hiding your pain behind a happy facade (Persona)." },
      { scenario: "Being a clown", interpretation: "You feel like you are not taken seriously or are performing for others." }
    ]
  },
  {
    name: "Celebrity",
    category: "People",
    meaning: "Aspiration, the ideal self, or desire for recognition.",
    longDescription: "Celebrities represent the qualities they are famous for. Dreaming of them suggests you want those qualities for yourself. It can also symbolize a desire to be seen, admired, or special.",
    jungianArchetype: "The Persona / The Idol",
    keywords: ["famous person", "actor", "singer", "vip"],
    culturalSignificance: "Modern gods and goddesses of the media age.",
    emotionalResonance: "Admiration, Envy, Importance.",
    scenarios: [
      { scenario: "Dating a celebrity", interpretation: "You are integrating success and confidence into your self-image." },
      { scenario: "Being a celebrity", interpretation: "A desire for validation or feeling confident in your abilities." },
      { scenario: "Celebrity ignoring you", interpretation: "You feel your talents are going unrecognized." }
    ]
  },
  {
    name: "Police",
    category: "People",
    meaning: "Authority, conscience, guilt, or protection.",
    longDescription: "The police represent the law and moral authority. In dreams, they often symbolize your own conscience (Super-Ego) policing your behavior. If you are afraid of them, you feel guilty. If they help you, you are seeking guidance.",
    jungianArchetype: "The Super-Ego / Guardian",
    keywords: ["arrested", "police chase", "calling police", "law enforcement"],
    culturalSignificance: "Guardians of order. Can also represent oppressive state power.",
    emotionalResonance: "Guilt, Safety, or Fear.",
    scenarios: [
      { scenario: "Being arrested", interpretation: "You feel guilty about something or restricted by rules." },
      { scenario: "Calling the police", interpretation: "You are seeking help or intervention in a chaotic situation." },
      { scenario: "Running from police", interpretation: "You are avoiding responsibility or refusing to follow the rules." }
    ]
  },
  {
    name: "Demons",
    category: "People",
    meaning: "Guilt, addiction, or repressed trauma.",
    longDescription: "Demons in dreams usually represent your own inner 'demons'—guilt, addictions, or negative thought patterns that torment you. They are not external entities but internal conflicts that have taken on a monstrous form. Confronting them often makes them vanish.",
    jungianArchetype: "The Shadow (Active/Malicious)",
    keywords: ["evil spirit", "possession", "exorcism", "hell"],
    culturalSignificance: "Universal symbols of evil and temptation.",
    emotionalResonance: "Terror, Guilt, Struggle.",
    scenarios: [
      { scenario: "Possessed by a demon", interpretation: "You feel controlled by an addiction or an intense emotion (rage, lust)." },
      { scenario: "Fighting a demon", interpretation: "You are actively wrestling with your guilt or negative habits." },
      { scenario: "Demon in your room", interpretation: "A private fear or secret is invading your personal sanctuary." }
    ]
  },

  // Places
  {
    name: "School",
    category: "Places",
    meaning: "Learning, social anxiety, or regression.",
    longDescription: "Even as adults, we dream of school. It represents a place of learning, but also of judgment and social hierarchy. It often points to a lesson you are currently learning in life, or feelings of inadequacy.",
    jungianArchetype: "The Academy / Initiation",
    keywords: ["classroom", "teacher", "locker", "high school"],
    culturalSignificance: "The primary institution of socialization and judgment.",
    emotionalResonance: "Anxiety, Nostalgia, Inadequacy.",
    scenarios: [
      { scenario: "Lost in school", interpretation: "You are confused about your current life lessons or social standing." },
      { scenario: "Back in high school", interpretation: "Regressing to old social insecurities or patterns." },
      { scenario: "Empty school", interpretation: "You have moved past a lesson; the learning phase is over." }
    ]
  },
  {
    name: "Hospital",
    category: "Places",
    meaning: "Healing, transition, and vulnerability.",
    longDescription: "Hospitals are places of healing but also of sickness. Dreaming of one suggests a need to heal a physical or emotional wound. It is a transitional space where you go to get better, but it implies you are currently not 'well'.",
    jungianArchetype: "Restoration",
    keywords: ["doctor", "nurse", "surgery", "emergency room"],
    culturalSignificance: "Place of birth and death. Modern temples of healing.",
    emotionalResonance: "Vulnerability, Hope, Fear.",
    scenarios: [
      { scenario: "Being a patient", interpretation: "You are admitting you need help; a period of rest and recovery." },
      { scenario: "Visiting someone", interpretation: "You are worried about a part of yourself or a relationship that is 'sick'." },
      { scenario: "Lost in hospital", interpretation: "You are confused about how to heal your pain." }
    ]
  },
  {
    name: "Airport",
    category: "Places",
    meaning: "New beginnings, departures, and waiting.",
    longDescription: "Airports are thresholds to new destinations. They represent the start of a new journey (career, relationship) or a desire to escape. Waiting in an airport represents the anticipation or frustration of a transition phase.",
    jungianArchetype: "The Threshold",
    keywords: ["luggage", "gate", "airplane", "security check"],
    culturalSignificance: "Modern portals to other worlds.",
    emotionalResonance: "Anticipation, Anxiety, Transition.",
    scenarios: [
      { scenario: "Missing a flight", interpretation: "Fear of missing an opportunity or feeling unprepared for change." },
      { scenario: "Empty airport", interpretation: "Your plans are stalled; feeling isolated in your journey." },
      { scenario: "Taking off", interpretation: "You are successfully launching a new phase of life." }
    ]
  },
  {
    name: "Basement",
    category: "Places",
    meaning: "The subconscious, repressed memories, and instincts.",
    longDescription: "The house is the Self, and the basement is the deepest, darkest part of it—the subconscious. It holds things we have stored away: old memories, fears, and repressed desires. Going down into the basement is facing what you have hidden.",
    jungianArchetype: "The Unconscious / Shadow",
    keywords: ["underground", "darkness", "cellar", "foundation"],
    culturalSignificance: "The Underworld. Where we bury things.",
    emotionalResonance: "Fear, Mystery, Depth.",
    scenarios: [
      { scenario: "Dark basement", interpretation: "You are afraid to look at your repressed feelings or past." },
      { scenario: "Flooded basement", interpretation: "Repressed emotions are overwhelming your subconscious." },
      { scenario: "Finding treasure in basement", interpretation: "Discovering hidden talents or wisdom in your past." }
    ]
  },
  {
    name: "Attic",
    category: "Places",
    meaning: "Higher mind, intellect, spiritual memories, or neglect.",
    longDescription: "The attic is the opposite of the basement. It represents the 'higher' mind, intellect, or spirituality. It also stores things from the past, but usually things we value or have simply forgotten. It can represent 'heady' thoughts.",
    jungianArchetype: "The Super-Ego / Intellect",
    keywords: ["roof", "dusty", "storage", "top floor"],
    culturalSignificance: "The head of the house. Where secrets are kept 'upstairs'.",
    emotionalResonance: "Nostalgia, Intellectualism, Neglect.",
    scenarios: [
      { scenario: "Cluttered attic", interpretation: "Your mind is cluttered with old ideas or worries you need to clear out." },
      { scenario: "Haunted attic", interpretation: "Old memories or guilt are disturbing your peace of mind." },
      { scenario: "Hiding in attic", interpretation: "Retreating into your thoughts to avoid reality." }
    ]
  },
  {
    name: "Bridge",
    category: "Places",
    meaning: "Transition, connection, and overcoming obstacles.",
    longDescription: "A bridge connects two landmasses over water (emotions). It represents a transition from one state of being to another. Crossing a bridge is a significant psychological step. A broken bridge represents a failed transition.",
    jungianArchetype: "The Crossing",
    keywords: ["crossing", "suspension bridge", "falling off bridge", "river"],
    culturalSignificance: "Crossing the Rubicon (point of no return). Bifrost.",
    emotionalResonance: "Transition, Fear of Heights, Connection.",
    scenarios: [
      { scenario: "Falling off bridge", interpretation: "Failure to complete a transition; being overwhelmed by emotions." },
      { scenario: "Crossing a bridge", interpretation: "You are successfully moving to a new phase of life." },
      { scenario: "Bridge collapsing", interpretation: "A path you trusted is no longer safe; betrayal or missed opportunity." }
    ]
  },
  {
    name: "Hotel",
    category: "Places",
    meaning: "Temporary state, transition, and instability.",
    longDescription: "A hotel is a temporary home. Dreaming of one suggests you are in a transitional phase—between jobs, relationships, or identities. It implies a lack of permanence or stability.",
    jungianArchetype: "The Waystation",
    keywords: ["lobby", "room key", "elevator", "check in"],
    culturalSignificance: "Places of transience and anonymity.",
    emotionalResonance: "Transience, Discomfort, Luxury.",
    scenarios: [
      { scenario: "Lost in hotel", interpretation: "You are confused about your direction during this transitional period." },
      { scenario: "Luxury hotel", interpretation: "You are enjoying a temporary reward or status." },
      { scenario: "Dirty hotel", interpretation: "You feel uncomfortable and unsafe in your current temporary situation." }
    ]
  },
  {
    name: "Garden",
    category: "Places",
    meaning: "Growth, inner peace, and the soul.",
    longDescription: "A garden is a cultivated piece of nature. It represents the state of your inner life. Is it blooming and well-kept? Or overgrown with weeds? It symbolizes fertility, creativity, and spiritual growth.",
    jungianArchetype: "The Soul / Paradise",
    keywords: ["flowers", "weeds", "planting", "eden"],
    culturalSignificance: "Garden of Eden. Zen Gardens. Symbol of paradise.",
    emotionalResonance: "Peace, Growth, Beauty.",
    scenarios: [
      { scenario: "Weeding a garden", interpretation: "You are clearing out negative thoughts and habits." },
      { scenario: "Dead garden", interpretation: "You feel spiritually dry or that your creativity has withered." },
      { scenario: "Secret garden", interpretation: "Discovering a private, beautiful sanctuary within yourself." }
    ]
  },
  {
    name: "Prison",
    category: "Places",
    meaning: "Feeling trapped, guilt, and self-punishment.",
    longDescription: "Prisons in dreams are almost always self-created. They represent feeling trapped by a situation, a relationship, or your own limiting beliefs. They can also symbolize guilt and the need for punishment.",
    jungianArchetype: "The Trap",
    keywords: ["jail", "bars", "inmate", "escape"],
    culturalSignificance: "Panopticon. Symbol of state punishment and loss of freedom.",
    emotionalResonance: "Confinement, Guilt, Despair.",
    scenarios: [
      { scenario: "Breaking out of prison", interpretation: "You are freeing yourself from limiting beliefs or a restrictive situation." },
      { scenario: "Being sentenced", interpretation: "You feel guilty about something and are punishing yourself." },
      { scenario: "Visiting prison", interpretation: "You are acknowledging a part of yourself that you have locked away." }
    ]
  },
  {
    name: "Bathroom",
    category: "Places",
    meaning: "Cleansing, privacy, and releasing negativity.",
    longDescription: "The bathroom is where we clean ourselves and eliminate waste. In dreams, it represents the need to cleanse yourself emotionally or get rid of toxic feelings. It is a very private place, so it also relates to boundaries.",
    jungianArchetype: "Purification",
    keywords: ["shower", "toilet", "bath", "dirty bathroom"],
    culturalSignificance: "Ritual bathing (Mikvah, Baptism).",
    emotionalResonance: "Relief, Shame, Privacy.",
    scenarios: [
      { scenario: "Dirty bathroom", interpretation: "You have a lot of emotional 'waste' to deal with; toxic environment." },
      { scenario: "No door on bathroom", interpretation: "You feel you have no privacy or boundaries." },
      { scenario: "Taking a shower", interpretation: "Washing away guilt, stress, or old attitudes." }
    ]
  },
  {
    name: "Desert",
    category: "Places",
    meaning: "Isolation, loneliness, clarity, or barrenness.",
    longDescription: "The desert is a harsh environment. It can represent loneliness and emotional dryness. However, it is also a place of spiritual clarity and revelation (like prophets in the desert). It suggests a time of solitude.",
    jungianArchetype: "The Wasteland / Solitude",
    keywords: ["sand", "thirst", "sun", "cactus"],
    culturalSignificance: "The 40 days in the desert. A place of testing.",
    emotionalResonance: "Loneliness, Clarity, Thirst.",
    scenarios: [
      { scenario: "Lost in desert", interpretation: "You feel isolated and unsupported; emotional emptiness." },
      { scenario: "Finding an oasis", interpretation: "Relief and hope in a difficult time." },
      { scenario: "Walking alone", interpretation: "A journey of self-discovery and independence." }
    ]
  },
  {
    name: "Maze",
    category: "Places",
    meaning: "Confusion, complexity, and finding one's path.",
    longDescription: "A maze or labyrinth represents the complex journey of life. It symbolizes confusion and the feeling of being lost. However, the center of the labyrinth often holds a treasure or monster (the Self).",
    jungianArchetype: "The Labyrinth",
    keywords: ["labyrinth", "lost", "puzzle", "dead end"],
    culturalSignificance: "The Minotaur's Labyrinth. Chartres Cathedral labyrinth (spiritual path).",
    emotionalResonance: "Confusion, Frustration, Determination.",
    scenarios: [
      { scenario: "Stuck in a maze", interpretation: "You feel trapped in a complicated situation with no clear way out." },
      { scenario: "Being chased in maze", interpretation: "You are running from a problem but cannot find an escape." },
      { scenario: "Reaching the center", interpretation: "You have found the core of the problem or your true self." }
    ]
  },
  {
    name: "Shopping Mall",
    category: "Places",
    meaning: "Materialism, choices, and social identity.",
    longDescription: "Malls are places of commerce and choice. They represent our desires, values, and how we 'shop' for identity. They can also represent superficiality or being overwhelmed by too many choices.",
    jungianArchetype: "The Marketplace",
    keywords: ["stores", "shopping", "money", "clothes"],
    culturalSignificance: "Temples of consumerism.",
    emotionalResonance: "Desire, Overwhelm, Superficiality.",
    scenarios: [
      { scenario: "Lost in mall", interpretation: "You are confused about your values or what you want in life." },
      { scenario: "Empty mall", interpretation: "You feel disconnected from society or that material things have lost value." },
      { scenario: "Buying clothes", interpretation: "You are trying on a new persona or identity." }
    ]
  },
  {
    name: "Library",
    category: "Places",
    meaning: "Knowledge, wisdom, and the search for answers.",
    longDescription: "Libraries store the collective knowledge of humanity. Dreaming of one suggests you are seeking answers or wisdom. It represents the intellectual side of the Self and the 'Akashic Records' (universal memory).",
    jungianArchetype: "Collective Wisdom",
    keywords: ["books", "reading", "quiet", "librarian"],
    culturalSignificance: "The Library of Alexandria. Symbol of accumulated human knowledge.",
    emotionalResonance: "Quiet, Curiosity, Respect.",
    scenarios: [
      { scenario: "Cannot find book", interpretation: "You are looking for an answer but cannot find it." },
      { scenario: "Returning books", interpretation: "You are closing a chapter of learning or paying a karmic debt." },
      { scenario: "Old library", interpretation: "Connecting with ancient wisdom or your own past knowledge." }
    ]
  },
  {
    name: "Island",
    category: "Places",
    meaning: "Isolation, independence, or sanctuary.",
    longDescription: "An island is surrounded by water (unconscious/emotions). It can represent a safe sanctuary from the chaos of life, or it can represent extreme isolation and loneliness ('No man is an island').",
    jungianArchetype: "The Self (Isolated)",
    keywords: ["beach", "castaway", "tropical", "ocean"],
    culturalSignificance: "Robinson Crusoe. Utopia. Paradise or prison.",
    emotionalResonance: "Isolation, Peace, Loneliness.",
    scenarios: [
      { scenario: "Stranded on island", interpretation: "You feel cut off from others and help; loneliness." },
      { scenario: "Tropical paradise", interpretation: "A desire for rest, relaxation, and escape from stress." },
      { scenario: "Sinking island", interpretation: "Your safe haven is being overwhelmed by emotions." }
    ]
  },
  {
    name: "Amusement Park",
    category: "Places",
    meaning: "Emotional ups and downs, chaos, and childhood.",
    longDescription: "Amusement parks are designed for fun but can be chaotic and nauseating. They represent the 'rollercoaster' of emotions. They can also symbolize a desire to return to childhood fun, or feeling distracted by cheap thrills.",
    jungianArchetype: "The Trickster / Chaos",
    keywords: ["rollercoaster", "carnival", "ferris wheel", "fun"],
    culturalSignificance: "Places of escapism and manufactured joy.",
    emotionalResonance: "Excitement, Nausea, Chaos.",
    scenarios: [
      { scenario: "Broken ride", interpretation: "Your life feels out of order; the 'fun' has stopped." },
      { scenario: "Rollercoaster", interpretation: "You are going through extreme highs and lows in your waking life." },
      { scenario: "Lost child in park", interpretation: "Your inner child feels lost in the chaos of the adult world." }
    ]
  },
  {
    name: "Tunnel",
    category: "Places",
    meaning: "Transition, birth, and the passage through darkness.",
    longDescription: "A tunnel is a passage through the earth (unconscious). Entering a tunnel is entering a period of uncertainty. Seeing light at the end is a symbol of hope and rebirth. It is often a birth canal symbol.",
    jungianArchetype: "Rebirth / The Passage",
    keywords: ["underground", "darkness", "light at end", "train tunnel"],
    culturalSignificance: "Near-Death Experiences often involve a tunnel of light.",
    emotionalResonance: "Claustrophobia, Hope, Transition.",
    scenarios: [
      { scenario: "Endless tunnel", interpretation: "You feel stuck in a transitional phase with no end in sight." },
      { scenario: "Light at end of tunnel", interpretation: "Hope; the solution to your problem is visible." },
      { scenario: "Collapsed tunnel", interpretation: "A blockage in your life path; feeling buried." }
    ]
  },
  {
    name: "Road",
    category: "Places",
    meaning: "The journey of life and direction.",
    longDescription: "The road is the classic metaphor for life. Is it straight? Winding? Bumpy? Blocked? The condition of the road represents the condition of your life path.",
    jungianArchetype: "The Path",
    keywords: ["highway", "dirt road", "intersection", "traffic"],
    culturalSignificance: "The Yellow Brick Road. The Road Less Traveled.",
    emotionalResonance: "Direction, Uncertainty, Progress.",
    scenarios: [
      { scenario: "Crossroads", interpretation: "You are at a decision point; a choice must be made." },
      { scenario: "Dead end", interpretation: "You are pursuing a goal that leads nowhere." },
      { scenario: "Bumpy road", interpretation: "You are facing obstacles and difficulties in your current phase." }
    ]
  },
  {
    name: "Stairs",
    category: "Places",
    meaning: "Progress, regression, or spiritual ascent.",
    longDescription: "Stairs represent the journey up or down in consciousness. Going up represents success, spiritual growth, or confidence. Going down represents exploring the subconscious, bad luck, or regression.",
    jungianArchetype: "Ascension / Descent",
    keywords: ["climbing stairs", "falling down stairs", "endless stairs", "spiral staircase"],
    culturalSignificance: "Jacob's Ladder (stairs to heaven) connects the earthly and divine realms.",
    emotionalResonance: "Effort, Hope, or Frustration.",
    scenarios: [
      { scenario: "Walking up stairs", interpretation: "You are making progress towards a goal." },
      { scenario: "Falling down stairs", interpretation: "A sudden setback or loss of status." },
      { scenario: "Missing steps", interpretation: "You are moving too fast and not paying attention to details." }
    ]
  },

  // Events
  {
    name: "War",
    category: "Events",
    meaning: "Internal conflict, chaos, and aggression.",
    longDescription: "War represents a massive conflict. Usually, it is an internal war between two parts of your personality (e.g., duty vs. desire). It can also reflect a chaotic environment in your home or workplace.",
    jungianArchetype: "Conflict",
    keywords: ["battle", "soldier", "bombs", "fighting"],
    culturalSignificance: "Mars (God of War). The eternal struggle of opposites.",
    emotionalResonance: "Stress, Violence, Duty.",
    scenarios: [
      { scenario: "Fighting in war", interpretation: "You are actively engaged in a struggle." },
      { scenario: "Hiding from war", interpretation: "You are trying to avoid a conflict that needs to be addressed." },
      { scenario: "Post-war ruins", interpretation: "You are dealing with the aftermath of a major argument or trauma." }
    ]
  },
  {
    name: "Apocalypse",
    category: "Events",
    meaning: "Massive change, anxiety, and the end of an era.",
    longDescription: "Dreams of the apocalypse or the end of the world are terrifying but deeply symbolic. They rarely predict actual events. Instead, they signify that your personal world is shifting. An old way of life, a belief system, or a relationship is 'ending' so that something new can be born. It is the ultimate dream of transformation.",
    jungianArchetype: "The End Times / Transformation",
    keywords: ["end of world", "doomsday", "nuclear war", "survival"],
    culturalSignificance: "Book of Revelation. Ragnarok. The end of a cycle.",
    emotionalResonance: "Dread, Acceptance, Awe.",
    scenarios: [
      { scenario: "Surviving the apocalypse", interpretation: "You have the resilience to adapt to major life changes and start over." },
      { scenario: "Watching the world end", interpretation: "You feel helpless in the face of massive change or societal shifts." },
      { scenario: "Alien invasion", interpretation: "A feeling that your life is being invaded by foreign forces or new, unfamiliar ideas." }
    ]
  },
  {
    name: "Funeral",
    category: "Events",
    meaning: "Endings, letting go, and transition.",
    longDescription: "Funerals in dreams are rarely about literal death. They symbolize the end of a chapter, a relationship, or a part of your personality. It is a necessary ritual of saying goodbye so that something new can enter your life.",
    jungianArchetype: "Death / Rebirth",
    keywords: ["burial", "casket", "mourning", "graveyard"],
    culturalSignificance: "Rites of passage marking the transition from life to death.",
    emotionalResonance: "Sadness, Closure, Peace.",
    scenarios: [
      { scenario: "Attending your own funeral", interpretation: "You are acknowledging the death of your old self; a major transformation." },
      { scenario: "Funeral of a stranger", interpretation: "You are letting go of an old habit or a part of your life you no longer need." },
      { scenario: "Happy funeral", interpretation: "You have successfully processed a loss and are ready to move on." }
    ]
  },
  {
    name: "Car Accident",
    category: "Events",
    meaning: "Loss of control, conflict, and warning.",
    longDescription: "A car accident represents a collision of ideas, goals, or people in your life. It is often a warning from the subconscious that you are moving too fast or heading in the wrong direction. It can also symbolize a fear of losing control.",
    jungianArchetype: "Conflict / Crash",
    keywords: ["crash", "collision", "wreck", "ambulance"],
    culturalSignificance: "Modern symbol of sudden tragedy and technology failing.",
    emotionalResonance: "Shock, Fear, Helplessness.",
    scenarios: [
      { scenario: "Driving off a cliff", interpretation: "You are heading towards a disaster; you need to change course immediately." },
      { scenario: "Being a passenger in crash", interpretation: "You feel like a victim of someone else's poor decisions." },
      { scenario: "Surviving a crash", interpretation: "You will overcome a difficult conflict or mistake." }
    ]
  },
  {
    name: "Party",
    category: "Events",
    meaning: "Social connection, celebration, or anxiety.",
    longDescription: "Parties represent your social life and how you interact with others. If you are having fun, it reflects social confidence. If you are awkward or ignored, it reflects social anxiety or a feeling of not belonging.",
    jungianArchetype: "The Persona (Social Mask)",
    keywords: ["dancing", "friends", "social anxiety", "celebration"],
    culturalSignificance: "Festivals and bacchanals. Community bonding.",
    emotionalResonance: "Joy, Anxiety, Belonging.",
    scenarios: [
      { scenario: "Late to a party", interpretation: "Fear of missing out or feeling like an outsider." },
      { scenario: "Hostile party", interpretation: "You feel judged or unwelcome in your social circle." },
      { scenario: "Dancing at party", interpretation: "You are in harmony with your social environment and expressing yourself freely." }
    ]
  },
  {
    name: "Wedding",
    category: "Events",
    meaning: "Union, commitment, and transition.",
    longDescription: "Weddings symbolize the union of two aspects of yourself (conscious/unconscious, masculine/feminine). They represent a commitment to a new path. If you are stressed at the wedding, it reflects anxiety about a major life commitment.",
    jungianArchetype: "Coniunctio (Sacred Marriage)",
    keywords: ["bride", "groom", "marriage", "wedding dress"],
    culturalSignificance: "The Hieros Gamos (Sacred Marriage). Union of opposites.",
    emotionalResonance: "Joy, Commitment, Nervousness.",
    scenarios: [
      { scenario: "Late for own wedding", interpretation: "Doubts about a commitment or feeling unprepared for a new role." },
      { scenario: "Marrying a stranger", interpretation: "Integrating a new, unknown aspect of yourself." },
      { scenario: "Ruined wedding", interpretation: "Fear that a major life transition will go wrong." }
    ]
  }
];
