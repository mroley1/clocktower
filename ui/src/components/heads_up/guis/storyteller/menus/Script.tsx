import { useContext, useEffect } from 'react';
import './Menus.scss';
import { GameContext } from '@/components/App';
import { HeadsUpContext } from '@/components/heads_up/HeadsUp';

declare const window: any;

function Script(props: any) {
    
    const gameContext = useContext(GameContext)
    const headsUpContext = useContext(HeadsUpContext)
    
    const pickerOpts = {
        types: [
          {
            description: "application/json",
            accept: {
              "data/*": [".json"],
            },
          },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
      };
      
    async function getTheFile() {
    try {
        const [fileHandle]: FileSystemFileHandle[] = await window.showOpenFilePicker(pickerOpts);
        const fileData = await fileHandle.getFile();
        //const accessor = await fileHandle.createWritable();
        //let data = accessor.data
        console.log(window.isSecureContext)
        console.log(fileHandle)
        //accessor.close()
    } catch (error: any) {
        if (error.name === "AbortError") {return}
        console.error(error)
    }
    }
    
    useEffect(() => {
        return () => {
            
        }
    })
    
    return (
        <div id='radialMenuActionSolidBase'>
            <div className='close' onClick={()=>{headsUpContext.util.toggleRadialMenuState(false)}}></div>
            <div className='center'></div>
            <input type='button' value='test' onClick={getTheFile}></input>
                
        </div>
    );
  
}

export default Script;
