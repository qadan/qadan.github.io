/**
 * @file
 * Weights data as an object.
 */

/**
 * Returns weights data object.
 *
 * @return object
 *   Weights data.
 */
function get_weights_data() {
  return {
    "glitches_required": {
      "name": "Glitches Required",
      "group": "Item Placement",
      "description": "The types of glitches that may be required to complete the seed. Note that in the current build of EntranceRandomizer, overworld_glitches and major_glitches are not supported.",
      "options": {
        "none": {
          "name": "None",
          "description": "No glitches will be required to complete the seed.",
          "default": 100
        },
        "overworld_glitches": {
          "name": "Overworld Glitches",
          "description": "Boots clipping, bunny death mountain descent, and overworld superbunny tricks may be required to complete the seed."
        },
        "major_glitches": {
          "name": "Major Glitches",
          "description": "Some interior clipping may be required to complete the seed."
        },
        "no_logic": {
          "name": "No Logic",
          "description": "Items are placed anywhere with no consideration of requirements."
        }
      }
    },
    "item_placement": {
      "name": "Item Placement Difficulty",
      "group": "Item Placement",
      "description": "Whether or not items will be placed in obscure locations. It's worth checking a detailed description of these options on the <a href='https://alttpr.com/en/options' target='_blank'>official site</a>.",
      "options": {
        "basic": {
          "name": "Basic",
          "description": "Items are not placed in obscure or hard-to-reach locations.",
          "default": 33
        },
        "advanced": {
          "name": "Advanced",
          "description": "Items may be placed in obscure or hard-to-reach locations, notably in dark rooms that can be reached by lighting torches with the fire rod.",
          "default": 67
        }
      }
    },
    "dungeon_items": {
      "name": "Dungeon Item Shuffle (Keysanity)",
      "group": "Item Placement",
      "description": "Whether dungeon maps, compasses, and keys are shuffled outside of their dungeons.",
      "options": {
        "standard": {
          "name": "Standard",
          "description": "Maps, keys and compasses can be found shuffled inside their respective dungeons.",
          "default": 40
        },
        "mc": {
          "name": "Maps and Compasses",
          "description": "Maps and compasses can be found outside of their respective dungeons.",
          "default": 15
        },
        "mcs": {
          "name": "Maps, Compasses and Small Keys",
          "description": "Maps, compasses and small keys can be found outside of their respective dungeons.",
          "default": 15
        },
        "full": {
          "name": "Full Keysanity",
          "description": "Maps, compasses, small keys and big keys can be found outside of their respective dungeons.",
          "default": 20
        }
      }
    },
    "accessibility": {
      "name": "Item Check Accessibility",
      "group": "Item Placement",
      "description": "The degree to which locking items behind themselves is considered valid.",
      "options": {
        "items": {
          "name": "100% Inventory",
          "description": "All inventory items will be obtainable, but keys in dungeons may be locked behind themselves.",
          "default": 70
        },
        "locations": {
          "name": "100% Locations",
          "description": "All 216 shuffled items in the game will be accessible."
        },
        "none": {
          "name": "Beatable Only",
          "description": "The seed is only guaranteed to be beatable, and some inventory items or keys may never be accessible.",
          "default": 30
        }
      }
    },
    "goals": {
      "name": "Win Condition",
      "group": "Goals",
      "description": "The endgame requirement to beat the seed.",
      "options": {
        "ganon": {
          "name": "Defeat Ganon",
          "description": "The player must defeat Aghanim 2 at the top of Ganon's Tower, collect the right number of crystals to kill Ganon, and kill Ganon.",
          "default": 35
        },
        "fast_ganon": {
          "name": "Fast Ganon",
          "description": "The player must collect the right number of crystals to kill ganon, and kill Ganon. The hole leading to Ganon is pre-opened.",
          "default": 40
        },
        "dungeons": {
          "name": "All Dungeons",
          "description": "The player must complete all Light and Dark World dungeons, including Aghanim's Tower and Ganon's Tower, then kill Ganon.",
          "default": 10
        },
        "pedestal": {
          "name": "Pedestal",
          "description": "The player must obtain all three pendants, then pull the Master Sword pedestal.",
          "default": 10
        },
        "triforce_hunt": {
          "name": "Triforce Hunt",
          "description": "The player must collect 20 out of the 30 triforce pieces hidden throughout Hyrule.",
          "default": 5
        }
      }
    },
    "tower_open": {
      "name": "Ganon's Tower Required Crystals",
      "group": "Goals",
      "description": "The number of crystals required to open Ganon's Tower. Bear in mind that if weight is given to 'Random', the mystery randomizer can randomly select a random number, invalidating any 0 weights.",
      "options": {
        "0": {
          "name": "0",
          "default": 5
        },
        "1": {
          "name": "1",
          "default": 5
        },
        "2": {
          "name": "2",
          "default": 10
        },
        "3": {
          "name": "3",
          "default": 10
        },
        "4": {
          "name": "4",
          "default": 20
        },
        "5": {
          "name": "5",
          "default": 40
        },
        "6": {
          "name": "6",
          "default": 15
        },
        "7": {
          "name": "7",
          "default": 5
        },
        "random": {
          "name": "Random",
          "description": "Randomly pick a number of crystals from 0 to 7."
        }
      }
    },
    "ganon_open": {
      "name": "Ganon Vulnerable Required Crystals",
      "group": "Goals",
      "description": "The number of crystals required to make Ganon vulnerable to attack in the 4th phase of his fight. Bear in mind that if weight is given to 'Random', the mystery randomizer can randomly select a random number, invalidating any 0 weights.",
      "options": {
        "0": {
          "name": "0",
          "default": 5
        },
        "1": {
          "name": "1",
          "default": 5
        },
        "2": {
          "name": "2",
          "default": 5
        },
        "3": {
          "name": "3",
          "default": 5
        },
        "4": {
          "name": "4",
          "default": 10
        },
        "5": {
          "name": "5",
          "default": 10
        },
        "6": {
          "name": "6",
          "default": 20
        },
        "7": {
          "name": "7",
          "default": 40
        },
        "random": {
          "name": "Random",
          "description": "Randomly pick a number of crystals from 0 to 7."
        }
      }
    },
    "world_state": {
      "name": "World State",
      "group": "Gameplay",
      "description": "The state that the world will be in when you start your game, and as you play.",
      "options": {
        "standard": {
          "name": "Standard",
          "description": "Start in Uncle's house, get a weapon from him, and save Zelda from Hyrule Castle before starting the game.",
          "default": 35
        },
        "open": {
          "name": "Open",
          "description": "Zelda has been pre-rescued for you, and you can begin in Link's House or Sanctuary from the beginning",
          "default": 35
        },
        "inverted": {
          "name": "Inverted",
          "description": "Start in the Dark World, requiring the Moon Pearl to traverse the Light World as Link. It's very much worth checking the details for this on the <a href='https://alttpr.com/en/options' target='_blank'>official site</a>.",
          "default": 20
        },
        "retro": {
          "name": "Retro",
          "description": "Arrows and keys must be purchased, firing arrows costs money, and some single-entry caves contain take-any choices or a sword",
          "default": 10
        }
      }
    },
    "entrance_shuffle": {
      "name": "Entrance Shuffle",
      "group": "Gameplay",
      "description": "The method by which overworld entrances are shuffled between themselves.",
      "options": {
        "none": {
          "name": "None",
          "description": "Entrances are not shuffled between themselves.",
          "default": 100
        },
        "simple": {
          "name": "Simple",
          "description": "Entrances are sorted into a large set of groups, and those groups are shuffled between themselves. Check the <a href='https://alttpr.com/en/options' target='_blank'>official site</a> to see how these entrances are grouped."
        },
        "restricted": {
          "name": "Restricted",
          "description": "Same as Simple, but all non-dungeon entrances are now grouped together. Multi-entrance caves will not take you between the Dark and Light Worlds."
        },
        "full": {
          "name": "Full",
          "description": "Same as Restricted, but dungeons are now grouped with non-dungeon entrances."
        },
        "crossed": {
          "name": "Crossed",
          "description": "Same as Full, but multi-entrance caves can take you between the Dark and Light Worlds."
        },
        "insanity": {
          "name": "Insanity",
          "description": "Same as Crossed, but interior doors for multi-entrance caves and dungeons no longer necessarily lead back to the overworld entrance they came from."
        }
      }
    },
    "hints": {
      "name": "Hints",
      "group": "Gameplay",
      "description": "Whether or not seed-specific hints are given by hint tiles and characters.",
      "options": {
        "on": {
          "name": "On",
          "default": 50
        },
        "off": {
          "name": "Off",
          "default": 50
        }
      }
    },
    "weapons": {
      "name": "Sword Placement",
      "group": "Gameplay",
      "description": "The method used to shuffle swords into the game.",
      "options": {
        "randomized": {
          "name": "Randomized",
          "description": "All four swords are placed in random locations. In a standard seed, Uncle may give you a different weapon.",
          "default": 40
        },
        "assured": {
          "name": "Assured",
          "description": "Link starts the game equipped with the Fighter's Sword. Three other swords are placed in random locations.",
          "default": 40
        },
        "vanilla": {
          "name": "Vanilla",
          "description": "One sword is placed on Uncle, one on the Master Sword pedestal, one at the Blacksmith's, and one at Pyramid Fairy.",
          "default": 10
        },
        "swordless": {
          "name": "Swordless",
          "description": "No swords are placed in the game. Some changes are made to gameplay to facilitate this; check the <a href='https://alttpr.com/en/options' target='_blank'>official site</a> for details.",
          "default": 5
        }
      }
    },
    "item_pool": {
      "name": "Item Pool Difficulty",
      "group": "Gameplay",
      "description": "The degree to which restrictions are made to the item pool to increase the game's difficulty. Check the <a href='https://alttpr.com/en/options' target='_blank'>official site</a> for a detailed item pool table.",
      "options": {
        "normal": {
          "name": "Normal",
          "description": "No changes are made to the item pool from the original game.",
          "default": 80
        },
        "hard": {
          "name": "Hard",
          "description": "A maximum of 11 hearts can be found, as well as up to green mail, tempered sword, fire shield, and wooden arrows.",
          "default": 20
        },
        "expert": {
          "name": "Expert",
          "description": "A maximum of 5 hearts can be found, as well as up to green mail, master sword, fighter's shield, and wooden arrows."
        }
      }
    },
    "item_functionality": {
      "name": "Item Functionality Difficulty",
      "group": "Gameplay",
      "description": "The degree to which restrictions are made on item functionality to increase the game's difficulty. Check the <a href='https://alttpr.com/en/options' target='_blank'>official site</a> for a detailed item functionality table. The Crowd Control option is intentionally omitted.",
      "options": {
        "normal": {
          "name": "Normal",
          "description": "All items function as they do in the original game.",
          "default": 80
        },
        "hard": {
          "name": "Hard",
          "description": "Potions are debuffed, faeries are made inaccessible, the cape magic consumption rate is doubled, Byrna no longer grants invincibility, and the boomerang no longer stuns enemies.",
          "default": 20
        },
        "expert": {
          "name": "Expert",
          "description": "Potions are further debuffed, and the hookshot no longer stuns enemies."
        }
      }
    },
    "beemizer": {
      "name": "Beemizer Level",
      "group": "Item Placement",
      "description": "The degree to which junk items are replaced with swarms of bees. Swarms of bees show up as a bee in a bottle. It should be noted that swarms of bees can despawn items, causing gameplay issues.",
      "options": {
        "0": {
          "name": "Off",
          "description": "No junk items are replaced with swarms of bees.",
          "default": 100
        },
        "1": {
          "name": "1",
          "description": "A few junk items are replaced with swarms of bees.",
        },
        "2": {
          "name": "2",
          "description": "Some junk items are replaced with swarms of bees.",
        },
        "3": {
          "name": "3",
          "description": "A lot of junk items, and occasionally bug nets, heart pieces, heart containers, boomerangs, magic, shield upgrades, and armor upgrades, are replaced with swarms of bees.",
        },
        "4": {
          "name": "4",
          "description": "Don't do this.",
        }
      }
    },
    "enemy_damage": {
      "name": "Enemy Damage",
      "group": "Enemizer",
      "description": "The amount of damage enemies deal to the player.",
      "options": {
        "default": {
          "name": "Normal",
          "description": "The amount of damage enemies deal is not changed from the original game.",
          "default": 80
        },
        "shuffled": {
          "name": "Shuffled",
          "description": "Enemies swap the amount of damage they deal amongst themselves.",
          "default": 20
        },
        "random": {
          "name": "Random",
          "description": "Each enemy deals a random amount of damage between 0 and 8 hearts, for each type of mail."
        }
      }
    },
    "enemy_health": {
      "name": "Enemy Health",
      "group": "Enemizer",
      "description": "The amount of damage required to kill enemies",
      "options": {
        "default": {
          "name": "Normal",
          "description": "The amount of damage required to kill enemies is not changed from the original game.",
          "default": 80
        },
        "easy": {
          "name": "Easy",
          "description": "Each enemy is randomly given 1-4HP, requiring 1-2 fighter's sword slashes to kill.",
          "default": 20
        },
        "hard": {
          "name": "Hard",
          "description": "Each enemy is randomly given 2-15HP, requiring 1-8 fighter's sword slashes to kill."
        },
        "expert": {
          "name": "Expert",
          "description": "Each enemy is randomly given 2-30HP, requiring 1-15 fighter's sword slashes to kill."
        }
      }
    },
    "boss_shuffle": {
      "name": "Boss Shuffle",
      "group": "Enemizer",
      "description": "The degree to which bosses are shuffled between boss locations.",
      "options": {
        "none": {
          "name": "Default",
          "description": "All bosses encountered in the game are the same as in the original game.",
          "default": 60
        },
        "simple": {
          "name": "Simple",
          "description": "The exact count of dungeon bosses and Ganon's Tower bosses remains the same, but they are shuffled between themselves.",
          "default": 10
        },
        "full": {
          "name": "Full",
          "description": "The three bosses which appear twice are randomized, and then bosses are shuffled between themselves.",
          "default": 10
        },
        "random": {
          "name": "Random",
          "description": "All bosses in dungeons and Ganon's Tower are chosen at random.",
          "default": 20
        }
      }
    },
    "enemy_shuffle": {
      "name": "Enemy Shuffle",
      "group": "Enemizer",
      "description": "The degree to which enemies are randomized.",
      "options": {
        "none": {
          "name": "Default",
          "description": "Enemies encountered are the same as in the original game.",
          "default": 80
        },
        "shuffled": {
          "name": "Shuffled",
          "description": "Enemies encountered are randomized. Thieves can be killed. Rooms no longer require specific weapons to kill all enemies (e.g., killing red mimics with the bow).",
          "default": 10
        },
        "random": {
          "name": "Random",
          "description": "Same as shuffled, but bush enemies are randomized, and the chance a bush may contain an enemy is increased. A random tile room pattern is selected.",
          "default": 10
        }
      }
    },
    "sprite": {
      "name": "Sprite",
      "group": "ROM Settings",
      "description": "Which sprite to use. Since this option is kind of volatile, you may want to edit the YAML after generation and swap out Link with your own preferred sprite, or add more of your own.",
      "options": {
        "Link": {
          "name": "Link",
          "default": 100
        },
        "random": {
          "name": "Random",
          "description": "Choose a random sprite."
        },
        "randomonhit": {
          "name": "Random On Hit",
          "description": "Randomly select a sprite, and randomly select a new sprite every time Link is hit."
        }
      }
    },
    "disablemusic": {
      "name": "Game Music",
      "group": "ROM Settings",
      "description": "The status of the in-game music. Turning the music off allows for MSU-1 sound packs to function. <strong>You will see these reversed in your resultant YAML</strong>; the language surrounding the in-game music status is counterintuitive and normalized here.",
      "_comment": "These aren't typos; the settings as-is are rather counterintuitive, and are normalized here to describe whether the music is 'on' or 'off'.",
      "options": {
        "off": {
          "name": "On",
          "default": 100
        },
        "on": {
          "name": "Off"
        }
      }
    },
    "heartcolor": {
      "name": "Heart Color",
      "group": "ROM Settings",
      "description": "The color of the hearts in the top-right corner of the screen. Bear in mind that putting weight in 'Random' means the mystery randomizer may randomly select a random color, invalidating any 0 weights.",
      "options": {
        "red": {
          "name": "Red",
          "default": 100
        },
        "blue": {
          "name": "Blue"
        },
        "green": {
          "name": "Green"
        },
        "yellow": {
          "name": "Yellow"
        },
        "random": {
          "name": "Random",
          "description": "Randomly select a heart color."
        }
      }
    },
    "heartbeep": {
      "name": "Heart Beep Speed",
      "group": "ROM Settings",
      "description": "How fast the heart beep sound repeats when Link is at low health.",
      "options": {
        "double": {
          "name": "2x Speed"
        },
        "normal": {
          "name": "1x Speed",
          "default": 100
        },
        "half": {
          "name": "1/2 Speed"
        },
        "quarter": {
          "name": "1/4 Speed"
        },
        "off": {
          "name": "No Beeping"
        }
      }
    },
    "ow_palettes": {
      "name": "Overworld Palette Shuffle",
      "group": "ROM Settings",
      "description": "The method for randomizing the color palettes for the overworld.",
      "options": {
        "default": {
          "name": "Default",
          "description": "Do not randomize the color palette for the overworld",
          "default": 100
        },
        "random": {
          "name": "Random",
          "description": "Completely randomize the color palette for the overworld"
        },
        "blackout": {
          "name": "Blackout",
          "description": "Set all colors for the overworld to completely black"
        }
      }
    },
    "uw_palettes": {
      "name": "Underworld Palette Shuffle",
      "group": "ROM Settings",
      "description": "The method for randomizing the color palettes for the underworld.",
      "options": {
        "default": {
          "name": "Default",
          "description": "Do not randomize the color palette for the underworld",
          "default": 100
        },
        "random": {
          "name": "Random",
          "description": "Completely randomize the color palette for the underworld"
        },
        "blackout": {
          "name": "Blackout",
          "description": "Set all colors for the underworld to completely black"
        }
      }
    }
  };
}
