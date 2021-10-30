// external imports
const express = require('express');
const bodyParser = require('body-parser');

// internal imports
const productController = require('./controllers/productController');

const app = express();

app.use(bodyParser.json());

// não remova esse endpoint, e para o avaliador funcionar
app.post('/products', productController.addProduct);

app.listen(3000, () => console.log('Servidor iniciado na porta 3000'));

app.get('/products', productController.getAllProducts);

app.get('/products/:id', productController.getProductById);

app.put('/products/:id', productController.updateProduct);
