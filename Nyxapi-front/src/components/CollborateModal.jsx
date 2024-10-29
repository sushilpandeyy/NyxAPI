import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CollborateModal = ({ toggleModal }) => {
    const { Projectid } = useParams(); // Retrieve 'Projectid' from the URL
    const [email, setEmail] = useState('');
    const [emails, setEmails] = useState([]);
    const [suggestions, setSuggestions] = useState([]); // State to hold email suggestions
    const [error, setError] = useState('');

    // Function to handle adding email
    const handleAddEmail = async (e) => {
        e.preventDefault();
        if (email) {
            try {
                const response = await axios.post('http://api.nyxapi.com/share/', {
                    projectid: Projectid, // Use Projectid from useParams
                    email,
                });

                if (response.status === 200) {
                    // Add the email to the list
                    setEmails((prev) => [...prev, email]);
                    setEmail(''); // Clear input field
                    setSuggestions([]); // Clear suggestions
                    toggleModal(); // Close the modal
                } else {
                    setError('Failed to add email.');
                }
            } catch (error) {
                console.error('Error adding email:', error);
                setError('Failed to add email.');
            }
        }
    };

    const handleRemoveEmail = async (emailToRemove) => {
        const confirmRemove = window.confirm(`Are you sure you want to remove ${emailToRemove}?`);
        
        if (confirmRemove) {
          try {
            const response = await axios.delete(`http://api.nyxapi.com/share/remove`, {
              params: {
                projectid: projectIdInt,
                user_email: emailToRemove,
              },
            });
    
            if (response.status === 200) {
              // Remove the email from the local state
              setEmails((prev) => prev.filter((email) => email !== emailToRemove));
              // Optionally show success message
              toggleModal(); // Close the modal on success
            } else {
              setError('Failed to remove email.');
            }
          } catch (error) {
            console.error('Error removing email:', error);
            setError('Failed to remove email.');
          }
        }
      };
      
    // Function to fetch email suggestions
    const fetchEmailSuggestions = async (initials) => {
        try {
            const response = await axios.get(`http://api.nyxapi.com/share/userslist/${initials}`);
            setSuggestions(response.data.users);
        } catch (error) {
            console.error('Error fetching email suggestions:', error);
            setSuggestions([]); // Clear suggestions on error
        }
    };

    // Handle input change for email
    const handleEmailChange = (e) => {
        const input = e.target.value;
        setEmail(input);

        if (input.length >= 2) { // Trigger fetch for suggestions if input has at least 2 characters
            fetchEmailSuggestions(input);
        } else {
            setSuggestions([]); // Clear suggestions if input is less than 2 characters
        }
    };

    // Function to handle suggestion click
    const handleSuggestionClick = (suggestedEmail) => {
        setEmail(suggestedEmail);
        setSuggestions([]); // Hide suggestions after selection
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 p-6 rounded-lg w-1/3">
                <h3 className="text-xl font-semibold text-white mb-4">Add Collaborator</h3>
                <form onSubmit={handleAddEmail}>
                    <div className="mb-4 relative">
                        <label className="block text-gray-400">Email ID</label>
                        <input
                            type="email"
                            value={email}
                            placeholder='Enter Name for Recommendations'
                            onChange={handleEmailChange} // Update on input change
                            className="w-full px-3 py-2 mt-1 bg-gray-700 text-white rounded focus:outline-none"
                            required
                        />
                        {suggestions.length > 0 && (
                            <ul className="absolute bg-gray-700 rounded w-full mt-1 max-h-48 overflow-y-auto z-10">
                                {suggestions.map((suggestedEmail) => (
                                    <li
                                        key={suggestedEmail}
                                        className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer"
                                        onClick={() => handleSuggestionClick(suggestedEmail)}
                                    >
                                        {suggestedEmail}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {error && <p className="text-red-500">{error}</p>} {/* Display error message */}

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={toggleModal}
                            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
                        >
                            Add
                        </button>
                    </div>
                </form>

                {/* Display list of shared emails */}
                <div className="mt-4">
                    <h4 className="text-lg font-semibold text-white mb-2">Shared Emails:</h4>
                    <ul className="list-disc list-inside">
                        {emails.map((emailItem) => (
                            <li key={emailItem} className="flex justify-between items-center text-gray-300">
                                {emailItem}
                                <button
                                    onClick={() => handleRemoveEmail(emailItem)}
                                    className="ml-2 text-red-500 hover:text-red-700"
                                >
                                    ✖️
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CollborateModal;




