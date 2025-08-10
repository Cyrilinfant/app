import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import path from "path";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://cyrilinfant1:Cyril123@cluster0.mzrroki.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => console.error(" MongoDB connection error:", err));

const fileSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String,
});
const FileModel = mongoose.model("File", fileSchema);

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    let file;

    if (req.file) {
    
      const fileData = fs.readFileSync(req.file.path);
      file = new FileModel({
        name: req.file.originalname,
        data: fileData,
        contentType: req.file.mimetype,
      });
      fs.unlinkSync(req.file.path); 
    } else if (req.body.text) {
      
      file = new FileModel({
        name: "text_" + Date.now() + ".txt",
        data: Buffer.from(req.body.text, "utf-8"),
        contentType: "text/plain",
      });
    } else {
      return res.status(400).json({ message: "No file or text provided" });
    }

    await file.save();
    res.json({ message: "Uploaded successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error uploading data" });
  }
});

app.get("/files", async (req, res) => {
  try {
    const files = await FileModel.find({}, "name");
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: "Error fetching files" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
