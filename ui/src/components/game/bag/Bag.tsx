import { useContext, useEffect, useRef, useState } from 'react';
import styles from './Bag.module.scss';
import { ControllerContext, GameContext, ReferenceContext } from '../Game';

interface BagProps {
    completeSetupFunc: () => void
}
function Bag({completeSetupFunc}: BagProps) {
  
    const referenceContext = useContext(ReferenceContext)
    const gameContext = useContext(GameContext)
    const controllerContext = useContext(ControllerContext)
  
    const [playerCountSlider, setPlayerCountSlider] = useState(7)
    function setPlayerCount(count: number) {
        setPlayerCountSlider(count)
    }
    
    function done() {
        controllerContext.batchBuild(() => {
            gameContext.bag.quantity = playerCountSlider
        })
        completeSetupFunc()
    }
  
    return (
        <>
            {playerCountSlider}
            <Slider playerCount={playerCountSlider} setPlayerCount={setPlayerCount}></Slider>
            {referenceContext.roles.roleList.map((role) => {
                return (
                    <div key={role.id}>
                        {role.name}
                    </div>
                )
            })}
            <button onClick={done}>start</button>
        </>
    );
}

export default Bag;

interface SliderProps {
    playerCount: number
    setPlayerCount: (count: number) => void
}
function Slider({playerCount, setPlayerCount}: SliderProps) {
    
    let sliding = false
    
    function cancelSlide() {
        document.removeEventListener("pointermove", move)
        document.removeEventListener("pointerup", stopSlide)
        document.removeEventListener("pointercancel", cancelSlide)
    }
    
    function stopSlide() {
        cancelSlide()
        console.log(cursor.current)
    }
    
    useEffect(() => {
        return () => {
            if (sliding) {
                cancelSlide()
            }
    }}, [])
    
    const slider = useRef<HTMLDivElement>(null)
    const cursor = useRef<HTMLDivElement>(null)
    
    function startSlide() {
        sliding = true
        document.addEventListener("pointermove", move)
        document.addEventListener("pointerup", stopSlide)
        document.addEventListener("pointercancel", cancelSlide)
    }
    
    function move(e: PointerEvent) {
        if (sliding && slider.current && cursor.current) {
            e.preventDefault()
            cursor.current.style.left = (e.clientX - slider.current.getBoundingClientRect().left - (cursor.current.getBoundingClientRect().width / 2)).toString() + "px"
        }
    }
    
    
    return (
        <div className={styles.slider_container}>
            <div ref={slider} className={styles.slider}>
                <div ref={cursor} className={styles.cursor} onPointerDown={startSlide}></div>
            </div>
        </div>
    )
}
