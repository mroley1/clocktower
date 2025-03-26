import { useContext, useState } from 'react';
import styles from './ScriptBrowser.module.scss';
import ScriptData from '@/components/common/ScriptData';
const testScripts: ScriptData[] = [
    {"name":"Trouble Brewing","author":"Official","data":['chef', 'empath']},
    {"name":"Sects & Violets","author":"Official","data":['vortox', 'flowergirl']}
]



interface ScriptBrowserProps {
    onScriptSelect: (script: ScriptData) => void;//sets selected script
    selectedScript: ScriptData | null;
  }

function ScriptBrowser({ onScriptSelect, selectedScript }: ScriptBrowserProps){

    let scripts = testScripts

    const handleClick = (script: ScriptData) => {
        onScriptSelect(script);
      };
    //a lot of this is temporary, and will be changed when a more finalized system is decided upon
    return(
        <>
        <div className={styles.scriptBrowserContainer}>
            <h2 className={styles.SCRIPT_BROWSER_HEADER}>AVAILABLE SCRIPTS</h2>
            <ul> 
            {scripts.map((script, index) => (
                <li key={index}
                className={`${styles.SCRIPT_ITEM} ${selectedScript === script ? styles.SCRIPT_ITEM_SELECTED : ''}`}
                onClick={() => onScriptSelect(script)}
        >
          {script.name}
        </li>
        ))}
        </ul>
        </div>
        </>
    )
}

export default ScriptBrowser;