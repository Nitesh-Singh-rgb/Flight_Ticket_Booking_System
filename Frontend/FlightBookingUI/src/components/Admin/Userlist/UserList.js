import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react'

export default function UserList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUserList();
    }, []);

    const fetchUserList = async () => {
        try {
            const response = await fetch('http://localhost:8980/getall');
            if (!response.ok) {
                throw new Error('Failed to fetch user list');
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8980/delete/${userId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            // Remove the deleted user from the state
            setUsers((prevUsers) => prevUsers.filter((user) => user.userId !== userId));
        } catch (error) {
            console.error(error);
        }
    };

    const actionTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-trash" rounded outlined severity='danger' onClick={() => handleDeleteUser(rowData.userId)}>Delete</Button>
            </React.Fragment>
        )
    }

    return (
        <div className='home'>
            <div>
                <DataTable value={users}>
                    <Column field='userId' header='User Id'></Column>
                    <Column field='username' header='Username'></Column>
                    <Column field='fname' header='Full Name'></Column>
                    <Column field='email' header='Email'></Column>
                    <Column field='phone' header='Phone'></Column>
                    <Column body={actionTemplate}></Column>
                </DataTable>
            </div>
        </div>
    )
}
