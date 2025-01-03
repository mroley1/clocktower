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

interface MenuProps {isOpen: boolean, closeFunc: ()=>void, playerData: Player.Data}
function Menu({isOpen, closeFunc, playerData}: MenuProps) {
    
    const gameContext = useContext(GameContext);
    const controllerContext = useContext(ControllerContext)
    const referenceContext = useContext(ReferenceContext)
    
    const [roleSelect, setRoleSelect] = useState<string|undefined>(playerData.role)
        
    const [alignmentSelect, setAlignmentSelect] = useState<Alignmant|undefined>(playerData.alignment)
    
    const effectStore = useRef<ReferenceData.Interaction|null>(null)
    
    const [bagSelect, setBagSelect] = useState<string|undefined>("")
    
    const [madSelect, setMadSelect] = useState<string|undefined>("")
    
    const [grantSelect, setGrantSelect] = useState<string|undefined>("")
    
    function setNewRole(roleId: string|undefined) {
        if (roleId) {
            controllerContext.batchBuild(() => {
                playerData.role = roleId
                const roleData = referenceContext.roles.getRole(playerData.role)
                if (playerData.alignment == Alignmant.NONE) {
                    playerData.alignment = roleData.alignment
                    setAlignmentSelect(roleData.alignment)
                }
            })
        }
    }
    
    useEffect(() => {
        setNewRole(roleSelect)
    }, [roleSelect])
    
    useEffect(() => {
        if (alignmentSelect) {
            playerData.alignment = alignmentSelect
        }
    }, [alignmentSelect])
    
    useEffect(() => {
        if (madSelect && effectStore.current) {
            controllerContext.aggregateData.addInteraction(effectStore.current!, playerData.id, madSelect)
            setMadSelect("")
            closeFunc()
        }
    }, [madSelect])
    
    useEffect(() => {
        setNewRole(bagSelect)
    }, [bagSelect])
    
    useEffect(() => {
        if (grantSelect && effectStore.current) {
            controllerContext.aggregateData.addInteraction(effectStore.current!, playerData.id, grantSelect)
            setGrantSelect("")
            closeFunc()
        }
    }, [grantSelect])
    
    const setRoleSelectHandler = (value: string|undefined) => {
        setRoleSelect(value)
    }
    
    const setAlignmentSelectHandler = (value: Alignmant|undefined) => {
        setAlignmentSelect(value)
    }
    
    const applyEffectHandler = (interaction: ReferenceData.Interaction) => {
        controllerContext.batchBuild(() => {
            
            const effectKit: EffectKit = {
                interaction: interaction,
                player: playerData,
                roleSelect: setRoleSelectHandler,
                alignmentSelect: setAlignmentSelectHandler,
                madSelect: setMadSelect,
                grantSelect: setGrantSelect
            }
            
            const shouldCreateInteractionNow = applyEffect(effectKit)
            
            if (shouldCreateInteractionNow) {
                controllerContext.aggregateData.addInteraction(interaction, playerData.id)
                closeFunc()
            } else {
                effectStore.current = interaction
            }
        })
    }
    
    function Setup() {
        
        return (
            <div className={styles.container}>
                <div className={styles.major_options}>
                    <button onClick={()=>{setRoleSelect(undefined)}}>Change Role</button>
                    <button onClick={()=>{setAlignmentSelect(undefined)}}>Change Alignment</button>
                    <button onClick={()=>{setBagSelect(undefined)}}>Pick from bag</button>
                </div>
                <AvailableInteractions playerData={playerData} applyEffectHandler={applyEffectHandler}></AvailableInteractions>
                <ActiveInteractions playerData={playerData}></ActiveInteractions>
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
            </div>
        )
    }
    
    function NightTurn() {
        
        return (
            <div className={styles.container}>
                <div className={styles.major_options}>
                    <button onClick={()=>{setRoleSelect(undefined)}}>Change Role</button>
                    <button onClick={()=>{setAlignmentSelect(undefined)}}>Change Alignment</button>
                </div>
                <AvailableInteractions playerData={playerData} applyEffectHandler={applyEffectHandler}></AvailableInteractions>
                <ActiveInteractions playerData={playerData}></ActiveInteractions>
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
            </div>
        )
    }
    
    function Day() {
        return (
            <div className={styles.container}>
                <div className={styles.major_options}>
                    voting stuff
                    <button onClick={()=>{setRoleSelect(undefined)}}>Change Role</button>
                    <button onClick={()=>{setAlignmentSelect(undefined)}}>Change Alignment</button>
                </div>
                <AvailableInteractions playerData={playerData} applyEffectHandler={applyEffectHandler}></AvailableInteractions>
                <ActiveInteractions playerData={playerData}></ActiveInteractions>
            </div>
        )
    }
    
    function ModalContent() {
        
        if (!bagSelect) {
            return <BagSelect setRoleSelect={setBagSelect}></BagSelect>
        }
        
        if (!roleSelect) {
            return <RolePick setRoleSelect={setRoleSelect}></RolePick>
        }
        
        if (!alignmentSelect) {
            return <AlignmentPick setAlignmentSelect={setAlignmentSelect}></AlignmentPick>
        }
        
        if (madSelect == undefined) {
            return <RolePick setRoleSelect={setMadSelect}></RolePick>
        }
        
        if (grantSelect == undefined) {
            return <RolePick setRoleSelect={setGrantSelect}></RolePick>
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
        closeFunc();
        return null
    }
  
    if (!isOpen) {
        return null
    } else {
        return (
            <div className={styles.menu_wrapper} onClick={closeFunc}>
                <div className={styles.menu} onClick={(e)=>{e.stopPropagation()}}>
                    <ModalContent></ModalContent>
                    <div className={styles.exit} onClick={closeFunc}>X</div>
                </div>
            </div>
        );
    }
}

export default Menu;

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