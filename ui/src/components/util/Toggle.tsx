import './Toggle.scss'
import { useRef } from "react"
import { CSSTransition } from "react-transition-group"

function Toggle(props: any) {
    
    function click(event: any) {
        event.target.querySelector(".movement").setAtribute("data-isPublic", !props.right)
        props.toggle()
    }
    
    const nodeRef = useRef(null)
    
    return (
        <div className='toggle' onClick={props.toggle}>
            <CSSTransition nodeRef={nodeRef} in={props.selected} timeout={150} classNames='movement'>
                <div ref={nodeRef} className='movement'>
                    <div className='left'></div>
                    <div className='right'></div>
                    <div className='handle'></div>
                </div>
            </CSSTransition>
        </div>
    )
}
export default Toggle