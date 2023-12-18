const express = require('express')
const app = express()

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile('./src/index.html')
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});