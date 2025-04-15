import { useState, useEffect } from 'react';
import styles from './ScriptBrowser.module.scss';
import { Script } from '@/components/common/Types';




interface ScriptBrowserProps {
  setSelectedScriptID: (scriptID: number) => void; //sets selected script
  selectedScriptID: number | null; //sets the selected script ID
}


// ScriptBrowser component fetches and displays a list of scripts from the API
// and allows the user to select a script by clicking on it. The selected script ID is passed to the parent component.
// While this is designed to work with ScriptMenu, without significant changes it might be used in other components as well.
function ScriptBrowser({ setSelectedScriptID, selectedScriptID }: ScriptBrowserProps){
    // loading, scripts, and error states are used to track fetching scripts from the API
    // This is used to display a loading message while the scripts are being fetched, and an error message if the fetch fails.
    const [loading, setLoading] = useState(true);
    const [scripts, setScripts] = useState<Script[]>([]);
    const [error, setError] = useState<string | null>(null);

    // sets the selected script ID when a script is clicked
    const handleScriptSelect = (scriptID: number) => {
      setSelectedScriptID(scriptID);
      };

    // Fetches scripts from the API when the component mounts
    // Only gets script name, author, and date created
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
  
    // If loading, show a loading message
    // If error, show an error message
    if (loading) return <p>Loading scripts...</p>;
    if (error) return <p>Error loading scripts: {error}</p>;

    return(
        <>
        <div className={styles.scriptBrowserContainer}>
          {/* Header */}
            <h2 className={styles.scriptBrowserHeader}>AVAILABLE SCRIPTS</h2>
          {/* Scripts */}
            <ul>{scripts.map((script) => (
              <li key={script.id} onClick={() => handleScriptSelect(script.id)} className={selectedScriptID === script.id ? styles.selected : ''}>
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
