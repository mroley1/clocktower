import { useContext, useState, useEffect } from 'react';
import './Menus.scss';
import Toggle from './util/toggle';

function Notes(props: any) {
    
    const [isPublic, setIsPublic] = useState(false)
    
    function toggleIsPublic() {
        setIsPublic(!isPublic)
    }
    
    
    
    return (
        <div id='radialMenuActionSolidBase'>
            <div className='close' onClick={props.toggleMenuState}></div>
            <div className='center'>
                <h1>Notes for {props.json.name}</h1>
                <Toggle toggle={toggleIsPublic} right={isPublic} />
            </div>
        </div>
    );
  
}

export default Notes;
