// Palworld Video Challenge Templates & Generator Rules

export const COMBAT_PRESETS_DATA = {
  solo_meme: {
    id: 'solo_meme',
    title: '100 Days Solo Starter Pal Run',
    description: 'Can you defeat all 9 Official Tower Bosses (including Hard Mode) using ONLY a single Pal?',
    icon: '🐤',
    challenge_ruleset_brief: [
      "Use {PAL_NAME} as your only direct-damage Pal for the entire run.",
      "Defeat every designated Tower Boss with {PAL_NAME} as the main damage dealer.",
      "Defeat an Alpha Pal using only {PAL_NAME} and player equipment.",
      "Win a boss fight without changing your active Pal from {PAL_NAME}.",
      "Use {PARTNER_SKILL} during every major boss fight where it is available.",
      "Defeat a boss while {PAL_NAME} is under the boss's recommended level.",
      "Defeat a boss without player weapon damage if {PAL_NAME} can deal direct damage.",
      "Defeat a boss with {PAL_NAME} surviving above 25% HP.",
      "Fight a dungeon boss using {PAL_NAME} as the only combat Pal.",
      "For a mount-capable Pal, defeat a boss while mounted on {PAL_NAME}.",
      "For a gun/weapon Pal, make its weapon Partner Skill ({PARTNER_SKILL}) a major source of boss damage.",
      "For an explosive Pal, use its explosive Partner Skill during a boss fight.",
      "For a ranged Pal, win a major boss fight without using melee weapons.",
      "For a melee Pal, win a major boss fight without using firearms.",
      "Finish the final combat milestone with the same {PAL_NAME} chosen at the start."
    ],
    viral_youtube_title_ideas: [
      "I Used ONLY {PAL_NAME} for 100 Days in Palworld",
      "Can {PAL_NAME} Beat EVERY Boss in Palworld?",
      "100 Days With ONE Pal Was a Terrible Idea",
      "{PAL_NAME} vs EVERY Tower Boss in Palworld",
      "I Made {PAL_NAME} My ONLY Weapon for 100 Days",
      "One Pal. Every Boss. No Backup.",
      "I Forced {PAL_NAME} to Become a Boss Killer",
      "Can {PAL_NAME} Carry an Entire Palworld Run?",
      "I Refused to Catch a Better Combat Pal Than {PAL_NAME}",
      "100 Days of Pure Combat With {PAL_NAME}",
      "{PAL_NAME} Had to Fight EVERYTHING",
      "I Took {PAL_NAME} From Starter to Endgame",
      "How Far Can {PAL_NAME} Really Go?",
      "I Turned {PAL_NAME} Into a War Machine",
      "100 Days, ONE {PAL_NAME}, ZERO Backup"
    ]
  },

  element_lock: {
    id: 'element_lock',
    title: 'Single Element Lockdown',
    description: 'Survive Palworld using ONLY Pals of a single element type (e.g. Fire, Water, Electric).',
    icon: '⚡',
    challenge_ruleset_brief: [
      "Only use Pals containing {ELEMENT} for direct combat.",
      "Defeat three bosses without using a non-{ELEMENT} combat Pal.",
      "Use {PAL_NAME} as the main damage dealer against a major boss.",
      "Fight an enemy that resists {ELEMENT} without changing element.",
      "Defeat an Alpha using only {ELEMENT} Pals.",
      "Defeat a dungeon boss with an {ELEMENT}-only combat roster.",
      "Use {PARTNER_SKILL} during a major boss fight.",
      "Defeat a boss without relying on a type advantage from outside {ELEMENT}.",
      "Keep the same {ELEMENT} lineup for two consecutive bosses.",
      "Defeat a boss while {PAL_NAME} is underleveled.",
      "Use only {ELEMENT} Pals against an enemy with a bad elemental matchup.",
      "Win a boss fight without reviving a knocked-out {ELEMENT} Pal.",
      "For ranged {ELEMENT} Pals, win a boss without player melee attacks.",
      "For melee {ELEMENT} Pals, win a boss without player firearms.",
      "Finish the challenge with {PAL_NAME} surviving the final battle."
    ],
    viral_youtube_title_ideas: [
      "I Used ONLY {ELEMENT} Pals to Beat Palworld",
      "{ELEMENT} Pals vs EVERY Boss in Palworld",
      "Can {ELEMENT} Type Beat Palworld?",
      "I Locked My Entire Team to ONE Element ({ELEMENT})",
      "The {ELEMENT}-Only Challenge Was BRUTAL",
      "I Tried Beating Palworld Without Changing Elements",
      "Can {PAL_NAME} Carry the Entire {ELEMENT} Team?",
      "{ELEMENT} vs Its WORST Elemental Matchup",
      "I Fought Every Boss With ONE Element ({ELEMENT})",
      "Palworld But I Can ONLY Use {ELEMENT} Pals",
      "How Far Can ONE Element ({ELEMENT}) Really Go?",
      "I Made Palworld an {ELEMENT}-Only Game",
      "This {ELEMENT} Team Was NOT Supposed to Beat This Boss",
      "{ELEMENT} Pals Are Stronger Than I Expected",
      "One Element ({ELEMENT}). Every Boss. No Exceptions."
    ]
  },

  permadeath_nuzlocke: {
    id: 'permadeath_nuzlocke',
    title: 'Palworld Permadeath Nuzlocke',
    description: 'The ultimate survival test. Pal faint = permanently deleted!',
    icon: '💀',
    challenge_ruleset_brief: [
      "Any Pal knocked out during a designated boss fight is permanently retired.",
      "If {PAL_NAME} is knocked out, it can never return to combat.",
      "Every boss must include a living member of your registered combat roster.",
      "Do not replace a fallen Pal with an already-mastered endgame Pal.",
      "Keep {PAL_NAME} alive through the first major boss fight.",
      "A boss victory only counts if {PAL_NAME} survives the fight.",
      "If the leader falls, the next legal Pal becomes the new leader.",
      "No revival mechanics may bypass the permadeath rule.",
      "Do not swap to an unregistered combat Pal during a boss fight.",
      "A Pal below 25% HP after a boss must be benched for the next boss.",
      "Defeat five major bosses without losing {PAL_NAME}.",
      "Using {PARTNER_SKILL} is allowed but knockout still means death.",
      "Defeat a major boss with fewer than three living combat Pals.",
      "The final boss must be fought only with Pals that survived the run.",
      "Every victory must be earned without restarting a lost boss fight."
    ],
    viral_youtube_title_ideas: [
      "Every Pal I Lose Is GONE FOREVER",
      "I Played Palworld With PERMADEATH",
      "One KO Could Ruin My Entire Run with {PAL_NAME}",
      "Palworld Nuzlocke But Every Boss Can Kill My Pals",
      "I Was TERRIFIED of Every Boss Fight",
      "Can I Beat Palworld Without Losing {PAL_NAME}?",
      "My Pals Die FOREVER in This Challenge",
      "One Mistake = One Dead Pal",
      "I Turned Palworld Into a Hardcore Nuzlocke",
      "Every Boss Fight Could End My Entire Run",
      "This Palworld Challenge Has NO Second Chances",
      "I Couldn't Replace My Dead Pals",
      "I Risked {PAL_NAME} Against EVERY Boss",
      "Palworld But My Pals Have ONE Life",
      "The Boss Fight That Nearly Ended Everything"
    ]
  },

  mastered_elimination: {
    id: 'mastered_elimination',
    title: 'Mastered Pals Elimination Series',
    description: 'Every time you beat a Tower Boss with a Pal, that Pal is VAULTED forever!',
    icon: '🏆',
    challenge_ruleset_brief: [
      "Once {PAL_NAME} defeats a designated boss, permanently remove it from combat.",
      "A Pal only becomes mastered if it actively contributes damage.",
      "Never reuse a mastered combat Pal in future boss fights.",
      "The next boss must use a different active combat Pal.",
      "Use {PARTNER_SKILL} before mastery is awarded for {PAL_NAME}.",
      "For gun users, use the firearm Partner Skill before mastery.",
      "For explosive Pals, trigger the explosive Partner Skill before mastery.",
      "For mount combat Pals, fight the boss while mounted on {PAL_NAME}.",
      "A Pal that is knocked out before the boss dies cannot earn mastery.",
      "Do not use the same Pal species twice in the elimination series.",
      "Every boss victory removes exactly one Pal from the legal combat pool.",
      "Optional brutal mode: any Pal knocked out in a losing attempt is also eliminated.",
      "Only the Pal delivering the finishing blow earns mastery.",
      "Choose every next Pal randomly from the remaining legal pool.",
      "The final remaining combat Pal must defeat the final designated boss."
    ],
    viral_youtube_title_ideas: [
      "Every Pal That Beats a Boss Gets DELETED",
      "I Can't Reuse a Pal After It Wins in Palworld",
      "Every Boss Removes One Pal From My Team",
      "Can I Beat Every Boss Before Running Out of Pals?",
      "I Turned Palworld Into an Elimination Tournament",
      "My Strongest Pals Were Allowed ONE Win",
      "Every Victory Makes My Team WEAKER",
      "I Had to Retire {PAL_NAME} After It Won",
      "The Last Pal Standing Must Beat the Final Boss",
      "I Could Never Use the Same Pal Twice",
      "Every Boss Permanently Removes a Pal",
      "I Started With 299 Pals and Had to Eliminate Them",
      "Every Boss Fight Costs Me a Pal",
      "This Challenge Gets HARDER After Every Victory",
      "One Boss. One Winner. {PAL_NAME} Gone Forever."
    ]
  },

  zero_crafting: {
    id: 'zero_crafting',
    title: 'No Base Automation / Raw Survival',
    description: 'Survive without relying on automated base labor. You do the crafting yourself!',
    icon: '🛠️',
    challenge_ruleset_brief: [
      "No automated base production may be used to prepare for designated boss fights.",
      "Use {PAL_NAME} as your main combat Pal for the first major boss.",
      "Every boss must include {PAL_NAME} unless it has been eliminated.",
      "Craft combat equipment manually instead of relying on automated production.",
      "Do not bring a stronger Pal unless it has a defined combat role.",
      "Defeat an Alpha Pal using only manually gathered resources.",
      "Defeat a dungeon boss without automated base support.",
      "Use {PARTNER_SKILL} during a major combat encounter.",
      "For gun users, use the Pal's weapon Partner Skill in a major fight.",
      "For explosive Pals, use the explosive Partner Skill during a boss.",
      "For mount-capable Pals, complete one boss while mounted on {PAL_NAME}.",
      "For ranged Pals, complete one boss without melee weapons.",
      "For melee Pals, complete one boss without firearms.",
      "Defeat a boss using only manually crafted combat supplies.",
      "Finish a major boss fight with the selected {PAL_NAME} alive."
    ],
    viral_youtube_title_ideas: [
      "I Removed EVERYTHING That Makes Palworld Easy",
      "Palworld But I Have NO Automated Base",
      "I Survived Palworld With RAW Survival Only",
      "No Automation. No Easy Mode. Just Combat.",
      "Can {PAL_NAME} Carry a No-Base Run?",
      "I Banned Automation and Fought EVERY Boss",
      "Palworld Without My Base Doing the Work",
      "I Had to Manually Prepare for EVERY Boss",
      "This Challenge Removed My Entire Safety Net",
      "I Survived With Only What I Could Craft",
      "No Automation Made These Bosses BRUTAL",
      "I Tried Beating Palworld Without Base Advantages",
      "My Base Was USELESS for This Entire Run",
      "I Fought Bosses With Nothing but Raw Survival",
      "Can {PAL_NAME} Survive Without an Automated Base?"
    ]
  }
};

export const CHALLENGE_PRESETS = Object.values(COMBAT_PRESETS_DATA);

export const THUMBNAIL_CONCEPTS = [
  { style: 'Epic Battle Glow', text: 'IMPOSSIBLE RUN?', subtitle: 'ONLY {pal_name}!' },
  { style: 'Clickbait Shocked Face', text: '100 DAYS', subtitle: 'WITH THIS PAL?!' },
  { style: 'Stat Bar Maxed', text: '9999 DAMAGE', subtitle: 'SECRET OP PAL' },
  { style: 'Vs Boss Showcase', text: '{pal_name} VS JETRAGON', subtitle: 'WHO WINS?' }
];
