import { useContext, useState, useEffect } from 'react';
import ScriptData from '@/components/common/ScriptData';
interface ScriptViewerProps {
    script: ScriptData | null;
    editMode: boolean;
  }
  
const testScript: ScriptData = {"author":"Official","name":"Trouble Brewing", data:["chef","empath","fortuneteller","investigator","librarian","mayor","monk","ravenkeeper","slayer","soldier","undertaker","virgin","washerwoman","butler","drunk","recluse","saint","baron","poisoner","scarletwoman","spy","imp"]}

function ScriptViewer({ script, editMode }: ScriptViewerProps) {
    const [editableScript, setEditableScript] = useState<ScriptData | null>(null);
    // Sync local editable copy when a new script is selected
    useEffect(() => {
        setEditableScript(script ? { ...script } : null);
      }, [script]);
    //if no script selected tell use to select a script
    if (!script) return <div>Select a script to view details</div>;
    

    
  
    // If no script is selected
    if (!editableScript) return <div>Select a script to view details</div>;
  
    const handleRemoveRole = (indexToRemove: number) => {
        const newRoles = [...editableScript.data];
        newRoles.splice(indexToRemove, 1);
      
        setEditableScript({
          ...editableScript,
          data: newRoles
        });
      };

    // Handle typing into the input
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditableScript({
        ...editableScript,
        name: e.target.value,
      });
    };
  
    return (
      <div>
        {/* Title section */}
        {editMode ? (
          <input
            type="text"
            value={editableScript.name}
            onChange={handleTitleChange}
            style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}
          />
        ) : (
          <h2>
            {editableScript.name}{' '}
            <span style={{ fontWeight: 'normal' }}>by {editableScript.author}</span>
          </h2>
        )}
  
        {/* Edit controls */}
        {editMode && (
          <div className="editControls">
            <button>Add Role</button>
          </div>
        )}
  
        {/* List of roles */}
        <ul>
  {editableScript.data.map((role, index) => (
    <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {role}
      {editMode && (
        <button onClick={() => handleRemoveRole(index)}>Remove</button>
      )}
    </li>
  ))}
</ul>
      </div>
    );
    
    
}

export default ScriptViewer;