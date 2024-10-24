import { useContext } from 'react';
import styles from './Player.module.scss';
import { GameContext } from '../../Game';
import { Player } from '@/components/common/reactStates/Player';
import { Alignmant } from '../../../../components/common/RoleType';

interface MenuProps {isOpen: boolean, closeFunc: ()=>void, playerData: Player.Data}
function Menu({isOpen, closeFunc, playerData}: MenuProps) {
    
    const gameContext = useContext(GameContext);
    
    function setup() {
        return (
            <>
                <button onClick={()=>{playerData.role="acrobat";closeFunc()}}>make acrobat</button>
                <button onClick={()=>{playerData.alignment=Alignmant.GOOD;closeFunc()}}>make good</button>
                <button onClick={()=>{playerData.alignment=Alignmant.EVIL;closeFunc()}}>make evil</button>
            </>
        )
    }
    
    function modalContent() {
        if (gameContext.gameProgression.isSetup) {
            return setup()
        }
        return <></>
    }
  
    if (!isOpen) {
        return <></>
    } else {
        return (
            <div className={styles.menu_wrapper} onClick={closeFunc}>
                <div className={styles.menu} onClick={(e)=>{e.stopPropagation()}}>
                    {modalContent()}
                    <div className={styles.exit} onClick={closeFunc}>X</div>
                </div>
            </div>
        );
    }
}

export default Menu;
