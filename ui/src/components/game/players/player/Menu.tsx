import { createContext, useContext, useEffect, useState } from 'react';
import styles from './Player.module.scss';
import { ControllerContext, DataContext, GameContext } from '../../Game';
import { Player } from '@/components/common/reactStates/Player';
import { Alignmant } from '../../../../components/common/RoleType';
import RolePick from '../../utility/RolePick';
import AlignmentPick from '../../utility/AlignmentPick';
import { ReferenceData } from '@/components/common/ReferenceData';

interface MenuProps {isOpen: boolean, closeFunc: ()=>void, playerData: Player.Data}
function Menu({isOpen, closeFunc, playerData}: MenuProps) {
    
    const gameContext = useContext(GameContext);
    const controllerContext = useContext(ControllerContext)
    const dataContext = useContext(DataContext)
    
    const [roleSelect, setRoleSelect] = useState<string|undefined>(playerData.role)
        
    const [alignmentSelect, setAlignmentSelect] = useState<Alignmant|undefined>(playerData.alignment)
    
    useEffect(() => {
        if (roleSelect) {
            controllerContext.batchBuild(() => {
                playerData.role = roleSelect
                const roleData = dataContext.roles.getRole(playerData.role)
                if (playerData.alignment == Alignmant.NONE) {
                    playerData.alignment = roleData.alignment
                    setAlignmentSelect(roleData.alignment)
                }
            })
        }
    }, [roleSelect])
    
    useEffect(() => {
        if (alignmentSelect) {
            playerData.alignment = alignmentSelect
        }
    }, [alignmentSelect])
    
    function Setup() {
        
        return (
            <>
                <button onClick={()=>{setRoleSelect(undefined)}}>Change Role</button>
                <button onClick={()=>{setAlignmentSelect(undefined)}}>Change Alignment</button>
            </>
        )
    }
    
    function NightTurn() {
        
        const applyEffect = (effect: ReferenceData.Effect) => {
            controllerContext.addInteraction(effect, playerData.id)
            closeFunc()
        }
        
        const availableInteractions = dataContext.interactions.getInteractions(
            controllerContext.getPlayerFromId(
                gameContext.gameProgression.currentTurnOwner
            )?.role,
            gameContext.players.map(player => player.role)
                .filter(role => role != undefined)
        )
        
        console.log(availableInteractions)
        
        return (
            <div className={styles.container}>
                <div className={styles.major_options}>
                    <button onClick={()=>{setRoleSelect(undefined)}}>Change Role</button>
                    <button onClick={()=>{setAlignmentSelect(undefined)}}>Change Alignment</button>
                </div>
                <div className={styles.interactions}>
                    {
                        availableInteractions.map(interaction => <div className={styles.interaction} onClick={() => {applyEffect(interaction)}} key={interaction.name + interaction.role}>
                            <img src={dataContext.image.getRoleImage(interaction.role)}></img>
                            {interaction.name}
                        </div>)
                    }
                </div>
                <div className={styles.pictogram}>
                    {gameContext.gameProgression.currentTurnOwner && gameContext.gameProgression.currentTurnOwner != playerData.id && <>
                        <img className={styles.player_image} src={dataContext.image.getPlayerImage(gameContext.players.find(player => player.id == gameContext.gameProgression.currentTurnOwner)!)}></img>
                        {dataContext.roles.getRole(gameContext.players.find(player => player.id == gameContext.gameProgression.currentTurnOwner)!.role!).description}
                        <img className={styles.relationship_image} src={require('../../../../assets/arrow-right-long-solid.png')}></img>
                    </>}
                    <img className={styles.player_image} src={dataContext.image.getPlayerImage(playerData)}></img>
                    {dataContext.roles.getRole(playerData.role!).description}
                    {gameContext.gameProgression.currentTurnOwner == playerData.id && <>
                        <img className={styles.relationship_image} src={require('../../../../assets/arrow-loop-left-solid.png')}></img>
                    </>}
                </div>
            </div>
        )
    }
    
    function Day() {
        return (
            <></>
        )
    }
    
    function ModalContent() {
        
        if (!roleSelect) {
            return <RolePick setRoleSelect={setRoleSelect}></RolePick>
        }
        
        if (!alignmentSelect) {
            return <AlignmentPick setAlignmentSelect={setAlignmentSelect}></AlignmentPick>
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
