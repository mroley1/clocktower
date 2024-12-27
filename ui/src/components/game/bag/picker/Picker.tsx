
import { useContext, useState } from 'react';
import { ClassType } from '../../../../components/common/RoleType';
import Column from './Column';
import Info from './Info';
import styles from './Picker.module.scss';
import Selector from './Selector';
import { ReferenceData } from '@/components/common/ReferenceData';
import { ReferenceContext } from '../../Game';

const classes = [ClassType.TOWNSFOLK, ClassType.OUTSIDER, ClassType.MINION, ClassType.DEMON]
    
export interface BagItem {
    roleData: ReferenceData.RoleData
    quantity: number
}

function Picker() {
    
    const referenceContext = useContext(ReferenceContext)
    
    const [infoIsVisible, setInfoIsVisible] = useState(false)
    const [selectedRole, setSelectedRole] = useState<undefined|ReferenceData.RoleData>(undefined)
    function closeInfo() {
        setInfoIsVisible(false)
    }
    function setSelectedRoleFunc(role: ReferenceData.RoleData|undefined) {
        setInfoIsVisible(true)
        setSelectedRole(role)
    }
    
    const [isDown, setIsDown] = useState(false)
    function toggleIsDown() {
        setIsDown(!isDown)
    }
    
    const [bagItems, setBagItems] = useState<BagItem[]>([])
    const columns = classes.map((classType) => bagItems.filter(bagItem => classType == bagItem.roleData.classType))
    
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
                    {columns.map((column, i) => <Column key={i} roles={column}></Column>)}
                </div>
                <div className={styles.switching_divider} onClick={toggleIsDown}></div>
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
