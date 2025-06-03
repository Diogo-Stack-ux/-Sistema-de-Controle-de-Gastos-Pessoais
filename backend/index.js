const express = require('express');
const cors = require('cors');
const despesasRoutes = require('./routes/despesas');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/despesas', despesasRoutes);

app.get('/', (req, res) => {
    res.send('API Controle de Gastos funcionando! 🚀');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
