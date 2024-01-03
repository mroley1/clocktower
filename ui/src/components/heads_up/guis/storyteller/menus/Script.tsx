import { ReactNode, useContext, useEffect, useState } from 'react';
import './Menus.scss';
import './Script.scss';
import { GameContext } from '@/components/App';
import { HeadsUpContext } from '@/components/heads_up/HeadsUp';
import ScriptType from '@/common/ScriptType';
import Loading from './util/Loading';
import * as ErrorScreen from './util/Error';

declare const window: any;

function Script(props: any) {
    
    const gameContext = useContext(GameContext)
    const headsUpContext = useContext(HeadsUpContext)
    
    const [loading, setLoading] = useState("loading");
    const [scriptData, setScriptData] = useState([]);
    
    const pickerOpts = {
        types: [
          {
            description: "application/json",
            accept: {
              "data/*": [".ctsc", ".json"],
            },
          },
        ],
        multiple: false,
      };
      
    async function uploadScript() {
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
        fetch('http://localhost:8000/script/').then((response)=>{
            if (response.status === 200) {
                return (response.json());
            } else {
                throw new Error("HTTP Error: " + response.status + ": " + response.statusText);
            }
        }).then((jsonOutput)=>{
            setScriptData(jsonOutput)
        }).finally(()=>{
            setLoading("loaded")
        }).catch((error)=>{
            console.error(error)
            setLoading("error")
        })
    }, [])
    
    
    
    function ScriptContent() {
        
        function Item(props: any) {
            return (
                <div className='item'>
                        <div className='title'>
                            <span className='title_text'>{props.entry.name}</span>
                            <span className='version'>1.0</span>
                        </div>
                        <span className='title_author'>{props.entry.author}</span>
                        <span className='difficulty'>{props.entry.difficulty}</span>
                        <span className='description'>{props.entry.description}</span>
                    </div>
            )
        }
        
        // ! WHAT I WANT: 
        // * sorting options for list
        // ? done client side
        // * retreive latest version number for each script
        // * retrive latest difficulty and description
        // ? sort the mongo query before grabbing values
        
        // ! WHAT SHOULD HAPPEN WHEN SCRIPT IS CLICKED
        // * clicking each will load most recent script of that type
        // * options to load older scripts
        
        return (
            <div className='script_content_container'>
                <div className='selection_pane'>
                    {scriptData.map((entry)=><Item entry={entry}></Item>)}
                </div>
                <div className='viewing_pane'></div>
            </div>
            )
    }
    
    let content = (():ReactNode=>{
        if (loading === "loading") {
            return <Loading></Loading>
        } else if (loading === "loaded") {
            return <ScriptContent></ScriptContent>
        } else {
            return <ErrorScreen.default message='Cannot contact server'></ErrorScreen.default>
        }
    })()
    
    return (
        <div id='radialMenuActionSolidBase'>
            <div className='close' onClick={()=>{headsUpContext.util.toggleRadialMenuState(false)}}></div>
            <div className='center'>
                <h1>Scripts</h1>
                {content}
            </div>
        </div>
    );
  
}

export default Script;
