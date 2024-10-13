import { useContext, useState } from 'react';
import styles from './Menu.module.scss';
import { ControllerContext, DataContext } from '../Game';


function Menu() {
  
  const controllerContext = useContext(ControllerContext)
  const referenceData = useContext(DataContext)
  
  const [open, setOpen] = useState(false);
  
  function toggleMenu() {
    setOpen(!open);
  }
  
  function saveAndReturn() {
    controllerContext.saveGame()
    referenceData.utilies.quitGame()
  }
  
  return (
    <>
      <div className={styles.toggle} onClick={toggleMenu}></div>
      <div className={styles.menu} onClick={()=>{setOpen(false)}}>
        <div className={styles.main} aria-expanded={open} onClick={(e)=>{e.preventDefault();e.stopPropagation()}}>
          <button onClick={saveAndReturn}>save and return to menu</button>
        </div>
      </div>
    </>
  );
}

export default Menu;
