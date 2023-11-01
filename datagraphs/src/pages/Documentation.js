import React, { useState } from 'react';
import { saveAs } from 'file-saver';

function Documentation() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    // Perform upload logic using selectedFile
    console.log('Uploading file:', selectedFile);
  };

  const handleDownload = () => {
    // Replace 'your_file_url' with the actual URL of the file
    const fileUrl = 'your_file_url';

    // Download the file
    saveAs(fileUrl, 'downloaded_file');
  };
  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <button onClick={handleDownload}>Download</button>
      
    </div>
  )
}

export default Documentation
