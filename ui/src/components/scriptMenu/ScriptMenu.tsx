import { createContext, useEffect, useMemo, useState } from 'react';
import { StateManager } from '../common/StateManager';
import { GameData, GameDataJSON, HistoryJSON } from '../common/GameData';
import Menu from './menu/Menu';
import styles from './scriptMenu.module.scss'
import { ReferenceData } from '../common/ReferenceData';
import ScriptBrowser from './scriptBrowser/ScriptBrowser';
import ScriptViewer from './scriptViewer/ScriptViewer';
import ScriptData from '../common/ScriptData';
import { Script } from '../common/Types';
import jsPDF from 'jspdf';

type MouseEventHandler = React.MouseEvent<HTMLDivElement>;

interface ScriptMenuProps {
  quitScriptMenu: ()=>void;
  handleNewSave: ()=>void
}
function ScriptMenu({quitScriptMenu, handleNewSave}: ScriptMenuProps){
  //make center line draggable

  const handleNewSaveClick = () => {
    handleNewSave();
  };

  const [selectedScriptID, setSelectedScriptID] = useState<number | null>(1);
  const [selectedScript, setSelectedScript] = useState<ScriptData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //get script data
  useEffect(() => {
          const fetchScript = async () => {
            try {
              const response = await fetch('https://clocktower-api-2-clocktower-api.apps.okd4.csh.rit.edu/api/scripts/' + selectedScriptID);
              if (!response.ok) throw new Error('Failed to fetch script');
      
              const data: ScriptData = await response.json();
              setSelectedScript(data);
              
            } catch (err: any) {
              console.error(err);
              setError(err.message || 'Unknown error');
            }
          };
      
          fetchScript();
        }, [selectedScriptID]);

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
  
  const handleDownloadPDF = () => {
    if (!selectedScript) return;
  
    const doc = new jsPDF();
  
    const title = `${selectedScript.name} by ${selectedScript.author}`;
    doc.setFontSize(16);
    doc.text(title, 10, 20);
  
    doc.setFontSize(12);
    selectedScript.roles.forEach((role, index) => {
      doc.text(`- ${role}`, 10, 30 + index * 8); // vertical spacing
    });
  
    doc.save(`${selectedScript.name || 'script'}.pdf`);
  };

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
  
  const handleNewScript = () => {
    // Logic to create a new script
    setSelectedScriptID(-1); // Set to -1 to indicate a new script
    let newScript: ScriptData = {name: "New Script", author: "Author", roles: []};
    setSelectedScript(newScript); // Set the new script as selected
    setEditMode(!editMode); // Toggle edit mode
  }

  return (
    <>
      <Menu quitScriptMenu={quitScriptMenu} ></Menu>
      <div
        className={styles.mainLayout}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Sidebar */}
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
            <button onClick={handleNewSaveClick}>Start New Game</button>
            <button onClick={handleDownloadJSON}>Download JSON</button>
            <button onClick={handleDownloadPDF}>Download PDF</button>
            <button onClick={() => setEditMode(!editMode)}>{editMode ? 'Exit Edit Mode' : 'Edit'}</button>
          </div>
          <ScriptViewer script={selectedScript} editMode={editMode}/>
        </div>
    </div>
    </>
  );
}


export default ScriptMenu
