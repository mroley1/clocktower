
import { useContext, useState } from 'react';
import { ClassType } from '../../../../components/common/RoleType';
import Column from './Column';
import Info from './Info';
import styles from './Picker.module.scss';
import Selector from './Selector';
import { ReferenceData } from '@/components/common/ReferenceData';
import { ReferenceContext } from '../../Game';
import { BagItem } from '../Bag';

const classes = [ClassType.TOWNSFOLK, ClassType.OUTSIDER, ClassType.MINION, ClassType.DEMON]

interface PickerProps {
    playerCount: number
    bagItems: BagItem[]
    setBagItems: React.Dispatch<React.SetStateAction<BagItem[]>>
}
function Picker({playerCount, bagItems, setBagItems}: PickerProps) {
    
    const referenceContext = useContext(ReferenceContext)
    
    const [infoIsVisible, setInfoIsVisible] = useState(false)
    const [selectedRole, setSelectedRole] = useState<undefined|ReferenceData.RoleData>(undefined)
    function closeInfo() {
        setInfoIsVisible(false)
    }
    function setSelectedRoleFunc(role: ReferenceData.RoleData|undefined) {
        setInfoIsVisible(role!=undefined)
        setSelectedRole(role)
    }
    
    const [isDown, setIsDown] = useState(false)
    function toggleIsDown() {
        setIsDown(!isDown)
    }
    function setIsDownFunc(state: boolean) {
        setIsDown(state)
    }
    
    const columns = classes.map((classType) => {
        return {
            classType,
            roles: bagItems.filter(bagItem => classType == bagItem.roleData.classType)
        }
    })
    
    function addToBagRoles(role: ReferenceData.RoleData) {
        const existing = bagItems.find(bagItem => bagItem.roleData.id == role.id)
        if (existing) {
            setBagItems(bagItems.map(bagItem => {
                if (bagItem.roleData.id == existing.roleData.id) {
                    existing.quantity++
                    return existing
                }
                return bagItem
            }))
        } else {
            setBagItems(
                bagItems.concat({
                    roleData: role,
                    quantity: 1
                })
            )
        }
    }
    
    function removeFromBagRoles(role: string) {
        const existing = bagItems.find(bagItem => bagItem.roleData.id == role)
        if (existing) {
            setBagItems(bagItems.map(bagItem => {
                if (bagItem.roleData.id == existing.roleData.id) {
                    existing.quantity--
                    return existing
                }
                return bagItem
            }).filter(bagItems => bagItems.quantity > 0))
        }
    }
    
    return (
        <div className={styles.picker}>
            <div className={styles.sliding_panels}>
                <div className={styles.columns} data-showing={!isDown} >
                    <div className={styles.container}>
                        {columns.map((column, i) => <Column key={i} roles={column} playerCount={playerCount} selectedRole={selectedRole} setSelectedRole={setSelectedRoleFunc} setIsDownFunc={setIsDownFunc}></Column>)}
                    </div>
                </div>
                <div className={styles.switching_divider} onClick={toggleIsDown} data-is-down={isDown}></div>
                <div className={styles.selector_wrapper} data-showing={isDown}>
                    <Selector selectedRole={selectedRole} setSelectedRole={setSelectedRoleFunc}></Selector>
                </div>
            </div>
            <div className={styles.info_wrapper} data-visible={infoIsVisible}>
                <Info selectedRole={selectedRole} setSelectedRole={setSelectedRoleFunc} closeInfo={closeInfo} addToBagRoles={addToBagRoles} removeFromBagRoles={removeFromBagRoles}></Info>
            </div>
        </div>
    );
}

export default Picker;
