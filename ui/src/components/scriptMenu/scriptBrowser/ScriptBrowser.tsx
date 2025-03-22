import { useContext, useState } from 'react';
import styles from './ScriptBrowser.module.scss';

const testScripts = [
    {"name":"Trouble Brewing","author":"Official"},
    {"name":"Sects & Violets"}

]



interface ScriptBrowserProps {
    onScriptSelect: (script: string) => void;
    selectedScript: string | null;
  }

function ScriptBrowser({ onScriptSelect, selectedScript }: ScriptBrowserProps){

    let scripts = testScripts

    const handleClick = (script: string) => {
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
                className={`${styles.SCRIPT_ITEM} ${selectedScript === script.name ? styles.SCRIPT_ITEM_SELECTED : ''}`}
                onClick={() => onScriptSelect(script.name)}
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