import { MutableRefObject, useContext, useEffect, useState } from 'react';
import styles from './Player.module.scss';
import { ControllerContext, ReferenceContext, GameContext } from '../../Game';
import { Player } from '@/components/common/reactStates/Player';
import Menu from './Menu';
import { Interaction } from '../../../common/reactStates/Intereaction';

interface PlayerPartialProps {playerData: Player.Data, wrapper: MutableRefObject<HTMLDivElement|null>}
function PlayerPartial({playerData, wrapper}: PlayerPartialProps) {
  
  const controllerContext = useContext(ControllerContext)
  const gameContext = useContext(GameContext)
  const referenceContext = useContext(ReferenceContext)
  
  const image = referenceContext.image.getPlayerImage(playerData);
  
  
  const [menuOpen, setMenuOpen] = useState(false);
  
  function openMenu() {
    setMenuOpen(true);
  }
  
  function closeMenu() {
    setMenuOpen(false)
  }
  
  useEffect(() => {
    if (wrapper.current) {
        wrapper.current.addEventListener("data-select", openMenu)
    }
    return () => {
        if (wrapper.current) {
            wrapper.current.removeEventListener("data-select", openMenu)
        }
    }
  }, [playerData])
  
  const activeInteractions = controllerContext.aggregateData.activeInteractions(playerData.id)
  
  const visibleEffects = controllerContext.aggregateData.visibleEffects(playerData.id)
  
  return (
    <div className={styles.token}>
        <img className={styles.image} src={image}></img>
        <InteractionIndicators activeInteractions={activeInteractions}></InteractionIndicators>
        <EffectIndicators visibleEffects={visibleEffects}></EffectIndicators>
        <Menu isOpen={menuOpen} closeFunc={closeMenu} playerData={playerData}></Menu>
        <DeathShroud playerData={playerData}></DeathShroud>
        
    </div>
  );
}

export default PlayerPartial;

interface InteractionIndicatorsProps {
  activeInteractions: Interaction.Data[]
}
function InteractionIndicators({activeInteractions}: InteractionIndicatorsProps) {
  
  const referenceContext = useContext(ReferenceContext)
  
  const displayNumber = 4 // how many inteasractions to show
  
  let displayed: (Interaction.Data|null)[] = activeInteractions.filter((_, i) => i<displayNumber)
  if (activeInteractions.length > displayNumber) {
    displayed[displayNumber - 1] = null
  }
  
  return (
    <div className={styles.indicators}>
      {displayed.map(interaction => {
        if (interaction == null) {
          return (
          <div key="etc" className={`${styles.slot} ${styles.interaction} ${styles["quantity-" + displayed.length]}`}>
            <div className={styles.pip}>
              <img src={require("../../../../assets/dots.png")}></img>
            </div>
          </div>)
        } else {
          return (
            <div key={interaction.id} className={`${styles.slot} ${styles.interaction} ${styles["quantity-" + displayed.length]}`}>
              <div className={styles.pip}>
                <img src={referenceContext.image.getRoleImage(interaction.fromRole)}></img>
              </div>
            </div>
          )
        }
      })}
    </div>
  )
}

interface EffectIndicatorsProps {
  visibleEffects: Interaction.Effect[]
}
function EffectIndicators({visibleEffects}: EffectIndicatorsProps) {
  
  const referenceContext = useContext(ReferenceContext)
  
  const displayNumber = 5 // how many effects to show
  
  let displayed: (Interaction.Effect|null)[] = visibleEffects.filter((_, i) => i<displayNumber)
  if (visibleEffects.length > displayNumber) {
    displayed[displayNumber - 1] = null
  }
  
  return (
    <div className={styles.indicators}>
      {displayed.map(effect => {
        if (effect == null) {
          return (
          <div key="etc" className={`${styles.slot} ${styles.effect} ${styles["quantity-" + displayed.length]}`}>
            <div className={styles.pip}>
              <img src={require("../../../../assets/dots.png")}></img>
            </div>
          </div>)
        } else {
          return (
            <div key={effect} className={`${styles.slot} ${styles.effect} ${styles["quantity-" + displayed.length]}`}>
              <div className={styles.pip}>
                <img src={require(`../../../../assets/effects/${Interaction.Effect[effect].toLowerCase()}.svg`)}></img>
              </div>
            </div>
          )
        }
      })}
    </div>
  )
}

interface DeathShroudProps {
  playerData: Player.Data
}
function DeathShroud({playerData}: DeathShroudProps) {
  if (playerData.isDead) {
    const shroudImg = require('../../../../assets/shroud.png')
    return <div className={styles.death_shroud_container}>
      <img className={styles.death_shroud} src={shroudImg}></img>
    </div>
  }
}