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
    const [sortBy, setSortBy] = useState("name");
    const [orderDir, setOrderDir] = useState("asc");
    const [isEditing, setIsEditing] = useState(false);
    const [currentScript, setCurrentScript] = useState(gameContext.state.script);
    
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
        
        function selectScript(script: ScriptType) {
            setIsEditing(false)
            setCurrentScript(script)
        }
        
        function Item(props: any) {
            return (
                <div onClick={()=>{selectScript(props.entry.scripts[0])}} className='item'>
                    <div className='title'>
                        <span className='title_text'>{props.entry.name}</span>
                        <span className='version'>{props.entry.version}</span>
                    </div>
                    <span className='title_author'>{props.entry.author}</span>
                    <span className='difficulty'>{props.entry.difficulty}</span>
                    <span className='description'>{props.entry.description}</span>
                </div>
            )
        }
        
        function ViewingPane(props: any) {
            
            const [scriptDetails, setScriptDetails] = useState([])
            const [loading, setLoading] = useState("loading")
            
            function Role(props: any) {
                const icon = require(`@assets/icons/${props.role.id}.png`)
                return (
                    <div className='role'>
                        <img title={props.role.description} src={icon}></img>
                        <span>{props.role.name}</span>
                    </div>
                )
            }
            
            useEffect(() => {
                if (currentScript.roles.length === 0) {return}
                fetch(`http://localhost:8000/role/multi/?roleList=${JSON.stringify(currentScript.roles)}`).then((response)=>{
                    if (response.status === 200) {
                        return (response.json());
                    } else {
                        throw new Error("HTTP Error: " + response.status + ": " + response.statusText);
                    }
                }).then((jsonOutput)=>{
                    return setScriptDetails(jsonOutput)
                }).finally(()=>{
                    setLoading("done")
                }).catch((error)=>{
                    console.error(error)
                    setLoading("error")
                })
            }, [])
            
            var roles = [<Loading key={0}></Loading>]
            if (loading === "done") {
                roles = scriptDetails.map((role)=><Role key={role["id"]} role={role}></Role>)
            }
            
            return (
                <>
                    <span className='title'>{currentScript.meta.name}</span>
                    <br></br>
                    <span className='description'>{currentScript.meta.description}</span>
                    <div className='roles'>
                        {roles}
                    </div>
                </>
            )
        }
        
        function ViewingPaneEdit(props: any) {
            return (
                <></>
            )
        }
        
        // ! WHAT I WANT: 
        // * sorting options for list
        // ? done client side
        // #* retreive latest version number for each script
        // #* retrive latest difficulty and description
        // #? sort the mongo query before grabbing values
        
        // ! WHAT SHOULD HAPPEN WHEN SCRIPT IS CLICKED
        // * clicking each will load most recent script of that type
        // * options to load older scripts
        
        function order(a:any, b:any): number {
            let negate = orderDir==="asc"?1:-1
            if (a[sortBy] < b[sortBy]) {
                return -1*negate
            } else if (a[sortBy] > b[sortBy]) {
                return 1*negate
            } else {
                return 0
            }
        }
        
        const viewing = (()=>{
            if (isEditing) {
                return <ViewingPaneEdit></ViewingPaneEdit>
            } else {
                return <ViewingPane></ViewingPane>
            }
        })()
        
        return (
            <div className='script_content_container'>
                <div className='selection_pane'>
                    {scriptData.sort((a,b)=>order(a,b)).map((entry)=><Item key={entry["name"]+entry["author"]} entry={entry}></Item>)}
                </div>
                <div className='viewing_pane'>
                    <ViewingPane></ViewingPane>
                </div>
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
