import { useContext, useEffect } from 'react';
import './Menus.scss';
import { GameContext } from '@/components/App';

function Kill(props: any) {
    
    const gameContext = useContext(GameContext)
    
    useEffect(() => {
        return () => {
            
        }
    })
    
    return (
        <></>
    );
  
}

export default Kill;
