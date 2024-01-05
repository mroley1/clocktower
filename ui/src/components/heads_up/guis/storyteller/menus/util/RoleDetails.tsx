import './RoleDetails.scss';

function RoleDetails(props: any) {
    
    function close(event: any) {
        props.close()
        event.stopPropagation()
    }
    
    // TODO details
    //    * add night information
    //    * add cute GOOD / EVIL and TOWN / OUTSIDER etc... description under title
    //    * mention jinxes or abilities
    
    if (props.isOpen) {
        const icon = require(`@assets/icons/${props.role.id}.png`)
        return (
            <div className='script_role_details_modal_container' onClick={close}>
                <div className='dialogue_box' onClick={(event)=>{event.stopPropagation()}}>
                    <div className='icon'>
                        <img src={icon}></img>
                    </div>
                    <div className='content'>
                        <h1 className='title'>{props.role.name}</h1>
                        <h3 className='description'>{props.role.description}</h3>
                    </div>
                </div>
            </div>
        );
    } else {
        return <></>
    }
  
}

export default RoleDetails;
