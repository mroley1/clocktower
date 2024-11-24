/*
? descriptions

^name //* Display name for effect in UI
^effect //* Effect to be applied see Interaction.Effect enum
^setup //* effect only available during setup
^length //* How long the effect should last
^sticky //* Should the effect persist through owner's death?
^limitToSelf //* should this effect only be able to be applied to yourself
^public //* effects by default are only available on their owner's turn. setting this to true means it can be applied at any time
^force //* action completed even if something would prevent it
^static //* required value to be used for this action
^all //* rule active for all situations
^onlyDemon //* rule is active only when interacted with by a demon
^execution //* rule active only during an execution

*/

import { Interaction } from "@/components/common/reactStates/Intereaction";
import { Alignmant } from "@/components/common/RoleType";

export type InteractionJSON = NONE|KILL|POISON|MADDEN|GRANT|CHANGE|CORRUPT|IMBIBE|PROTECT|REVIVE|BURY

// ^ NONE-0 no effect
export interface NONE {"name": string, "effect": Interaction.Effect.NONE, "setup": boolean, "length": number, "sticky": boolean, "limitToSelf": boolean, "public": boolean}

// ^ KILL-1 mark as dead
export interface KILL {"name": string, "effect": Interaction.Effect.KILL, "setup": boolean, "length": number, "limitToSelf": boolean, "public": boolean, "force": boolean}

// ^ POISON-2 poision
export interface POISON {"name": string, "effect": Interaction.Effect.POISON, "setup": boolean, "length": number, "sticky": boolean, "limitToSelf": boolean, "public": boolean}

// ^ MADDEN-3 make mad
export interface MADDEN {"name": string, "effect": Interaction.Effect.MADDEN, "setup": boolean, "length": number, "sticky": boolean, "limitToSelf": boolean, "public": boolean, "static": string|undefined}

// ^ GRANT-4 give the ability of
export interface GRANT {"name": string, "effect": Interaction.Effect.GRANT, "setup": boolean, "length": number, "sticky": boolean, "limitToSelf": boolean, "public": boolean, "static": string|undefined}

// ^ CHANGE-5 change role
export interface CHANGE {"name": string, "effect": Interaction.Effect.CHANGE, "setup": boolean, "length": number, "limitToSelf": boolean, "public": boolean, "static": string|undefined}

// ^ CORRUPT-6 change alignment
export interface CORRUPT {"name": string, "effect": Interaction.Effect.CORRUPT, "setup": boolean, "length": number, "limitToSelf": boolean, "public": boolean, "static": Alignmant|undefined}

// ^ IMBIBE-7 make drunk
export interface IMBIBE {"name": string, "effect": Interaction.Effect.IMBIBE, "setup": boolean, "length": number, "sticky": boolean, "limitToSelf": boolean, "public": boolean}

// ^ PROTECT-8 protect from killing
export interface PROTECT {"name": string, "effect": Interaction.Effect.PROTECT, "setup": boolean, "length": number, "sticky": boolean, "limitToSelf": boolean, "public": boolean, "all": boolean, "onlyDemon": boolean, "execution": boolean}

// ^ REVIVE-9 bring back to life
export interface REVIVE {"name": string, "effect": Interaction.Effect.REVIVE, "setup": boolean, "length": number, "limitToSelf": boolean, "public": boolean}

// ^ BURY-10 make it look like they are dead
export interface BURY {"name": string, "effect": Interaction.Effect.BURY, "setup": boolean, "length": number, "sticky": boolean, "limitToSelf": boolean, "public": boolean}
