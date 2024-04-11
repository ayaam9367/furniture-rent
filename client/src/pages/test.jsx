import React, { useState } from "react";

const MyComponent = () => {
  // State variables to store data
  const [data, setData] = useState("");

  // Function to handle button click
  const sendDataToAPI = () => {
    // Prepare the data to send
    const requestData = {
      // Add your data properties here
      key1: "value1",
      key2: "value2",
    };

    // Make a POST request to your API endpoint
    fetch("https://example.com/api/endpoint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        // Handle response
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Handle successful response
        console.log("Data sent successfully:", data);
        // Optionally, you can update state or show a success message here
      })
      .catch((error) => {
        // Handle errors
        console.error("There was a problem sending the data:", error);
        // Optionally, you can update state or show an error message here
      });
  };

  return (
    <div>
      <button onClick={sendDataToAPI}>Send Data</button>
    </div>
  );
};

export default MyComponent;
