import React, { useState, useEffect } from "react";
import axios from "axios";

const UserList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user")) || {}; // Get logged-in user

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_USER_SERVICE_URL}/api/users`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h3>Select a User to Chat</h3>
      <ul>
        {users
          .filter(user => user.id !== currentUser.UserId) // Exclude the logged-in user
          .map(user => (
            <li key={user.id}>
              <button onClick={() => onSelectUser(user.id)}>
                {user.fullName} ({user.id})
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default UserList;