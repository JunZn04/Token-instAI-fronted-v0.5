import React, { useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import axios from "axios";

function CheckReq() {
  const history = useHistory();
  const location = useLocation();
  const { id, projectname, reqData } = location.state;

  const [modifiedReqData, setModifiedReqData] = useState(reqData);

  const handleModifyClick = () => {
    // Add logic to modify data if needed
  };

  const handleSendToBackend = async () => {
    // Add logic to send modified data to backend
    try {
      const response = await axios.post(
        `http://localhost:8080/api/upload/modified-requirement/?username=${id}&projectname=${projectname}`,
        { modifiedReqData }
      );

      console.log("Server response:", response.data);
      alert("Modified requirement sent successfully!");
    } catch (error) {
      console.error("Failed to send modified requirement:", error);
      // Handle error
    }
  };

  return (
    <div>
      <h1>Check Requirement</h1>
      <p>ID: {id}</p>
      <p>Project: {projectname}</p>
      <p>Requirement: {reqData.req}</p>

      {/* Add UI for modifying data */}
      <button onClick={handleModifyClick}>Modify Data</button>

      {/* Add UI for sending modified data to backend */}
      <button onClick={handleSendToBackend}>Send to Backend</button>

      {/* Add other content related to checking requirements */}
    </div>
  );
}

export default CheckReq;
