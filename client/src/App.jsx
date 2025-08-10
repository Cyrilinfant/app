import React, { useState } from "react";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleTextChange = (e) => setText(e.target.value);
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!text && !file) {
      setMessage("Please enter text or select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("text", text);
    if (file) formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message);
      setText("");
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage("Error uploading data");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Upload to MongoDB</h1>
      <textarea
        placeholder="Type something..."
        value={text}
        onChange={handleTextChange}
        style={styles.textarea}
      />
      <input
        type="file"
        onChange={handleFileChange}
        style={styles.fileInput}
      />
      <button onClick={handleUpload} style={styles.button}>Upload</button>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: "400px",
    margin: "50px auto",
    textAlign: "center",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset"
   
  },
  heading: {
    marginBottom: "20px"
  },
  textarea: {
    width: "100%",
    height: "100px",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px"
  },
  fileInput: {
    display: "block",
    margin: "10px auto"
  },
  button: {
     height:"50px",
  width:"100px",
  border:"none",
  borderRadius:"50px",
  transition:"0.3s",
  backgroundColor:"rgba(156, 161, 160,0.3)",
    
  },
  message: {
    marginTop: "15px",
    color: "#333"
  }
};

export default App;
