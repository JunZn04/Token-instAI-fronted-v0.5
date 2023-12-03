import React, { useState } from 'react';
import loginstyle from "./Download.module.css";
import axios from 'axios';
import { NavLink, useLocation } from 'react-router-dom';
import "./Download.module.css";

function Download2() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const projectname = searchParams.get('projectname');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [confirmSubmission, setConfirmSubmission] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [editingMode, setEditingMode] = useState(false);

  // Handle file selection
  const handleFileSelect = async (event) => {
    const files = event.target.files;
    const fileArray = Array.from(files);

    // Filter files
    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpeg'];
    const filteredFiles = fileArray.filter((file) =>
      allowedFileTypes.includes(file.type)
    );

    const fileNames = filteredFiles.map((file) => file.name);

    setSelectedFiles(filteredFiles);

    try {
      const previews = filteredFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews([...previews]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Handle deleting images
  const handleDeleteImage = (index) => {
    if (!confirmSubmission) {
      const updatedFiles = [...selectedFiles];
      const updatedPreviews = [...imagePreviews];
  
      updatedFiles.splice(index, 1);
      updatedPreviews.splice(index, 1);
  
      setSelectedFiles(updatedFiles);
      setImagePreviews(updatedPreviews);
    }
  };

  // Handle downloading files
  const handleDownload = (file) => {
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(new Blob([file]));
    a.setAttribute("download", file.name);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Confirm submission
  const handleConfirmSubmission = () => {
    setConfirmSubmission(true);
    setShowModal(true);
  };

  // Cancel submission
  const handleCancelSubmission = () => {
    setConfirmSubmission(false);
    setShowModal(false);
    setEditingMode(true); // Enter editing mode
  };

  // Back to edit
  const handleBackToEdit = () => {
    setConfirmSubmission(false);
    setShowModal(false);
    setEditingMode(true); // Enter editing mode
  };

  // Handle upload logic
  const handleupload = async () => {
    const confirmDelete = window.confirm("Are you sure you want to upload the image?");
    if (!confirmDelete) {
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; ++i) {
      formData.append('file', selectedFiles[i]);
    }

    try {
      const response = await axios.post(`http://localhost:8080/api/upload/upload?username=${id}&projectname=${projectname}`, formData);
      console.log(response.data);
      alert('Upload successful');
    } catch (error) {
      console.error("Transmission error:", error);
    }
  };

  return (
    <div className={loginstyle.background}>
      <h1>Upload/Download</h1>
      <input type="file" accept="image/*" multiple name="images" onChange={handleFileSelect} />
      <div className="previews">
        {imagePreviews.map((preview, index) => (
          <span key={index} className="preview">
            <img
              src={preview}
              alt={`image ${index}`}
              style={{ width: '250px', height: '300px' }}
              loading='lazy'
              onClick={() => {
                setShowModal(true);
                setSelectedImageIndex(index);
              }}
            />
            <button onClick={() => handleDeleteImage(index)}>Delete</button>
            <button onClick={() => handleDownload(selectedFiles[index])}>Download</button>
          </span>
        ))}
      </div>
      <button onClick={handleConfirmSubmission}>Confirm Submission</button>
      {confirmSubmission && (
        <div>
          <h2>Confirm Submission</h2>
          <div>
            {selectedFiles.map((file, index) => (
              <span key={index}>
                {file.name}
                <img
                  src={URL.createObjectURL(file)}
                  alt={`preview ${index}`}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setShowModal(true);
                    setSelectedImageIndex(index);
                  }}
                />
                <br />
              </span>
            ))}
          </div>
          <NavLink to={`/Step?id=${id}&project=${projectname}`}>
            <button onClick={handleupload}>Finish</button>
          </NavLink>
          <button onClick={handleBackToEdit}>Back to Edit</button>
        </div>
      )}

      {showModal && (
        <div className="modal">
          <span className="close" onClick={() => setShowModal(false)}>&times;</span>
          <img
            src={URL.createObjectURL(selectedFiles[selectedImageIndex])}
            alt={`preview ${selectedImageIndex}`}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      )}
    </div>
  );
}

export default Download2;
