
import { ReferenceData } from '@/components/common/ReferenceData';
import styles from './Picker.module.scss';
import { BagItem } from './Picker';

interface ColumnProps {
    roles: BagItem[]
}
function Column({roles}: ColumnProps) {
  
    return (
        <div className={styles.column}>
            {roles.map((role, i) => (
                <div key={i}>
                    {role.roleData.id}{role.quantity}
                </div>
            ))}
        </div>
    );
}

export default Column;
