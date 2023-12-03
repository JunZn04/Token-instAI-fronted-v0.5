import React, { useState } from "react";
import axios from "axios"; 
import Prompt from "../../Components/Prompt/Prompt2";
import { NavLink, useLocation } from "react-router-dom";

function Requirement() {
  const [reqData, setReqData] = useState({
    req: "",
  });
  const [linktostep, setlinktostep] = useState(false);
  const [isDataChecked, setIsDataChecked] = useState(false); 
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const projectname = searchParams.get('projectname');

  const handleFormDataChange = (fieldName, value) => {
    setReqData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
    if(fieldName !== ""){
      setlinktostep(true);
    }
    console.log(`Field ${fieldName} updated to:`, value);
  };

  const handleGenerateClick = async () => {
    if(reqData.req.trim() === ""){
      alert("requirements不可為空!");
    }
    else{
      const confirmed = window.confirm(`確定要提交嗎?\n\n將要提交的資料：\n${JSON.stringify(reqData, null, 2)}`);
      if (confirmed) {
        setIsDataChecked(true);
      }
    } 
  };

  // 提交到後端
  const handleSendData = async () => {
    const requestData = {
      method: "POST",
      request: reqData, 
      response: {
        message: "傳輸成功",
      },
    };
    try {
      const response = await axios.post(
        `http://localhost:8080/api/upload/requirement/?username=${id}&projectname=${projectname}`, 
        requestData
      ); //彥君要確認API正確
      console.log("server response:", response.data);
      alert("requirement 新增成功!");
      handleFormDataChange("req", "");
      setlinktostep(false);
      setIsDataChecked(false); // 重製數據檢查
    } catch (error) {
      console.error("提交失敗:", error);
      if (error.response) {
        alert(`提交失敗，錯誤狀態碼：${error.response.status}`);
      } else {
        alert("提交失敗，請檢查網絡連接或稍後重試。");
      }
    }
  };

  return (
    <div>
      <h1>Requirment</h1>
      <div>
        <Prompt value={reqData.req} onChange={(value) => handleFormDataChange("req", value)} />
      </div>
      <div className="button-group">
        {/* ------------------------------------------------------------------------- */}
        {isDataChecked ? (
          <button onClick={handleSendData}>提交</button>
        ) : (
          <button onClick={handleGenerateClick}>生成並检查</button>
        )}
        
        <br/>
        <NavLink to={`/Step?id=${id}&project=${projectname}`}><button>返回前頁</button></NavLink>
      </div>
    </div>
  );
}

export default Requirement;
