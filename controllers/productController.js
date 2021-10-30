const productService = require('../services/productService');

async function addProduct(req, res) {
  const { name, quantity } = req.body;
  const result = await productService.addProduct({ name, quantity });
  if (result.err) return res.status(422).json(result);
  res.status(201).json(result);
}

module.exports = { addProduct };
