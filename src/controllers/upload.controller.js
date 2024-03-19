const multer = require("multer");
const path = require("path")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, ".." , "..","uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now());
  },
});

const upload = multer({ storage: storage });

exports.uploadPDF = upload.single("pdf");

exports.uploadFile = (req, res) => {
  res.send({ data: "Enviar un archivo" });
};