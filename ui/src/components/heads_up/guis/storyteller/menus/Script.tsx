import { useContext, useEffect, useState } from 'react';
import './Menus.scss';
import { GameContext } from '@/components/App';
import { HeadsUpContext } from '@/components/heads_up/HeadsUp';
import ScriptType from '@/common/ScriptType';

declare const window: any;

function Script(props: any) {
    
    const gameContext = useContext(GameContext)
    const headsUpContext = useContext(HeadsUpContext)
    
    const [scriptData, setScriptData] = useState();
    
    const pickerOpts = {
        types: [
          {
            description: "application/json",
            accept: {
              "data/*": [".ctsc", ".json"],
            },
          },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
      };
      
    async function getTheFile() {
    try {
      
        const textDecoder = new TextDecoder();
      
        const [fileHandle]: FileSystemFileHandle[] = await window.showOpenFilePicker(pickerOpts);
        const fileData = await fileHandle.getFile();
        const fileArray = await fileData.stream().getReader().read();
        const fileString = textDecoder.decode(fileArray.value);
        const fileJSON:ScriptType = JSON.parse(fileString);
        console.log(fileJSON);
        
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
