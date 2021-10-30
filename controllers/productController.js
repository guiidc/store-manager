const productService = require('../services/productService');

async function addProduct(req, res) {
  const { name, quantity } = req.body;
  const result = await productService.addProduct({ name, quantity });
  if (result.err) return res.status(422).json(result);
  res.status(201).json(result);
}

async function getAllProducts(req, res) {
  const allProducts = await productService.getAllProducts();
  res.status(200).json({ products: allProducts });
}

async function getProductById(req, res) {
  const { id } = req.params;
  const result = await productService.getProductById(id);
  if (result.err) return res.status(422).json(result);
  res.status(200).json(result);
}

async function updateProduct(req, res) {
  const { id } = req.params;
  const { name, quantity } = req.body;
  const updatedProduct = await productService.updateProduct(id, name, quantity);
  // console.log(updatedProduct)
  if (updatedProduct.err) return res.status(422).json(updatedProduct);
  res.status(200).json(updatedProduct);
}

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
};
