import React, { useEffect, useState } from 'react';
import { Role } from '@/components/common/Types';


interface RoleSelectorProps {
  handleSelectRole: (role: Role) => void
}

function RoleSelector({ handleSelectRole }: RoleSelectorProps) {
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState<Role[]>([]);
    const [error, setError] = useState<string | null>(null);
    //get roles from api
    useEffect(() => {
              const fetchScript = async () => {
                try {
                  const response = await fetch('https://clocktower-api-2-clocktower-api.apps.okd4.csh.rit.edu/api/roles/');
                  if (!response.ok) throw new Error('Failed to fetch roles');
          
                  const data: Role[] = await response.json();
                  setRoles(data);
                  
                } catch (err: any) {
                  console.error(err);
                  setError(err.message || 'Unknown error');
                } finally {
                  setLoading(false);
                }
              };
              fetchScript();
            }, []);

    if (loading) return <p>Loading scripts...</p>;
    if (error) return <p>Error loading scripts: {error}</p>;
    return (
        <div>
            <h2>Available Roles</h2>
            <ul>{roles.map((role) => (
              
              <li  key={role.id} >
                <div onClick={() => handleSelectRole(role)}><strong>{role.role_name}</strong></div>
              </li>))}
            </ul>
        </div>
  );
}

export default RoleSelector;