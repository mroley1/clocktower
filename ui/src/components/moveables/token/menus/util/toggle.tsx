

function Toggle(props: any) {
    
    function click(event: any) {
        event.target.querySelector(".movement").setAtribute("data-isPublic", !props.right)
        props.toggle()
    }
    
    return (
        <div className='toggle' onClick={props.toggle}>
            <div className='movement' data-isPublic={props.right}>
                <div className='left'></div>
                <div className='right'></div>
                <div className='handle'></div>
            </div>
        </div>
    )
}
export default Toggle