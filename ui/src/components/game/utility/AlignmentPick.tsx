import styles from './AlignmentPick.module.scss'
import { Alignmant } from '../../../components/common/RoleType';

interface AlignmentPickProps {setAlignmentSelect: (alignment: Alignmant) => void}
function AlignmentPick({setAlignmentSelect}: AlignmentPickProps) {
    
    const selectAlignment = (alignment: Alignmant) => {
        setAlignmentSelect(alignment)
    }
  
    return (
        <div>
            Select Alignment: 
            <button onClick={() => {selectAlignment(Alignmant.GOOD)}}>Good</button>
            <button onClick={() => {selectAlignment(Alignmant.EVIL)}}>Evil</button>
        </div>
    );
}

export default AlignmentPick;
