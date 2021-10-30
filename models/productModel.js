const { ObjectId } = require('mongodb');
const { getConnection } = require('./connection');

async function addProduct(name, quantity) {
  const product = await getConnection()
  .then((db) => db.collection('products').insertOne({ name, quantity }));
  return { _id: product.insertedId, name, quantity };
}

async function getProductById(id) {
  if (!ObjectId.isValid(id)) return null;
  const product = await getConnection()
  .then((db) => db.collection('products').findOne({ _id: ObjectId(id) }));
  return product;
}

async function getProductByName(name) {
  const product = await getConnection().then((db) => db.collection('products').findOne({ name }));
  return product;
}

async function getAllProducts() {
  const products = await getConnection()
  .then((db) => db.collection('products').find().toArray());
  return products;
}

module.exports = { addProduct, getProductById, getProductByName, getAllProducts };