import { useContext, useState, useEffect } from 'react';
import styles from './ScriptBrowser.module.scss';
import { Script } from '@/components/common/Types';
import ScriptData from '@/components/common/ScriptData';




interface ScriptBrowserProps {
  setSelectedScriptID: (scriptID: number) => void;//sets selected script
    selectedScriptID: number | null;
  }


  
function ScriptBrowser({ setSelectedScriptID, selectedScriptID }: ScriptBrowserProps){
    const handleClick = (scriptID: number) => {
      setSelectedScriptID(scriptID);
      };

      
      const [loading, setLoading] = useState(true);
      const [scripts, setScripts] = useState<Script[]>([]);
      const [error, setError] = useState<string | null>(null);
    
      useEffect(() => {
        const fetchScripts = async () => {
          try {
            const response = await fetch('https://clocktower-api-2-clocktower-api.apps.okd4.csh.rit.edu/api/scripts');
            if (!response.ok) throw new Error('Failed to fetch scripts');
    
            const data: Script[] = await response.json();
            setScripts(data);
            
          } catch (err: any) {
            console.error(err);
            setError(err.message || 'Unknown error');
          } finally {
            setLoading(false);
          }
        };
    
        fetchScripts();
      }, []);
    
      if (loading) return <p>Loading scripts...</p>;
      if (error) return <p>Error loading scripts: {error}</p>;

    //a lot of this is temporary, and will be changed when a more finalized system is decided upon
    return(
        <>
        <div className={styles.scriptBrowserContainer}>
            <h2 className={styles.SCRIPT_BROWSER_HEADER}>AVAILABLE SCRIPTS</h2>
            <ul>{scripts.map((script) => (
              <li key={script.id} onClick={() => handleClick(script.id)} className={selectedScriptID === script.id ? styles.selected : ''}>
              <strong>{script.name}</strong> {new Date(script.date_created).toLocaleDateString(undefined, { dateStyle: "short" })}<br />
              by {script.author} 
    </li>
  ))}
</ul>
        </div>
        </>
    )
}

export default ScriptBrowser;
