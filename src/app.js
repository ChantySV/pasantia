const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

app.use(require("./routes/usuarios.routes"));
app.use(require("./routes/login.routes"));
app.use(require("./routes/facultades.routes"));
app.use(require("./routes/carreras.routes"));
app.use(require("./routes/tipos.routes"));
app.use(require("./routes/documentos.routes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor levantado en el puerto ${PORT}`);
});