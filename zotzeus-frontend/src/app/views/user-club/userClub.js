import React, { useState, useEffect } from "react";
import "./userClub.scss";

import axios from "axios"

import { UserCard } from "app/components";
import { InfoCard } from "app/components";
import { CreateInfoModal } from "app/components";
import { CreateUserModal } from "app/components";
import{ useParams } from 'react-router-dom';

function UserClub() {

  // List of users from the database
  const [info, setInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  let { selectedClubName } = useParams();
  
  // Get the list of users from the database upon page load
  useEffect(() => {
    getInfoList();
  }, []);

  // Get the list of users through a GET request to the backend API
  async function getInfoList() {
    let info = await axios.get("https://zotclubs.herokuapp.com/club-info");
    
    
    // If we get a valid response, set the state object, or print an error.
    if (info.status === 200) {
      console.log(info);

      for (let i = 0; i < info.data.data.length; i++) {
        

        if(info.data.data[i]["clubName"] != selectedClubName) {
              delete info.data.data[i];
          }
      }

      setInfo(info.data.data);


    } else {
      console.log("Error retrieving info");
    }
  }

   // This function will be passed into the CreateUserModal child component
  // This will allow CreateUserModal to manipulate the state of the mainPage to hide itself and refresh the user list
  function refreshPage() {
    setShowModal(false);
    getInfoList();
  }

  function goBack() {
      window.history.back()
  }

  return (
    <div>
      
      <div className="user-list">
        <p><font size="1100" color="white">{selectedClubName}</font></p>
      </div>
      
      <div className={showModal ? "blur" : ""}>
        <div className="user-list">
          {(info || []).map(function (info, index) {
            return <InfoCard info={info} key={index} number={index + 1} />;
          })}
        </div>

        <button className="button" onClick={() => setShowModal(true)}>Create New Club Info</button>
        <button className="button" onClick={() => goBack()}>Back</button>
      </div>

      {/* This ternary operator returns the CreateUserModal if showModal = true, else returns null => nothing will be rendered */}

      { showModal ?
        <CreateInfoModal
          clubName = {selectedClubName}
          onCancel={() => setShowModal(false)}
          onCreate={refreshPage}
        />
        : null
      }

    </div>
  );
}

export default UserClub;
