const pool = require('../db/db');

const getDespesas = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM despesas ORDER BY data DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addDespesa = async (req, res) => {
    const { data, categoria, valor, descricao } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO despesas (data, categoria, valor, descricao) VALUES ($1, $2, $3, $4) RETURNING *',
            [data, categoria, valor, descricao]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteDespesa = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM despesas WHERE id = $1', [id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateDespesa = async (req, res) => {
    const { id } = req.params;
    const { data, categoria, valor, descricao } = req.body;

    try {
        const result = await pool.query(
            'UPDATE despesas SET data = $1, categoria = $2, valor = $3, descricao = $4 WHERE id = $5 RETURNING *',
            [data, categoria, valor, descricao, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Despesa não encontrada' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getDespesas,
    addDespesa,
    deleteDespesa,
    updateDespesa 
};
