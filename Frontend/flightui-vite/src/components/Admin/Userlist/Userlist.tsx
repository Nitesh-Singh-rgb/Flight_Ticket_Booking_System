import React, { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

interface User {
  userId: string;
  username: string;
  fname: string;
  email: string;
  phone: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUserList();
  }, []);

  const fetchUserList = async (): Promise<void> => {
    try {
      const response = await fetch('http://localhost:8980/getall');
      if (!response.ok) {
        throw new Error('Failed to fetch user list');
      }
      const data: User[] = await response.json();
      setUsers(data);
    } catch (error: unknown) {
      console.error('Fetch users failed:', error);
    }
  };

  const handleDeleteUser = async (userId: string): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:8980/delete/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers((prevUsers) => prevUsers.filter((user) => user.userId !== userId));
    } catch (error: unknown) {
      console.error('Delete user failed:', error);
    }
  };

  const actionTemplate = (rowData: User): ReactNode => {
    return (
      <React.Fragment>
        <Button 
          icon="pi pi-trash" 
          rounded 
          outlined 
          severity="danger" 
          onClick={() => handleDeleteUser(rowData.userId)}
          aria-label="Delete user"
          size="small"
        />
      </React.Fragment>
    );
  };

  return (
    <div className="home">
      <div>
        <DataTable 
          value={users} 
          emptyMessage="No users found"
          tableStyle={{ minWidth: '50rem' }}
        >
          <Column field="userId" header="User Id" />
          <Column field="username" header="Username" />
          <Column field="fname" header="Full Name" />
          <Column field="email" header="Email" />
          <Column field="phone" header="Phone" />
          <Column header="Actions" body={actionTemplate} />
        </DataTable>
      </div>
    </div>
  );
};

export default UserList;
