
import { createContext, useContext, useState } from 'react';
import { ClassType } from '../../../../components/common/RoleType';
import Column from './Column';
import Info from './Info';
import styles from './Picker.module.scss';
import Selector from './Selector';
import { ReferenceData } from '@/components/common/ReferenceData';
import { ReferenceContext } from '../../Game';
import { BagItem } from '../Bag';

const classes = [ClassType.TOWNSFOLK, ClassType.OUTSIDER, ClassType.MINION, ClassType.DEMON]
    
export interface ColumnFormat {
    classType: ClassType
    roles: BagItem[]
}

interface PickerContextFormat {
    playerCount: number
    selectedRole: ReferenceData.RoleData|undefined
    setSelectedRole: (role: ReferenceData.RoleData) => void
    closeInfo: () => void
    infoIsVisible: boolean
}
export const PickerContext = createContext<PickerContextFormat>({
    playerCount: 5,
    selectedRole: undefined,
    setSelectedRole: (role: ReferenceData.RoleData) => {},
    closeInfo: () => {},
    infoIsVisible: false
})

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
    function setSelectedRoleFunc(role: ReferenceData.RoleData) {
        setInfoIsVisible(true)
        setSelectedRole(role)
    }
    
    const [isDown, setIsDown] = useState(false)
    function toggleIsDown() {
        setIsDown(!isDown)
    }
    function setIsDownFunc(state: boolean) {
        setIsDown(state)
    }
    
    const columns: ColumnFormat[] = classes.map((classType) => {
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
    
    const pickerContext: PickerContextFormat = {
        playerCount,
        selectedRole,
        setSelectedRole: setSelectedRoleFunc,
        closeInfo,
        infoIsVisible
    }
    
    return (
        <div className={styles.picker}>
            <PickerContext.Provider value={pickerContext}>
                <div className={styles.sliding_panels}>
                    <div className={styles.columns} data-showing={!isDown} >
                        <div className={styles.container}>
                            {columns.map((column, i) => <Column key={i} roles={column} setIsDownFunc={setIsDownFunc}></Column>)}
                        </div>
                    </div>
                    <div className={styles.switching_divider} onClick={toggleIsDown} data-is-down={isDown}></div>
                    <div className={styles.selector_wrapper} data-showing={isDown}>
                        <Selector></Selector>
                    </div>
                </div>
                <div className={styles.info_wrapper} data-visible={infoIsVisible}>
                    <Info addToBagRoles={addToBagRoles} removeFromBagRoles={removeFromBagRoles}></Info>
                </div>
            </PickerContext.Provider>
        </div>
    );
}

export default Picker;
