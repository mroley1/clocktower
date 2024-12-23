import { useContext, useState } from 'react';
import styles from './Bag.module.scss';
import { ControllerContext, ReferenceContext } from '../Game';

interface BagProps {
    completeSetupFunc: () => void
}
function Bag({completeSetupFunc}: BagProps) {
  
  const referenceContext = useContext(ReferenceContext)
  
  return (
    <>
        <div>hi</div>
        <button onClick={completeSetupFunc}>start</button>
        {referenceContext.roles.roleList.map((role) => {
            return (
                <div>
                    {role.name}
                </div>
            )
        })}
    </>
  );
}

export default Bag;
