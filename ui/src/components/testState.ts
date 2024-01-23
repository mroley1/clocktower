import { AilmentTypes } from "@/common/AilmentTypes";
import { Alignment } from "@/common/Alignment";
import { GameMode } from "@/common/GameModes";
import GameStateType from "@/common/GameStateType";
import { RoleType } from "@/common/RoleType";
import { Viability } from "@/common/Viability";
import { ChooseType } from "@/common/action/ChooseType";

export const TESTSTATE: GameStateType = {
    "tokens": [
        {
            "id": "0",
            "role": {
                "id": "amnesiac",
                "name": "Amnesiac",
                "description": "You do not know what your ability is. Each day, privately guess what it is: you learn how accurate you are.",
                "alignment": Alignment.GOOD,
                "type": RoleType.TOWNSFOLK,
                "firstNight": "Decide the Amnesiac's entire ability. If the Amnesiac's ability causes them to wake tonight: Wake the Amnesiac and run their ability.",
                "otherNight": "If the Amnesiac's ability causes them to wake tonight: Wake the Amnesiac and run their ability.",
                "changeMakeup": [],
                "secret": true,
                "actions": [
                    {
                        "title": "test",
                        "choices": [
                            {
                                "title": "Do You Want To Use Your Ability?",
                                "type": ChooseType.YESNO,
                                "quantity": 1,
                                "exposeRoles": false,
                                "typeRestriction": [],
                                "alignmentRestriction": []
                            },
                            {
                                "title": "select two roles",
                                "type": ChooseType.ROLE,
                                "quantity": 2,
                                "exposeRoles": false,
                                "typeRestriction": [
                                    RoleType.MINION,
                                    RoleType.DEMON
                                ],
                                "alignmentRestriction": []
                            }
                        ],
                        "possibleAilments": [
                            {
                                "ailmentType": AilmentTypes.KILL,
                                "duration": -1
                            },
                            {
                                "ailmentType": AilmentTypes.DRUNK,
                                "duration": 2
                            }
                        ],
                        "singleton": true
                    },
                    {
                        "title": "test2",
                        "choices": [
                            {
                                "title": "select one player",
                                "type": ChooseType.PLAYER,
                                "quantity": 1,
                                "exposeRoles": false,
                                "typeRestriction": [],
                                "alignmentRestriction": []
                            }
                        ],
                        "possibleAilments": [
                            {
                                "ailmentType": AilmentTypes.REVIVE,
                                "duration": -1
                            }
                        ],
                        "singleton": false
                    }
                ],
                "hardMad": false,
                "getsBluffs": false
            },
            "name": "player 1",
            "xpos": 200,
            "ypos": 200,
            "pubNotes": "buffs?",
            "privNotes": "custom role thing",
            "viability": Viability.ALIVE,
            "ailments": [
                {
                    "type":AilmentTypes.DRUNK,
                    "from": 2,
                    "mad": null,
                    "duration": 0,
                    "priority": 1
                }
            ],
            "mad": null,
            "convinced": null,
            "bluffs": [
                "chef",
                "cult_leader",
                "drunk"
            ],
            "alignment": Alignment.GOOD,
            "usedActions": [
                "test"
            ]
        },
        {
            "id": "1",
            "role": {
                "id": "pit-hag",
                "name": "Pit-Hag",
                "description": "Each night*, choose a player & a character they become (if not-in-play). If a Demon is made, deaths tonight are arbitrary.",
                "alignment": Alignment.EVIL,
                "type": RoleType.MINION,
                "firstNight": "",
                "otherNight": "The Pit-Hag points to a player and a character on the sheet. If this character is not in play, wake that player and show them the 'You are' card and the relevant character token. If the character is in play, nothing happens.",
                "changeMakeup": [],
                "secret": true,
                "actions": [
                    {
                        "title": "test2",
                        "choices": [
                            {
                                "title": "select one player",
                                "type": ChooseType.PLAYER,
                                "quantity": 1,
                                "exposeRoles": false,
                                "typeRestriction": [],
                                "alignmentRestriction": []
                            }
                        ],
                        "possibleAilments": [
                            {
                                "ailmentType": AilmentTypes.REVIVE,
                                "duration": -1
                            }
                        ],
                        "singleton": false
                    }
                ],
                "hardMad": false,
                "getsBluffs": false
            },
            "name": "player 2",
            "xpos": 400,
            "ypos": 100,
            "pubNotes": "somebody",
            "privNotes": "Robert",
            "viability": 0,
            "ailments": [
                {
                    "type": AilmentTypes.DRUNK,
                    "from": 2,
                    "mad": null,
                    "duration": 0,
                    "priority": 1
                },
                {
                    "type": AilmentTypes.POISON,
                    "from": 2,
                    "mad": null,
                    "duration": 0,
                    "priority": 1
                }
            ],
            "mad": null,
            "convinced": null,
            "bluffs": [],
            "alignment": Alignment.EVIL,
            "usedActions": []
        },
        {
            "id": "2",
            "role": {
                "id": "bishop",
                "name": "Bishop",
                "description": "Only the Storyteller can nominate. At least 1 opposing player must be nominated each day.",
                "alignment": Alignment.STORYTELLER,
                "type": RoleType.TRAVELLER,
                "firstNight": "",
                "otherNight": "",
                "changeMakeup": [],
                "secret": false,
                "actions": [],
                "hardMad": false,
                "getsBluffs": false
            },
            "name": "player 3",
            "xpos": 370,
            "ypos": 300,
            "pubNotes": "",
            "privNotes": "",
            "viability": 0,
            "ailments": [
                {
                    "type": AilmentTypes.MAD,
                    "from": 2,
                    "mad": "amnesiac",
                    "duration": 0,
                    "priority": 1
                },
                {
                    "type": AilmentTypes.DRUNK,
                    "from": 2,
                    "mad": null,
                    "duration": 0,
                    "priority": 1
                },
                {
                    "type": AilmentTypes.POISON,
                    "from": 2,
                    "mad": null,
                    "duration": 0,
                    "priority": 1
                }
            ],
            "mad": "farmer",
            "convinced": null,
            "bluffs": [],
            "alignment": Alignment.STORYTELLER,
            "usedActions": []
        }
    ],
    "gameMode": GameMode.SETUP,
    "onBlock": null,
    "script": {
        "meta": {
          "author": "Test User",
          "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sed nisi ut mauris tincidunt posuere. Suspendisse ut maximus dui.",
          "difficulty": 10,
          "gameType": "NORMAL",
          "name": "New Script",
          "date": ""
        },
        "roles": [],
        "recommendedFabled": [],
        "customJinxes": []
      },
      "quickAccessSettings": {
        "nominationHelp": true
      }
}