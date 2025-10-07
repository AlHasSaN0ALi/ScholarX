import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, updateUserStatus, deleteUser } from '../../../store/slices/adminSlice';
import './Users.css';

const Users = () => {
    const dispatch = useDispatch();
    const { users, loading, error } = useSelector((state) => state.admin);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch users when debounced search term changes
    useEffect(() => {
        dispatch(fetchAllUsers({ page: currentPage, search: debouncedSearchTerm }));
    }, [dispatch, currentPage, debouncedSearchTerm]);

    const handleStatusChange = async (userId, newStatus) => {
        try {
            await dispatch(updateUserStatus({ userId, status: newStatus })).unwrap();
        } catch (error) {
            console.error('Failed to update user status:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await dispatch(deleteUser(userId)).unwrap();
            } catch (error) {
                console.error('Failed to delete user:', error);
            }
        }
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="admin-users">
            <h1>User Management</h1>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {loading && <span className="search-loading">Searching...</span>}
            </div>

            <div className="users-table">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            {/* <th>Status</th> */}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.users?.map(user => (
                            <tr key={user._id}>
                                <td data-label="Name">{user.firstName} {user.lastName}</td>
                                <td data-label="Email">{user.email}</td>
                                <td data-label="Role">{user.role}</td>
                                {/* <td>
                                    <select
                                        value={user.status}
                                        onChange={(e) => handleStatusChange(user._id, e.target.value)}
                                    >
                                        <option value="active">Active</option>
                                        <option value="suspended">Suspended</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </td> */}
                                <td>
                                     
                                    <button
                                        className="edit-btn"
                                        onClick={() => handleEditUser(user)}
                                    >
                                        Edit
                                    </button>
                                    {/* <button
                                        className="delete-btn"
                                        onClick={() => handleDeleteUser(user._id)}
                                    >
                                        Delete
                                    </button> */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button
                    disabled={!users.pagination.hasPreviousPage}
                    onClick={() => setCurrentPage(p => p - 1)}
                >
                    Previous
                </button>
                <span>Page {currentPage} of {users.pagination.totalPages}</span>
                <button
                    disabled={!users.pagination.hasNextPage}
                    onClick={() => setCurrentPage(p => p + 1)}
                >
                    Next
                </button>
            </div>

            {showEditModal && selectedUser && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit User</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            // Handle form submission
                            setShowEditModal(false);
                        }}>
                            {/* <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    value={selectedUser.firstName}
                                    onChange={(e) => setSelectedUser({
                                        ...selectedUser,
                                        firstName: e.target.value
                                    })}
                                />
                            </div> */}
                            {/* <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    value={selectedUser.lastName}
                                    onChange={(e) => setSelectedUser({
                                        ...selectedUser,
                                        lastName: e.target.value
                                    })}
                                />
                            </div> */}
                            {/* <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={selectedUser.email}
                                    onChange={(e) => setSelectedUser({
                                        ...selectedUser,
                                        email: e.target.value
                                    })}
                                />
                            </div> */}
                            <div className="form-group">
                                <label>Role</label>
                                <select
                                    value={selectedUser.role}
                                    onChange={(e) => setSelectedUser({
                                        ...selectedUser,
                                        role: e.target.value
                                    })}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="save-btn">Save Changes</button>
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users; 