import React, { useState, useEffect } from "react";
import "./userList.scss";

import axios from "axios"

import { UserCard } from "app/components";
import { CreateUserModal } from "app/components";

function UserList() {

  // List of users from the database
  const [users, setUsers] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Get the list of users from the database upon page load
  useEffect(() => {
    getUserList();
  }, []);

  // Get the list of users through a GET request to the backend API
  async function getUserList() {
    let users = await axios.get("https://zotclubs.herokuapp.com/club");
    
    // If we get a valid response, set the state object, or print an error.
    if (users.status === 200) {
      console.log(users)
      setUsers(users.data.data);
    } else {
      console.log("Error retrieving users");
    }
  }

   // This function will be passed into the CreateUserModal child component
  // This will allow CreateUserModal to manipulate the state of the mainPage to hide itself and refresh the user list
  function refreshPage() {
    setShowModal(false);
    getUserList();
  }

  return (
    <div>
      <div className="user-list">
        <p><font size="1100" color="white">Zot Zeus</font></p>
      </div>
      
      <div className={showModal ? "blur" : ""}>
        <div className="user-list">
          {(users || []).map(function (user, index) {
            return <UserCard user={user} key={index} number={index + 1} />;
          })}
        </div>

        <button className="button" onClick={() => setShowModal(true)}>Create New Club</button>
      </div>

      {/* This ternary operator returns the CreateUserModal if showModal = true, else returns null => nothing will be rendered */}

      { showModal ?
        <CreateUserModal
          onCancel={() => setShowModal(false)}
          onCreate={refreshPage}
        />
        : null
      }

    </div>
  );
}

export default UserList;




