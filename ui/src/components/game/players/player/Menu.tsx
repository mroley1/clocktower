import { createContext, useContext, useEffect, useRef, useState } from 'react';
import styles from './Player.module.scss';
import { ControllerContext, ReferenceContext, GameContext } from '../../Game';
import { Player } from '@/components/common/reactStates/Player';
import { Alignmant } from '../../../../components/common/RoleType';
import RolePick from '../../utility/RolePick';
import AlignmentPick from '../../utility/AlignmentPick';
import { ReferenceData } from '@/components/common/ReferenceData';
import { applyEffect, EffectKit } from '../../utility/ApplyEffect';
import BagSelect from '../../utility/BagSelect';

export const enum MenuOption {
    SELECTROLE,
    SELECTALIGNMENT,
    PICKFROMBAG,
    SELECTMADNESS,
    SELECTGRANTABILITY
}

interface MenuProps {isOpen: boolean, closeFunc: () => void, playerData: Player.Data}
function Menu({isOpen, closeFunc, playerData}: MenuProps) {
    
    const gameContext = useContext(GameContext);
    const controllerContext = useContext(ControllerContext)
    const referenceContext = useContext(ReferenceContext)
    
    const effectStore = useRef<ReferenceData.Interaction|null>(null)
    
    const [selectedMenuOption, setSelctedMenuOption] = useState<MenuOption|undefined>(undefined)
    
    function closeModal() {
        setSelctedMenuOption(undefined)
        closeFunc()
    }
    
    function setRole(roleId: string|undefined) {
        if (roleId) {
            controllerContext.batchBuild(() => {
                playerData.role = roleId
                const roleData = referenceContext.roles.getRole(playerData.role)
                if (playerData.alignment == Alignmant.NONE) {
                    playerData.alignment = roleData.alignment
                    setAlignment(roleData.alignment)
                }
            })
            setSelctedMenuOption(undefined)
        }
    }
    
    function setAlignment(alignment: Alignmant) {
        playerData.alignment = alignment
        setSelctedMenuOption(undefined)
    }
    
    function addMad(roleId: string) {
        if (effectStore.current) {
            controllerContext.aggregateData.addInteraction(effectStore.current!, playerData.id, roleId)
            setSelctedMenuOption(undefined)
        }
    }
    
    function grantAbility(roleId: string) {
        if (effectStore.current) {
            controllerContext.aggregateData.addInteraction(effectStore.current!, playerData.id, roleId)
            setSelctedMenuOption(undefined)
        }
    }
    
    function pickFromBag(roleId: string) {
        if (roleId) {
            controllerContext.batchBuild(() => {
                playerData.role = roleId
                const roleData = referenceContext.roles.getRole(playerData.role)
                setAlignment(roleData.alignment)
            })
            setSelctedMenuOption(undefined)
        }
    }
    
    const applyEffectHandler = (interaction: ReferenceData.Interaction) => {
        controllerContext.batchBuild(() => {
            
            const effectKit: EffectKit = {
                interaction: interaction,
                player: playerData,
                openMenu: setSelctedMenuOption,
                roleSelect: setRole,
                alignmentSelect: setAlignment,
                madSelect: addMad,
                grantSelect: grantAbility
            }
            
            const shouldCreateInteractionNow = applyEffect(effectKit)
            
            if (shouldCreateInteractionNow) {
                controllerContext.aggregateData.addInteraction(interaction, playerData.id)
                closeModal()
            } else {
                effectStore.current = interaction
            }
        })
    }
    
    function Setup() {
        
        return (
            <div className={styles.container}>
                <div className={styles.major_options}>
                    <button onClick={()=>{setSelctedMenuOption(MenuOption.SELECTROLE)}}>Change Role</button>
                    <button onClick={()=>{setSelctedMenuOption(MenuOption.SELECTALIGNMENT)}}>Change Alignment</button>
                    <button onClick={()=>{setSelctedMenuOption(MenuOption.PICKFROMBAG)}}>Pick from bag</button>
                </div>
                <AvailableInteractions playerData={playerData} applyEffectHandler={applyEffectHandler}></AvailableInteractions>
                <ActiveInteractions playerData={playerData}></ActiveInteractions>
            </div>
        )
    }
    
    function NightTurn() {
        
        return (
            <div className={styles.container}>
                <div className={styles.major_options}>
                    <button onClick={()=>{setSelctedMenuOption(MenuOption.SELECTROLE)}}>Change Role</button>
                    <button onClick={()=>{setSelctedMenuOption(MenuOption.SELECTALIGNMENT)}}>Change Alignment</button>
                </div>
                <AvailableInteractions playerData={playerData} applyEffectHandler={applyEffectHandler}></AvailableInteractions>
                <ActiveInteractions playerData={playerData}></ActiveInteractions>
                <Pictogram playerData={playerData}></Pictogram>
            </div>
        )
    }
    
    function Day() {
        return (
            <div className={styles.container}>
                <div className={styles.major_options}>
                    voting stuff
                    <button onClick={()=>{setSelctedMenuOption(MenuOption.SELECTROLE)}}>Change Role</button>
                    <button onClick={()=>{setSelctedMenuOption(MenuOption.SELECTALIGNMENT)}}>Change Alignment</button>
                </div>
                <AvailableInteractions playerData={playerData} applyEffectHandler={applyEffectHandler}></AvailableInteractions>
                <ActiveInteractions playerData={playerData}></ActiveInteractions>
            </div>
        )
    }
    
    function ModalContent() {
        
        if (selectedMenuOption != undefined) {
            switch (selectedMenuOption) {
                case MenuOption.SELECTROLE:
                    return <RolePick setRoleSelect={setRole}></RolePick>
                case MenuOption.SELECTALIGNMENT:
                    return <AlignmentPick setAlignmentSelect={setAlignment}></AlignmentPick>
                case MenuOption.PICKFROMBAG:
                    return <BagSelect pickFromBag={pickFromBag}></BagSelect>
                case MenuOption.SELECTMADNESS:
                    return <RolePick setRoleSelect={addMad}></RolePick>
                case MenuOption.SELECTGRANTABILITY:
                    return <RolePick setRoleSelect={grantAbility}></RolePick>
            }
        }
        
        if (gameContext.gameProgression.isSetup) {
            return <Setup></Setup>
        }
        
        if (gameContext.gameProgression.isNight) {
            return <NightTurn></NightTurn>
        }
        
        if (gameContext.gameProgression.isDay) {
            return <Day></Day>
        }
        
        console.error("No Menu Found")
        closeModal();
        return null
    }
  
    if (!isOpen) {
        return null
    } else {
        return (
            <div className={styles.menu_wrapper} onClick={closeModal}>
                <div className={styles.menu} onClick={(e)=>{e.stopPropagation()}}>
                    <ModalContent></ModalContent>
                    <div className={styles.exit} onClick={closeModal}>X</div>
                </div>
            </div>
        );
    }
}

