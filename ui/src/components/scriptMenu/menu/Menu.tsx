import { useContext, useState } from 'react';
import styles from './Menu.module.scss';

interface ScriptMenuMenuProps {quitScriptMenu: ()=>void}
function Menu({quitScriptMenu}: ScriptMenuMenuProps) {
  
  //const controllerContext = useContext(ControllerContext)
  //const referenceContext = useContext(ReferenceContext)
  
  const [open, setOpen] = useState(false);
  
  function toggleMenu() {
    setOpen(!open);
  }
  
  function saveAndReturn() {
    //controllerContext.saveGame()
    quitScriptMenu();
  }
  
  return (
    <>
      <div className={styles.toggle} onClick={toggleMenu}></div>
      <div className={styles.menu} onClick={()=>{setOpen(false)}}>
        <div className={styles.main} aria-expanded={open} onClick={(e)=>{e.preventDefault();e.stopPropagation()}}>
          <button onClick={saveAndReturn}>return to menu</button>
        </div>
      </div>
    </>
  );
}

export default Menu;
