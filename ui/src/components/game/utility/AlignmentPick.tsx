import styles from './AlignmentPick.module.scss'
import { Alignmant } from '../../../components/common/RoleType';

interface AlignmentPickProps {setAlignmentSelect: React.Dispatch<React.SetStateAction<Alignmant|undefined>>}
function AlignmentPick({setAlignmentSelect}: AlignmentPickProps) {
    
    const selectAlignment = (alignment: Alignmant) => {
        console.log(alignment)
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
