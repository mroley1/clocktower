import { useEffect, useState } from 'react';
import Menu from './menu/Menu';
import styles from './scriptMenu.module.scss'
import ScriptBrowser from './scriptBrowser/ScriptBrowser';
import ScriptViewer from './scriptViewer/ScriptViewer';
import ScriptData from '../common/ScriptData';
import jsPDF from 'jspdf';
import { newSave } from '../Saves';
import { useNavigate } from 'react-router';

function ScriptMenu(){
  //make center line draggable
  
  const navigate = useNavigate();
  
  const quitScriptMenu = () => {
    navigate("/")
  }
  
  const handleNewSave = (script: ScriptData) => {
    newSave(script).then(tag => navigate("/" + tag.gameID))
  }

  const handleNewSaveButton = () => {
    if (selectedScript) {
      handleNewSave(selectedScript);
    }
  };
  
  //Id of the selected script, used for the API
  const [selectedScriptID, setSelectedScriptID] = useState<number | null>(null);
  //Actual script data, used for displaying the script and information about it, as well as downloading pdf and json
  const [selectedScript, setSelectedScript] = useState<ScriptData | null>(null);
  //Toggle for edit mode, used for editing the script
  const [editMode, setEditMode] = useState(false);
  //keeps track of the width of the sidebar, used for the draggable line between browser and viewer
  const [sidebarWidth, setSidebarWidth] = useState(300);
  //keeps track of the dragging state of the sidebar, used for the draggable line between browser and viewer
  const [isDragging, setIsDragging] = useState(false);
  //error message for when the API fails to fetch the script data
  const [error, setError] = useState<string | null>(null);

  //get script data whenver selectedScriptID changes
  useEffect(() => {
          const fetchScript = async () => {
            try {
              const response = await fetch('https://clocktower-api-2-clocktower-api.apps.okd4.csh.rit.edu/api/scripts/' + selectedScriptID);
              if (!response.ok) throw new Error('Failed to fetch script');
      
              const data: ScriptData = await response.json();
              setSelectedScript(data);
              
              //error catching
            } catch (err: any) {
              console.error(err);
              setError(err.message || 'Unknown error');
            }
          };
          fetchScript();
        }, [selectedScriptID]);

  //this is used for the draggable line
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const newWidth = Math.max(300, Math.min(e.clientX, window.innerWidth - 100));
      setSidebarWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  

  /**
   * Handles the generation and download of a PDF document for the selected script.
   * 
   * This function creates a PDF using the jsPDF library, including the script's name,
   * author, and a list of roles. The generated PDF is then downloaded with a filename
   * based on the script's name.
   * 
   * @remarks
   * - If no script is selected (`selectedScript` is falsy), the function exits early.
   * - The PDF includes a title with the script's name and author, followed by a list
   *   of roles with vertical spacing between each role.
   * 
   * @example
   * // Assuming `selectedScript` is defined with a name, author, and roles:
   * handleDownloadPDF();
   * // This will generate and download a PDF file named after the script.
   */
  const handleDownloadPDF = () => {
    if (!selectedScript) return;
  
    const doc = new jsPDF();
  
    const title = `${selectedScript.name} by ${selectedScript.author}`;
    doc.setFontSize(16);
    doc.text(title, 10, 20);
  
    doc.setFontSize(12);
    selectedScript.roles.forEach((role, index) => {
      doc.text(`- ${role.role_name}`, 10, 30 + index * 8); // vertical spacing
    });
  
    doc.save(`${selectedScript.name || 'script'}.pdf`);
  };

  /**
   * Handles the download of the selected script as a JSON file.
   * 
   * This function converts the `selectedScript` object into a JSON string,
   * creates a downloadable Blob from it, and triggers a download in the browser.
   */
  const handleDownloadJSON = () => {
    if (!selectedScript) return;
  
    const json = JSON.stringify(selectedScript, null, 2); // pretty format
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedScript.name || 'script'}.json`;
    document.body.appendChild(link);
    link.click();
  
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  /**
   * Handles the creation of a new script.
   * - Sets the selected script ID to -1 to indicate a new script.
   * - Initializes a new script object with default values.
   * - Sets the new script as the currently selected script.
   * - Enables edit mode for the new script.
   */
  const handleNewScript = () => {
    // Logic to create a new script
    setSelectedScriptID(-1); // Set to -1 to indicate a new script
    let newScript: ScriptData = {name: "New Script", author: "Author", roles: []};
    setSelectedScript(newScript); // Set the new script as selected
    setEditMode(true); // Enable Edit Mode
  }

  return (
    <>
      <Menu quitScriptMenu={quitScriptMenu} ></Menu>
      <div
        className={styles.mainLayout}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Script Brower */}
        <div className={styles.scriptList}>
          <div className={styles.headerButtons} style={{ width: sidebarWidth }}>
              <button onClick={handleNewScript}>Create New Script</button>
              <button>Upload JSON</button>
          </div>
          <ScriptBrowser setSelectedScriptID={setSelectedScriptID} selectedScriptID={selectedScriptID} />
        </div>
        {/* Divider */}
        <div
          className={styles.divider}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        ></div>
        {/* Main Content Area */}
        <div className={styles.contentArea} style={{ width: `calc(100% - ${sidebarWidth}px)` }}>
          <div className={`${styles.headerButtons} ${selectedScript ? '' : styles['headerButtons--disabled']}`}>
            <button onClick={handleNewSaveButton}>Start New Game</button>
            <button onClick={handleDownloadJSON}>Download JSON</button>
            <button onClick={handleDownloadPDF}>Download PDF</button>
            <button onClick={() => setEditMode(!editMode)}>{editMode ? 'Stop Editing' : 'Edit'}</button>
          </div>
          {/* Script Viewer */}
          <ScriptViewer script={selectedScript} editMode={editMode} setSelectedScript={setSelectedScript}/>
        </div>
    </div>
    </>
  );
}


export default ScriptMenu
