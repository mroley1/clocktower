import { useContext, useState } from 'react';
import ScriptData from '@/components/common/ScriptData';
interface ScriptViewerProps {
    script: ScriptData | null;
  }
  
const testScript: ScriptData = {"author":"Official","name":"Trouble Brewing", data:["chef","empath","fortuneteller","investigator","librarian","mayor","monk","ravenkeeper","slayer","soldier","undertaker","virgin","washerwoman","butler","drunk","recluse","saint","baron","poisoner","scarletwoman","spy","imp"]}

function ScriptViewer({ script }: ScriptViewerProps) {
    //if no script selected tell use to select a script
    if (!script) return <div>Select a script to view details</div>;


    return(
        <>
        <div>
            <h2 /*Title and Author of script*/>{script.name} <span style={{ fontWeight: 'normal' }}>by {script.author}</span></h2>
            <ul /*Display roles*/>{script.data.map((role, index) => (
                <li key={index}>{role}</li>))}
            </ul>
        </div>
        </>
    )
}

export default ScriptViewer;