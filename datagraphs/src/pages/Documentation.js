import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Documentation() {
  const [file, setFile] = useState(null);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/upload', {
       
        
        method: 'POST',
        body: formData,
      });
      console.log(response)
      // Handle the response as needed
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

 
  return (
    <div>
       <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  )
}

export default Documentation
