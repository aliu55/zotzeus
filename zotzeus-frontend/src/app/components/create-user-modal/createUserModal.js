import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./createUserModal.scss"

// stocks is object with the keys: companyName, symbol, id
function CreateUserModal({ onCreate, onCancel }) {
    const [clubName, setClubName] = useState("");
    const [meetingTime, setMeetingTime] = useState("");
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    // const [selectedStockId, setSelectedStockId] = useState(stocks[0]._id);

    async function handleSubmit(event) {
        event.preventDefault(); // stops the default action belonging to the event from occuring
        // in this case, it stops the submit button from submitting the form

        const newUser = {
            clubName: clubName,
            email: email,
            meetingTime: meetingTime,
            // FIXED favoriteStockId: selectedStockId
        }

        // Create new user by sending a POST request to the backend 
        const createdUser = await axios.post("https://zotclubs.herokuapp.com/club", newUser);

        if (createdUser.status === 200 && createdUser.data) {// User successfully created - go back to main page
            setErrorMessage("");
            onCreate();// hides modal and refreshes user list (passed in from the parent component (mainPage) so we can alter its state)
        }
        else {
            setErrorMessage("Failed to create user");
        }
    }

    // stocks is object with the keys: companyName, symbol, id
    /*
        {
            _id: 123,
            companyName : Apple, 
            symbol: AAPL, 
        }
    */

    // Returns an array of <option> created using information from passed in stocks property
    // This will be used to create the dropdown in the modal
    // function renderStockOptions() {
    //     const options = stocks.map(function (stock) {
    //         return <option key={stock._id} value={stock._id}>{stock.companyName + "(" + stock.symbol + ")"}</option>
    //     });
    //     return options;
    // }

    return (
        <motion.div
            animate={{
                opacity: [0, 1],
            }}
            transition={{
                duration: 0.5,
            }}
            className="selected-stock flex-center"
        >
            <form className="myForm" onSubmit={handleSubmit}>
                <label>Club Name</label>
                <input type="text" onChange={(event) => setClubName(event.target.value)} required />
                
                <label>Email</label>
                <input type="email" onChange={(event) => setEmail(event.target.value)} />

                <label>Meeting Time</label>
                <input type="text" onChange={(event) => setMeetingTime(event.target.value)} required />
                
                <input className="button" type="submit" value="Create Club" />
                <button className="button" type="button" onClick={onCancel}>Cancel</button>
                <p id="error-message">{errorMessage}</p>
            </form>
        </motion.div >

    );
}

export default CreateUserModal;