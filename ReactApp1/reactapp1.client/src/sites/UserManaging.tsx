import React, { useState, useEffect } from 'react';

interface User {
    id: string;
    username: string;
    email: string;
}

const UserManaging: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [newUser, setNewUser] = useState({ username: '', email: '', password: '' });
    const [editingUser, setEditingUser] = useState<User | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token"); // Get the token from localStorage
            const response = await fetch('/api/usermanaging', {
                headers: {
                    'Authorization': `Bearer ${token}`, // Add token to Authorization header
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    const createUser = async () => {
        try {
            const token = localStorage.getItem("token"); // Get the token from localStorage
            const response = await fetch('/api/usermanaging', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Add token to Authorization header
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setNewUser({ username: '', email: '', password: '' });
            fetchUsers();
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    const updateUser = async () => {
        if (editingUser) {
            try {
                const token = localStorage.getItem("token"); // Get the token from localStorage
                const response = await fetch(`/api/usermanaging/${editingUser.id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Add token to Authorization header
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(editingUser),
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                setEditingUser(null);
                fetchUsers();
            } catch (error) {
                console.error('Fetch error:', error);
            }
        }
    };

    const deleteUser = async (id: string) => {
        try {
            const token = localStorage.getItem("token"); // Get the token from localStorage
            const response = await fetch(`/api/usermanaging/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`, // Add token to Authorization header
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchUsers();
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    return (
        <div>
            <h2>User Management</h2>
            <div>
                <input
                    type="text"
                    placeholder="Username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
                <button onClick={createUser}>Create User</button>
            </div>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.username} ({user.email})
                        <button onClick={() => setEditingUser(user)}>Edit</button>
                        <button onClick={() => deleteUser(user.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            {editingUser && (
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        value={editingUser.username}
                        onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    />
                    <button onClick={updateUser}>Update User</button>
                </div>
            )}
        </div>
    );
};

export default UserManaging;