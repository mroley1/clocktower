import { useContext, useState } from 'react';
import styles from './Menu.module.scss';
import { ControllerContext, ReferenceContext } from '../Game';

interface MenuProps {
  openInitialSetup: () => void
}
function Menu({openInitialSetup}: MenuProps) {
  
  const controllerContext = useContext(ControllerContext)
  const referenceContext = useContext(ReferenceContext)
  
  const [open, setOpen] = useState(false);
  
  function toggleMenu() {
    setOpen(!open);
  }
  
  function saveAndReturn() {
    controllerContext.saveGame()
    referenceContext.utilies.quitGame()
  }
  
  return (
    <>
      <div className={styles.toggle} onClick={toggleMenu}></div>
      <div className={styles.menu} onClick={()=>{setOpen(false)}}>
        <div className={styles.main} aria-expanded={open} onClick={(e)=>{e.preventDefault();e.stopPropagation()}}>
          <button onClick={saveAndReturn}>save and return to menu</button>
          <button onClick={openInitialSetup}>open Inital setup</button>
        </div>
      </div>
    </>
  );
}

export default Menu;
