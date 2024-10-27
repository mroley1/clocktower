import { createContext, useContext, useEffect, useState } from 'react';
import styles from './Player.module.scss';
import { ControllerContext, DataContext, GameContext } from '../../Game';
import { Player } from '@/components/common/reactStates/Player';
import { Alignmant } from '../../../../components/common/RoleType';
import RolePick from '../../utility/RolePick';
import AlignmentPick from '../../utility/AlignmentPick';

interface MenuProps {isOpen: boolean, closeFunc: ()=>void, playerData: Player.Data}
function Menu({isOpen, closeFunc, playerData}: MenuProps) {
    
    const gameContext = useContext(GameContext);
    const controllerContext = useContext(ControllerContext)
    const dataContext = useContext(DataContext)
    
    const [roleSelect, setRoleSelect] = useState<string|undefined>(playerData.role)
        
    const [alignmentSelect, setAlignmentSelect] = useState<Alignmant|undefined>(playerData.alignment)
    
    useEffect(() => {
        if (roleSelect) {
            playerData.role = roleSelect
            const roleData = dataContext.role.getData(playerData.role)
            if (playerData.alignment == Alignmant.NONE) {
                playerData.alignment = roleData.alignment
                setAlignmentSelect(roleData.alignment)
            }
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
        
        return <button onClick={()=>{setRoleSelect(undefined)}}>Change Role</button>
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
        if (gameContext.gameProgression.isNight && gameContext.gameProgression.currentTurnOwner) {
            return <NightTurn></NightTurn>
        }
        console.error("No Menu Found")
        closeFunc();
        return <></>
    }
  
    if (!isOpen) {
        return <></>
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