export default Menu;

interface PictogramProps {
    playerData: Player.Data
}
function Pictogram({playerData}: PictogramProps) {
    
    const gameContext = useContext(GameContext);
    const referenceContext = useContext(ReferenceContext);
    
    // ? different pictograms for diiferent gameProgression states
    
    return (
        <div className={styles.pictogram}>
            {gameContext._global.currentSelected && gameContext._global.currentSelected != playerData.id && <>
                <img className={styles.player_image} src={referenceContext.image.getPlayerImage(gameContext.players.find(player => player.id == gameContext._global.currentSelected)!)}></img>
                {referenceContext.roles.getRole(gameContext.players.find(player => player.id == gameContext._global.currentSelected)!.role!).description}
                <img className={styles.relationship_image} src={require('../../../../assets/arrow-right-long-solid.png')}></img>
            </>}
            <img className={styles.player_image} src={referenceContext.image.getPlayerImage(playerData)}></img>
            {referenceContext.roles.getRole(playerData.role!).description}
            {gameContext._global.currentSelected == playerData.id && <>
                <img className={styles.relationship_image} src={require('../../../../assets/arrow-loop-left-solid.png')}></img>
            </>}
        </div>
    )
}

interface AvailableInteractionsProps {
    applyEffectHandler: (interaction: ReferenceData.Interaction) => void
    playerData: Player.Data
}
function AvailableInteractions({applyEffectHandler, playerData}: AvailableInteractionsProps) {
    
    const referenceContext = useContext(ReferenceContext)
    const controllerContext = useContext(ControllerContext)
        
    const availableInteractions = controllerContext.aggregateData.availableInteractions(playerData)
    
    return (
        <div className={styles.interactions}>
        AVAILABLE
        {
            availableInteractions.map(interaction => <div className={styles.interaction} onClick={() => {applyEffectHandler(interaction)}} key={interaction.name + interaction.role}>
                <img src={referenceContext.image.getRoleImage(interaction.role)}></img>
                {interaction.name}
            </div>)
        }
        </div>
    )
}

interface ActiveInteractionsProps {
    playerData: Player.Data
}
function ActiveInteractions({playerData}: ActiveInteractionsProps) {
    
    const referenceContext = useContext(ReferenceContext)
    const controllerContext = useContext(ControllerContext)
        
    const activeInteractions = controllerContext.aggregateData.activeInteractions(playerData.id)
    
    return (
        <div className={styles.interactions}>
            ACTIVE
            {
                activeInteractions.map(interaction => <div className={styles.interaction} key={interaction.id}>
                <img src={referenceContext.image.getRoleImage(interaction.fromRole)}></img>
                {interaction.name}
            </div>)
            }
        </div>
    )
}