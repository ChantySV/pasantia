const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

exports.uploadPDF = upload.single("pdf");

exports.uploadFile = (req, res) => {
  res.send({ data: "Enviar un archivo" });
};