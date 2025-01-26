import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CollaborateModal = ({ onClose, projectId }) => {
    const [email, setEmail] = useState('');
    const [emails, setEmails] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState('');
    const API_BASE = 'https://afmtaryv91.execute-api.ap-south-1.amazonaws.com/share';

    useEffect(() => {
        fetchSharedEmails();
    }, [projectId]);

    const fetchSharedEmails = async () => {
        try {
            const response = await axios.get(`${API_BASE}/${parseInt(projectId)}`);
            if (response.data && Array.isArray(response.data)) {
                setEmails(response.data);
            }
        } catch (error) {
            setError('Failed to fetch shared emails');
        }
    };

    const handleAddEmail = async (e) => {
        e.preventDefault();
        if (!email) return;
     
        try {
            const response = await axios.post(API_BASE, {
                projectid: parseInt(projectId),
                email: email.trim()
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
     
            if (response.status === 200 && response.data.msg === "User added to Shared array") {
                await fetchSharedEmails();
                setEmail('');
                setSuggestions([]);
                setError('');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.detail?.msg || error.response?.data?.detail || 'Failed to add email';
            setError(typeof errorMessage === 'string' ? errorMessage : 'Failed to add email');
        }
     };

    const handleRemoveEmail = async (emailToRemove) => {
        if (!window.confirm(`Remove ${emailToRemove}?`)) return;

        try {
            const response = await axios.delete(`${API_BASE}/remove`, {
                params: {
                    projectid: parseInt(projectId),
                    user_email: emailToRemove
                }
            });

            if (response.status === 200) {
                await fetchSharedEmails();
            }
        } catch (error) {
            setError(error.response?.data?.detail || 'Failed to remove email');
        }
    };

    const handleEmailChange = async (e) => {
        const input = e.target.value;
        setEmail(input);

        if (input.length >= 2) {
            try {
                const response = await axios.get(`${API_BASE}/userslist/${input}`);
                if (response.data && response.data.users) {
                    setSuggestions(response.data.users);
                }
            } catch (error) {
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-96">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-white">Add Collaborator</h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleAddEmail} className="space-y-4">
                    <div className="relative">
                        <input
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Enter email"
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {suggestions.length > 0 && (
                            <ul className="absolute w-full mt-1 bg-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                {suggestions.map(email => (
                                    <li
                                        key={email}
                                        onClick={() => {
                                            setEmail(email);
                                            setSuggestions([]);
                                        }}
                                        className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer"
                                    >
                                        {email}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Add
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <h4 className="text-lg font-semibold text-white mb-2">Shared With</h4>
                    <ul className="space-y-2">
                        {emails.map(email => (
                            <li key={email} className="flex justify-between items-center text-gray-300 bg-gray-700 px-3 py-2 rounded">
                                {email}
                                <button
                                    onClick={() => handleRemoveEmail(email)}
                                    className="text-gray-400 hover:text-red-500"
                                >
                                    ✕
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CollaborateModal;