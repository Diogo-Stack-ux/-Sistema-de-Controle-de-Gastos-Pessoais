const express = require('express');
const router = express.Router();
const despesasController = require('../controllers/despesasController');

router.put('/:id', despesasController.updateDespesa);
router.get('/', despesasController.getDespesas);
router.post('/', despesasController.addDespesa);
router.delete('/:id', despesasController.deleteDespesa);

module.exports = router;
