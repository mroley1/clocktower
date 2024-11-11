import { useContext, useEffect, useState } from 'react';
import styles from './Player.module.scss';
import { ControllerContext, DataContext, GameContext } from '../../Game';
import { Player } from '@/components/common/reactStates/Player';
import Menu from './Menu';
import { Interaction } from '@/components/common/reactStates/Intereaction';

interface PlayerPartialProps {playerData: Player.Data}
function PlayerPartial({playerData}: PlayerPartialProps) {
  
  const controllerContext = useContext(ControllerContext)
  const gameContext = useContext(GameContext)
  const referenceData = useContext(DataContext)
  
  function updatePoisition (position: Player.Position) {
    playerData.position = position
  }
  
  const image = referenceData.image.getPlayerImage(playerData);
  
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
  
  const activeInteractions = gameContext.interactions.filter(interaction => interaction.effected == playerData.id)
  
  return (
    <div className={styles.token}>
        <img className={styles.image} src={image}></img>
        <InteractionIndicators activeInteractions={activeInteractions}></InteractionIndicators>
        <Menu isOpen={menuOpen} closeFunc={closeMenu} playerData={playerData}></Menu>
    </div>
  );
}

export default PlayerPartial;

interface InteractionIndicatorsProps {
  activeInteractions: Interaction.Data[]
}
function InteractionIndicators({activeInteractions}: InteractionIndicatorsProps) {
  
  const dataContext = useContext(DataContext)
  
  let displayed: (Interaction.Data|null)[] = activeInteractions.filter((_, i) => i<3)
  if (activeInteractions.length > 3) {
    displayed.push(null)
  }
  
  return (
    <div className={styles.interaction_indicators}>
      {displayed.map(interaction => {
        if (interaction == null) {
          return (
          <div className={styles.slot + " " + styles["quantity-" + activeInteractions.length]}>
            <div key="etc" className={styles.pip}>
              <img src={require("../../../../assets/dots.png")}></img>
            </div>
          </div>)
        } else {
          return (
            <div className={styles.slot + " " + styles["quantity-" + activeInteractions.length]}>
              <div key={interaction.key} className={styles.pip}>
                <img src={dataContext.image.getRoleImage(interaction.from)}></img>
              </div>
            </div>
          )
        }
      })}
    </div>
  )
}