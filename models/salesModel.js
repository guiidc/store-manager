const { ObjectId } = require('mongodb');
const { getConnection } = require('./connection');

async function addSales(sales) {
  const insertedSales = await getConnection()
  .then((db) => db.collection('sales').insertOne({ itensSold: sales }));
  return { _id: insertedSales.insertedId, itensSold: sales };
}

async function getAllSales() {
  const allSales = await getConnection()
  .then((db) => db.collection('sales').find().toArray());
  return { sales: allSales };
}

async function getSaleById(id) {
  if (!ObjectId.isValid(id)) return null;
  await getConnection()
  .then((db) => db.collection('sales').findOne({ _id: ObjectId(id) }));
}

module.exports = {
  addSales,
  getAllSales,
  getSaleById,
};
