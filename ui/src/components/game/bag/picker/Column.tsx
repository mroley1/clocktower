
import { ReferenceData } from '@/components/common/ReferenceData';
import { ClassType } from '../../../../components/common/RoleType';
import styles from './Picker.module.scss';
import { BagItem } from '../Bag';
import { useContext } from 'react';
import { ReferenceContext } from '../../Game';
import { ColumnFormat, PickerContext } from './Picker';


const ExpectedClassNumberBreakdown = {
    town: [0, 0, 0, 0, 0, 3, 3, 5, 5, 5, 7, 7, 7, 9, 9, 9],
    out:  [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 1, 2, 0, 1, 2],
    min:  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3],
    dem:  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
}

interface ColumnProps {
    roles: ColumnFormat
    setIsDownFunc: (state: boolean) => void
}
function Column({roles, setIsDownFunc}: ColumnProps) {
    
    const {playerCount, selectedRole, setSelectedRole, closeInfo, infoIsVisible} = useContext(PickerContext)
    
    function getExpectedClassNumberBreakdown() {
        switch (roles.classType) {
            case ClassType.TOWNSFOLK:
                return ExpectedClassNumberBreakdown.town[playerCount]
            case ClassType.OUTSIDER:
                return ExpectedClassNumberBreakdown.out[playerCount]
            case ClassType.MINION:
                return ExpectedClassNumberBreakdown.min[playerCount]
            case ClassType.DEMON:
                return ExpectedClassNumberBreakdown.dem[playerCount]
            default:
                return 0
        }
    }
    const expectedClassNumberBreakdown = getExpectedClassNumberBreakdown()
    
    function ratioColor(numerator: number, denominator: number) {
        if (numerator == denominator) {
            return "good"
        } else if (numerator > denominator) {
            return "bad"
        } else {
            return "default"
        }
    }
    
    const quantity = roles.roles.reduce((previous, current) => {
        return previous + current.quantity
    }, 0)
    
    return (
        <div className={styles.column} onClick={closeInfo}>
            <div className={styles.header} onClick={()=>{setIsDownFunc(false)}} data-color={ratioColor(quantity, expectedClassNumberBreakdown)}>
                {ClassType[roles.classType]}
                <br></br>
                <div className={styles.ratio}>
                    {quantity}/{expectedClassNumberBreakdown}
                </div>
            </div>
            <div className={styles.body}>
                {roles.roles.map((bagItem) => (
                    <Item key={bagItem.roleData.id} bagItem={bagItem} setSelectedRole={setSelectedRole} closeInfo={closeInfo} highlight={selectedRole?.id == bagItem.roleData.id && infoIsVisible}></Item>
                ))}
            </div>
        </div>
    );
}

export default Column;

interface ItemProps {
    bagItem: BagItem
    setSelectedRole: (role: ReferenceData.RoleData) => void
    closeInfo: () => void
    highlight: boolean
}
function Item({bagItem, setSelectedRole, closeInfo, highlight}: ItemProps) {
  
    function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.preventDefault()
        e.stopPropagation()
        if (highlight) {
            closeInfo()
        } else {
            setSelectedRole(bagItem.roleData)
        }
    }
    
    const referenceContext = useContext(ReferenceContext)
    
    const image = referenceContext.image.getRoleImage(bagItem.roleData.id)
    
    return (
        <div className={styles.item} data-highlight={highlight} onClick={handleClick}>
            <img src={image}></img>
            {bagItem.quantity==1?null:
                <div className={styles.quantity}>{bagItem.quantity}</div>
            }
        </div>
    )
}