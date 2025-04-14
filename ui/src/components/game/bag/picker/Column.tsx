
import { ReferenceData } from '@/components/common/ReferenceData';
import { ClassType } from '../../../../components/common/RoleType';
import styles from './Picker.module.scss';
import { BagItem } from '../Bag';
import { useContext } from 'react';
import { ReferenceContext } from '../../Game';
import { ColumnFormat, PickerContext } from './Picker';
import { BreakdownFormat, decomposeClassMakeup } from '../../utility/decomposeClassMakeup';


interface ColumnProps {
    roles: ColumnFormat
    breakdown: BreakdownFormat[]
    setIsDownFunc: (state: boolean) => void
}
function Column({roles, breakdown, setIsDownFunc}: ColumnProps) {
    
    const {bagItems, playerCount, selectedRole, setSelectedRole, closeInfo, infoIsVisible} = useContext(PickerContext)
    
    const expectedClassNumberBreakdown = breakdown.find(ledger => ledger.classType == roles.classType)!
    
    function ratioColor() {
        if ((expectedClassNumberBreakdown.extra[0] || expectedClassNumberBreakdown.extra[1]) && playerCount != bagItems.length) {
            return "unbalanced"
        }
        const lower = expectedClassNumberBreakdown?.expected + expectedClassNumberBreakdown.extra[0]
        const upper = expectedClassNumberBreakdown?.expected + expectedClassNumberBreakdown.extra[1]
        if (quantity < lower) {
            return "default"
        } else if (quantity > upper) {
            return "bad"
        } else {
            return "good"
        }
    }
    
    function ratioFormat() {
        let trailing = ""
        if (expectedClassNumberBreakdown.extra[0] || expectedClassNumberBreakdown.extra[1]) {
            if (Math.abs(expectedClassNumberBreakdown.extra[0]) == expectedClassNumberBreakdown.extra[1]) {
                trailing = `±${expectedClassNumberBreakdown.extra[1]}`
            } else {
                trailing = `+${expectedClassNumberBreakdown.extra[1]} ${expectedClassNumberBreakdown.extra[0]}`
            }
        }
        return `${quantity}/${expectedClassNumberBreakdown.expected}${trailing}`
    }
    
    const quantity = roles.roles.reduce((previous, current) => {
        return previous + current.quantity
    }, 0)
    
    return (
        <div className={styles.column} onClick={closeInfo}>
            <div className={styles.header} onClick={()=>{setIsDownFunc(false)}} data-color={ratioColor()}>
                {ClassType[roles.classType]}
                <br></br>
                <div className={styles.ratio}>
                    {ratioFormat()}
                </div>
                <RequiredDropdown requiredRoleIds={expectedClassNumberBreakdown.required}></RequiredDropdown>
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

interface RequiredDropdownProps {
    requiredRoleIds: string[]
}
function RequiredDropdown({requiredRoleIds}: RequiredDropdownProps) {
    
    console.log(requiredRoleIds)
    
    if (!requiredRoleIds.length) {
        return null
    } else {
        return (
            <div className={styles.required_dropdown_container}>
                <div className={styles.dropdown}></div>
            </div>
        )
    }
}

// {requiredRoleIds.map((roleId) => <div key={roleId}>{roleId}</div>)}