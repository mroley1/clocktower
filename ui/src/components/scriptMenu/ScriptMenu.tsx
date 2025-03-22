import { createContext, useEffect, useMemo, useState } from 'react';
import { StateManager } from '../common/StateManager';
import { GameData, GameDataJSON, HistoryJSON } from '../common/GameData';
import Menu from './menu/Menu';
import styles from './scriptMenu.module.scss'
import { ReferenceData } from '../common/ReferenceData';
import ScriptBrowser from './scriptBrowser/ScriptBrowser';
import ScriptViewer from './scriptViewer/ScriptViewer';

type MouseEventHandler = React.MouseEvent<HTMLDivElement>;

interface ScriptMenuProps {quitScriptMenu: ()=>void}
function ScriptMenu({quitScriptMenu}: ScriptMenuProps){
  //make center line draggable
  
  const [selectedScript, setSelectedScript] = useState<string | null>(null);

  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [isDragging, setIsDragging] = useState(false);

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
              <button>Create New Script</button>
              <button>Upload JSON</button>
          </div>
          <ScriptBrowser onScriptSelect={setSelectedScript} selectedScript={selectedScript} />
        </div>
        {/* Divider */}
        <div
          className={styles.divider}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        ></div>
        {/* Main Content Area */}
        <div className={styles.contentArea} style={{ width: `calc(100% - ${sidebarWidth}px)` }}>
          <div className={styles.headerButtons}>
            <button>Start New Game</button>
            <button>Download JSON</button>
            <button>Edit</button>
            <button>Other Buttons</button>
          </div>
          <ScriptViewer />
        </div>
    </div>
    </>
  );
}


export default ScriptMenu
