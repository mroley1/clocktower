import { Suspense, useContext, useState } from 'react';
import { useQuery } from 'react-query';
import './RoleSelect.scss';
import { GameContext } from '@/components/App';
import Role from '@/common/Role';
import Loading from './Loading';
import { RoleType } from '@/common/RoleType';

interface Props {
  selections: Role[], // stores selections
  setSelections: Function, // sets selections
  max: number // maximum number of selections
}

function RoleSelect(props: Props) {
  
  const gameContext = useContext(GameContext)
  
  function RoleButton(buttonProps: any) {
    
    function onClick() {
      let tmp = props.selections.slice()
      if (tmp.find((selection)=>selection.id === buttonProps.role.id)) {
        tmp.splice(tmp.indexOf(buttonProps.role), 1)
      } else {
        if (tmp.length !< props.max) {
          tmp.push(buttonProps.role)
        } else {
          tmp.shift()
          tmp.push(buttonProps.role)
        }
      }
      props.setSelections(tmp)
    }
    
    const icon = require(`@assets/icons/${buttonProps.role.id}.png`)
    
    var classes = ""
    if (props.selections.find((selection)=>selection.id === buttonProps.role.id)) {
      classes = "selected"
    }
    
    return (
        <div className={`role ${classes}`} onClick={onClick}>
            <img className='icon' src={icon} loading='lazy'></img>
            <span className='title'>{buttonProps.role.name}</span>
        </div>
    )
  }
  
  async function fetchData() {
    if (gameContext.state.script.roles.length === 0) {return []}
    return fetch(`http://localhost:8000/role/multi/?roleList=${JSON.stringify(gameContext.state.script.roles)}`).then((response)=>{
            if (response.status === 200) {
                return (response.json());
            } else {
                throw new Error("HTTP Error: " + response.status + ": " + response.statusText);
            }
        }).then((jsonOutput)=>{
          return jsonOutput
        }).catch((error)=>{
            console.error(error)
            return Promise.reject(error)
        })
  }
  
  const query = useQuery("getRoleMulti", fetchData);
  
  if (query.isLoading) {return <Loading></Loading>}
  
  if (query.error) {return <div className='error'>Error: Could not load roles</div>}
  
  function order(a:Role, b:Role) {
    return parseInt(RoleType[a.type])-parseInt(RoleType[b.type])
  }
  
  const buttons = (()=> {
    if (query.data.length === 0) {
      return <div className='error'>No roles found<br></br>Make sure a script is selected</div>
    } else {
      return query.data.sort((a:Role, b:Role)=>order(a,b)).map((role: Role)=><RoleButton key={Math.random()} role={role}></RoleButton>)
    }
  })()
  
  return (
    <Suspense fallback={<Loading></Loading>}>
      <div className='radialMenuRoleSelectDialogue'>
        {buttons}
      </div>
    </Suspense>
  )
}

export default RoleSelect;
