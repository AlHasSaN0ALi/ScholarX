import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubscriptions, updateSubscription } from '../../../store/slices/adminSlice';
import './Subscriptions.css';

const Subscriptions = () => {
    const dispatch = useDispatch();
    const { subscriptions, loading, error } = useSelector((state) => state.admin);
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        dispatch(fetchSubscriptions());
    }, [dispatch]);

    const handleStatusChange = async (subscriptionId, newStatus) => {
        try {
            await dispatch(updateSubscription({
                subscriptionId,
                subscriptionData: { status: newStatus }
            })).unwrap();
        } catch (error) {
            console.error('Failed to update subscription status:', error);
        }
    };

    const handleEditSubscription = (subscription) => {
        setSelectedSubscription(subscription);
        setShowEditModal(true);
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="admin-subscriptions">
            <h1>Subscription Management</h1>

            <div className="subscriptions-table">
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Course</th>
                            <th>Start Date</th>
                            {/* <th>End Date</th> */}
                            <th>Amount</th>
                            {/* <th>Status</th> */}
                            {/* <th>Actions</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {subscriptions.map(subscription => (
                            <tr key={subscription._id}>
                                <td>{subscription.user.firstName} {subscription.user.lastName}</td>
                                <td>{subscription.course.title}</td>
                                <td>{new Date(subscription.startDate).toLocaleDateString()}</td>
                                {/* <td>{new Date(subscription.endDate).toLocaleDateString()}</td> */}
                                <td>${subscription.amount}</td>
                                {/* <td>
                                    <select
                                        value={subscription.status}
                                        onChange={(e) => handleStatusChange(subscription._id, e.target.value)}
                                    >
                                        <option value="active">Active</option>
                                        <option value="expired">Expired</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td> */}
                                {/* <td>
                                    <button
                                        className="edit-btn"
                                        onClick={() => handleEditSubscription(subscription)}
                                    >
                                        Edit
                                    </button>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showEditModal && selectedSubscription && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit Subscription</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            dispatch(updateSubscription({
                                subscriptionId: selectedSubscription._id,
                                subscriptionData: selectedSubscription
                            }));
                            setShowEditModal(false);
                        }}>
                            <div className="form-group">
                                <label>Start Date</label>
                                <input
                                    type="date"
                                    value={new Date(selectedSubscription.startDate).toISOString().split('T')[0]}
                                    onChange={(e) => setSelectedSubscription({
                                        ...selectedSubscription,
                                        startDate: new Date(e.target.value)
                                    })}
                                />
                            </div>
                            <div className="form-group">
                                <label>End Date</label>
                                <input
                                    type="date"
                                    value={new Date(selectedSubscription.endDate).toISOString().split('T')[0]}
                                    onChange={(e) => setSelectedSubscription({
                                        ...selectedSubscription,
                                        endDate: new Date(e.target.value)
                                    })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Amount</label>
                                <input
                                    type="number"
                                    value={selectedSubscription.amount}
                                    onChange={(e) => setSelectedSubscription({
                                        ...selectedSubscription,
                                        amount: e.target.value
                                    })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select
                                    value={selectedSubscription.status}
                                    onChange={(e) => setSelectedSubscription({
                                        ...selectedSubscription,
                                        status: e.target.value
                                    })}
                                >
                                    <option value="active">Active</option>
                                    <option value="expired">Expired</option>
                                    <option value="cancelled">Cancelled</option>
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

export default Subscriptions; 