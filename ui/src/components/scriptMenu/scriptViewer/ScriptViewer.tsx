import { useState, useEffect } from 'react';
import ScriptData from '@/components/common/ScriptData';
import { Role } from '@/components/common/Types';
import RoleSelector from '../../common/roleSelector/RoleSelector';
interface ScriptViewerProps {
    script: ScriptData | null; //Currently selected script, not updated when editing
    editMode: boolean; //Edit mode toggle, used to show edit controls
    setSelectedScript: (script: ScriptData) => void; //Sets the selected script in the script menu
  }
  

function ScriptViewer({ script, editMode, setSelectedScript }: ScriptViewerProps) {
    // Editable script is a local copy of the script that is being edited, this is used to update the script in the script menu when saving
    const [editableScript, setEditableScript] = useState<ScriptData | null>(null);
    // Show roles toggle, used to show the role selector when adding a role
    const [showRoles, setShowRoles] = useState(false);

    // Sync local editable copy when a new script is selected
    useEffect(() => {
        setEditableScript(script ? { ...script } : null);
      }, [script]);
    //if no script selected tell use to select a script
    if (!script || !editableScript) return <div>Select a script to view details</div>;
  
  

    // Function to handle adding a role to the script
    const handleAddRole = (role: Role) => {
      console.log(role)
      if (editableScript) {
        setEditableScript({
          ...editableScript,
          roles: [...editableScript.roles, role],
        });
      }
    }

    //handle select role is passed to the role selector and is generic
    const handleSelectRole = (role: Role) => {
      console.log(role)
      handleAddRole(role);
    }

    const handleSaveScript = () => {
      if (editableScript) {
        // Send the editable script back to script menu
        setSelectedScript(editableScript)
        console.log(editableScript)

      }
    }
    //toggles the role selector
    const handleShowRoles = () => {
        setShowRoles(!showRoles);
      };

    // Handle removing a role from the script
    const handleRemoveRole = (indexToRemove: number) => {
        const newRoles = [...editableScript.roles];
        newRoles.splice(indexToRemove, 1);
      
        setEditableScript({
          ...editableScript,
          roles: newRoles
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
            <button onClick={handleSaveScript}>Save Script</button>
            <button onClick={handleShowRoles}>Add Role</button>
            
          </div>
        )}
        {showRoles && (<RoleSelector handleSelectRole={handleSelectRole}/>)}
        {/* List of roles */}
        <ul>
  {editableScript && editableScript?.roles?.map((roles: Role, index: number) => (
    <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {roles.role_name}
      {/* If edit mode is enabled, show the remove button */}
      {editMode && (
        <button onClick={() => handleRemoveRole(index)}>Remove</button>
      )}
    </li>))}</ul>
      </div>
    
  
    );
    
    
}

export default ScriptViewer;