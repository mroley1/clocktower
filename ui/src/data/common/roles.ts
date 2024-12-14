/*
? descriptions

^name //* Display name for effect in UI
^effect //* Effect to be applied see Interaction.Effect enum
^length //* How long the effect should last
^sticky //* Should the effect persist through owner's death?                                              //! not implemented
^limitToSelf //* should this effect only be able to be applied to yourself
^availability //* when this effect is available see Interaction.EffectAvailability
^force //* action completed even if something would prevent it                                            //! not implemented
^static //* required value to be used for this action
^coverage //* rule for what situations this rule is effective see Interaction.ProtectionCoverage          //! not implemented

*/

import { Interaction } from "@/components/common/reactStates/Intereaction";
import { Alignmant } from "@/components/common/RoleType";

export type InteractionJSON = NONE|KILL|POISON|MADDEN|GRANT|CHANGE|CORRUPT|IMBIBE|PROTECT|REVIVE|BURY

// ^ NONE-0 no effect
export interface NONE {"name": string, "effect": Interaction.Effect.NONE, "length": number, "sticky": boolean, "limitToSelf": boolean, "availability": Interaction.EffectAvailability}

// ^ KILL-1 mark as dead
export interface KILL {"name": string, "effect": Interaction.Effect.KILL, "length": number, "limitToSelf": boolean, "availability": Interaction.EffectAvailability, "force": boolean}

// ^ POISON-2 poision
export interface POISON {"name": string, "effect": Interaction.Effect.POISON, "length": number, "sticky": boolean, "limitToSelf": boolean, "availability": Interaction.EffectAvailability}

// ^ MADDEN-3 make mad
export interface MADDEN {"name": string, "effect": Interaction.Effect.MADDEN, "length": number, "sticky": boolean, "limitToSelf": boolean, "availability": Interaction.EffectAvailability, "static": string|undefined}

// ^ GRANT-4 give the ability of
export interface GRANT {"name": string, "effect": Interaction.Effect.GRANT, "length": number, "sticky": boolean, "limitToSelf": boolean, "availability": Interaction.EffectAvailability, "static": string|undefined}

// ^ CHANGE-5 change role
export interface CHANGE {"name": string, "effect": Interaction.Effect.CHANGE, "length": number, "limitToSelf": boolean, "availability": Interaction.EffectAvailability, "static": string|undefined}

// ^ CORRUPT-6 change alignment
export interface CORRUPT {"name": string, "effect": Interaction.Effect.CORRUPT, "length": number, "limitToSelf": boolean, "availability": Interaction.EffectAvailability, "static": Alignmant|undefined}

// ^ IMBIBE-7 make drunk
export interface IMBIBE {"name": string, "effect": Interaction.Effect.IMBIBE, "length": number, "sticky": boolean, "limitToSelf": boolean, "availability": Interaction.EffectAvailability}

// ^ PROTECT-8 protect from killing
export interface PROTECT {"name": string, "effect": Interaction.Effect.PROTECT, "length": number, "sticky": boolean, "limitToSelf": boolean, "availability": Interaction.EffectAvailability, "coverage": Interaction.ProtectionCoverage}

// ^ REVIVE-9 bring back to life
export interface REVIVE {"name": string, "effect": Interaction.Effect.REVIVE, "length": number, "limitToSelf": boolean, "availability": Interaction.EffectAvailability}

// ^ BURY-10 make it look like they are dead
export interface BURY {"name": string, "effect": Interaction.Effect.BURY, "length": number, "sticky": boolean, "limitToSelf": boolean, "availability": Interaction.EffectAvailability}
