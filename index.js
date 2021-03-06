// external imports
const express = require('express');
const bodyParser = require('body-parser');

// internal imports
const productController = require('./controllers/productController');
const salesController = require('./controllers/salesController');

const app = express();

app.use(bodyParser.json());

// não remova esse endpoint, e para o avaliador funcionar
app.post('/products', productController.addProduct);
app.listen(3000, () => console.log('Servidor iniciado na porta 3000'));
app.get('/products', productController.getAllProducts);
app.get('/products/:id', productController.getProductById);
app.put('/products/:id', productController.updateProduct);
app.delete('/products/:id', productController.removeProduct);
app.post('/sales', salesController.addSales);
app.get('/sales', salesController.getAllSales);
app.get('/sales/:id', salesController.getSaleById);
app.put('/sales/:id', salesController.updateSale);
app.delete('/sales/:id', salesController.deleteSale);
