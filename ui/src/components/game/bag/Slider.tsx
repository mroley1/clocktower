import { useEffect, useRef } from 'react';
import styles from './Bag.module.scss';

interface SliderProps {
    playerCount: number
    setPlayerCount: (count: number) => void
}
function Slider({playerCount, setPlayerCount}: SliderProps) {
    
    const MINPLAYERCOUNT = 5;
    const MAXPLAYERCOUNT = 15;
    
    let sliding = false
    
    const captureEvent = (e: any) => {
        e.preventDefault()
        e.stopPropagation()
    }
    
    function getClosestBin(clientX: number) {
        if (slider.current) {
            const sliderRect = slider.current.getBoundingClientRect()
            const leftReference = clientX - sliderRect.left
            const binWidth = sliderRect.width / (MAXPLAYERCOUNT - MINPLAYERCOUNT + 1)
            return Math.min(Math.max(Math.floor(leftReference / binWidth), 0), MAXPLAYERCOUNT - MINPLAYERCOUNT)
        }
        return 0
    }
    
    function getClosestValueFromBinNumber(selectedBin: number) {
        if (slider.current) {
            const sliderRect = slider.current.getBoundingClientRect()
            const binWidth = sliderRect.width / (MAXPLAYERCOUNT - MINPLAYERCOUNT + 1)
            return ((selectedBin + 0.5) * binWidth)
        }
        return 0
    }
    
    function cancelSlide() {
        document.removeEventListener("pointermove", move)
        document.removeEventListener("pointerup", stopSlide)
        document.removeEventListener("pointercancel", cancelSlide)
    }
    
    const playerCountRef = useRef(playerCount)
    useEffect(() => {
        playerCountRef.current = playerCount
    }, [playerCount])
    function onResize() {
        if (cursor.current) {
            cursor.current.style.left = cursorPositionToLeft(getClosestValueFromBinNumber(playerCountRef.current - MINPLAYERCOUNT))
        }
    }
    
    useEffect(() => {
        window.addEventListener("resize", onResize)
        return () => {
            window.removeEventListener("resize", onResize)
            if (sliding) {
                cancelSlide()
            }
    }}, [])
    
    const slider = useRef<HTMLDivElement>(null)
    const cursor = useRef<HTMLDivElement>(null)
    
    function cursorPositionToLeft(cursorPosition: number) {
        if (cursor.current) {
            return (cursorPosition - (cursor.current.getBoundingClientRect().width / 2)).toString() + "px"
        }
        return "0px"
    }
    
    function startSlide(e: React.PointerEvent<HTMLDivElement>) {
        updateHover(getClosestBin(e.clientX))
        sliding = true
        cursor.current?.setAttribute("data-moving", "true")
        document.addEventListener("pointermove", move)
        document.addEventListener("pointerup", stopSlide)
        document.addEventListener("pointercancel", cancelSlide)
    }
    
    function move(e: PointerEvent) {
        if (sliding && slider.current && cursor.current) {
            e.preventDefault()
            updateHover(getClosestBin(e.clientX))
            cursor.current.style.left = cursorPositionToLeft(e.clientX - slider.current.getBoundingClientRect().left)
        }
    }
    
    function stopSlide(e: PointerEvent) {
        cancelSlide()
        if (slider.current && cursor.current) {
            cursor.current.setAttribute("data-moving", "false")
            const closestBin = getClosestBin(e.clientX)
            cursor.current.style.left = cursorPositionToLeft(getClosestValueFromBinNumber(closestBin));
            setPlayerCount(closestBin + MINPLAYERCOUNT)
        }
    }
    
    const bins = Array.from({length: MAXPLAYERCOUNT - MINPLAYERCOUNT + 1}, (_, i) => MINPLAYERCOUNT + i)
    
    function updateHover(currentBin: number) {
        if (slider.current) {
            slider.current.querySelectorAll(`.${styles.bin}`).forEach((element) => {
                element.setAttribute("data-hovering", (currentBin.toString() == element.getAttribute("data-index"))?"true":"false")
            })
        }
    }
    
    return (
        <div className={styles.slider_container} onClick={captureEvent} onDoubleClick={captureEvent}>
            <div ref={slider} className={styles.slider} style={{gridTemplateColumns: `repeat(${bins.length}, 1fr)`}}>
                <div ref={cursor} className={styles.cursor} onPointerDown={startSlide} data-moving="false" style={{left: cursorPositionToLeft(getClosestValueFromBinNumber(playerCount - MINPLAYERCOUNT))}}>
                    <div className={styles.visible}></div>
                </div>
                {bins.map((binValue, index) => {
                    return <div key={binValue} data-index={index} data-hovering={binValue == playerCount} className={styles.bin}>
                        {binValue}
                    </div>
                })}
            </div>
        </div>
    )
}


export default Slider