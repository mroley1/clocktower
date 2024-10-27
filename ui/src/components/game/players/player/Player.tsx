import { useContext, useEffect, useState } from 'react';
import styles from './Player.module.scss';
import { ControllerContext, DataContext } from '../../Game';
import { Player } from '@/components/common/reactStates/Player';
import { Alignmant } from '../../../../components/common/RoleType';
import Menu from './Menu';

interface PlayerPartialProps {playerData: Player.Data}
function PlayerPartial({playerData}: PlayerPartialProps) {
  
  const controllerContext = useContext(ControllerContext)
  const referenceData = useContext(DataContext)
  
  function updatePoisition (position: Player.Position) {
    playerData.position = position
  }
  // const interactionHandler = new InteractionHandler(updatePoisition, playerData.id);
  
  const image = getImage(playerData);
  
  const [menuOpen, setMenuOpen] = useState(false);
  function openMenu() {
    setMenuOpen(true);
  }
  function closeMenu() {
    setMenuOpen(false)
  }
  
  useEffect(() => {
    const token = document.querySelector(`div[data-id='${playerData.id}']`)
    if (token) {
        token.addEventListener("data-select", openMenu)
    }
    return () => {
        if (token) {
            token.removeEventListener("data-select", openMenu)
        }
    }
  }, [playerData])
  
  return (
    <div className={styles.token}>
        <img className={styles.image} src={image}></img>
        <Menu isOpen={menuOpen} closeFunc={closeMenu} playerData={playerData}></Menu>
    </div>
  );
}

export default PlayerPartial;

function getImage(playerData: Player.Data) {
    if (playerData.role) {
        if (playerData.alignment == Alignmant.GOOD) {
            var imageName = playerData.role + "_good.png"
        } else {
            var imageName = playerData.role + "_evil.png"
        }
        return require("../../../../assets/icons/" + imageName)
    } else return null
}