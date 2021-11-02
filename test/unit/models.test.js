const Sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server-core');
const mongoConnection = require('../../models/connection');
const productModel = require('../../models/productModel');
const salesModel = require('../../models/salesModel');
const { expect } = require('chai');

describe('Testando model de PRODUTOS', () => {
  let connectionMock;

  before(async () => {
    const DBServer = new MongoMemoryServer();
    const URLMock = await DBServer.getUri();
    const OPTIONS = { useNewUrlParser: true, useUnifiedTopology: true}
    connectionMock = await MongoClient.connect(URLMock, OPTIONS)
    .then((conn) => conn.db('model_example'));
    Sinon.stub(mongoConnection, 'getConnection').resolves(connectionMock);
  });

  after( async () => {
    mongoConnection.getConnection.restore();
  })

  describe('Ao adicionar um novo produto', () => {
    it('Deve retornar um objeto', async() => {
      const newProduct = await productModel.addProduct('Mouse sem fio', 25);
      expect(newProduct).to.be.an('object')
    });

    it('Deve conter as propriedas _id, name, quantity', async () => {
      const newProduct = await productModel.addProduct('Mouse sem fio', 25);
      expect(newProduct).to.include.all.keys('_id', 'name', 'quantity');
    })
  })

  describe('Ao buscar um produto pelo Id', async () => {
    let id;
    before(async () => {
      const newProduct = await productModel.addProduct('Mouse sem fio', 25);
      id = newProduct._id;
    });

    it('Quando encontra deve retornar um objeto', async() => {
      const product = await productModel.getProductById(id);
      expect(product).to.be.an('object');
    });

    it('Caso encontre, o objeto retornado deve conter os atributos _id, name, quantity', async () => {
      const product = await productModel.getProductById(id);
      expect(product).to.include.all.keys('_id', 'name', 'quantity');
    });

    it('Caso passe um Id inválido ou não encontre deve retornar um null', async () => {
      const product = await productModel.getProductById('invalid id');
      expect(product).to.be.null;
    })
  })

  describe('Ao procurar um produto pelo nome', () => {
    it('Deve retornar um objeto', async () => {
      const product = await productModel.getProductByName('Mouse sem fio', 25);
      expect(product).to.be.an('object')
    });

    it('O objeto retornado deve conter os atributos _id, name, quantity', async () => {
      const product = await productModel.getProductByName('Mouse sem fio');
      expect(product).to.include.all.keys('_id', 'name', 'quantity');
    });
  })

  describe('Ao buscar a lista de todos os produtos', () => {

    it('Os produtos encontrados deverão estar contidos em um array', async() => {
      const productsList = await productModel.getAllProducts();
      expect(productsList).to.be.an('array');
    })

    it('Caso não encontre nenhum produto deve retornar um array vazio', async () => {
      await connectionMock.collection('products').drop();
      const productsList = await productModel.getAllProducts();
      expect(productsList).to.be.empty;
    })
  });

  describe('Ao tentar atualizar um produto', () => {
    let id;
    before(async () => {
      const newProduct = await connectionMock.collection('products').insertOne({name: 'notebook', quantity: 15});
      id = newProduct.insertedId;
    })
    it('Ao passar um id invalido deverá retornar um null', async () => {
      const updatedProduct = await productModel.updateProduct('123', 'mouse sem fio', 25);
      expect(updatedProduct).to.be.null;
    });

    it('Ao atualizar o produto, deve retornar um objeto com as novas informações', async () => {
      const product = await productModel.updateProduct(id, 'monitor', 50);
      expect(product).to.eql({_id: id, name: 'monitor', quantity: 50 })
    })
  })

  describe('Ao remove um produto da lista', () => {
    let id;
    before(async () => {
      await connectionMock.collection('products').drop();
      const newProduct = await connectionMock.collection('products').insertOne({name: 'monitor', quantity: 50});
      id = newProduct.insertedId;
    })
    it('devera retornar um null, caso o id passado sej ainválido', async () => {
      const removedProduct = await productModel.removeProduct('123');
      expect(removedProduct).to.be.null;
    });

    it('A nova lista de produtos não deverá conter o item removido', async () => {
      await productModel.removeProduct(id);
      const productsList = productModel.getAllProducts();
      expect(productsList).to.be.empty;
    })
  })
})

describe('Testa model de VENDAS', () => {
  let connectionMock;
  const productExample = { name: 'monitor', quantity: 50 };

  before(async () => {
    const DBServer = new MongoMemoryServer();
    const URLMock = await DBServer.getUri();
    const OPTIONS = { useNewUrlParser: true, useUnifiedTopology: true };
    connectionMock = await MongoClient.connect(URLMock, OPTIONS)
    .then((conn) => conn.db('mode_example'));
    Sinon.stub(mongoConnection, 'getConnection').resolves(connectionMock);
  })

  after(async () => {
    mongoConnection.getConnection.restore();
  })

  describe('Ao adicionar uma nova venda', () => {
    it('Deve retornar um objeto com as vendas listadas', async () => {
      const id = await connectionMock.collection('products').insertOne(productExample)._id;
      const sale = await salesModel.addSales([{ productId: id, quantity: 5}]);
      expect(sale).to.eql(
        {
          _id: sale._id,
          itensSold: [ { productId: id, quantity: 5 } ]
        }
      )
    })
  })

  describe('Ao selecionar uma venda pelo seu id', () => {

    before(async() => {
      await connectionMock.collection('products').drop();
      await connectionMock.collection('sales').drop();
    })
    it('Quando a venda não é encontrada deve retornar um null', async () => {
      const sale = await salesModel.getSaleById('123');
      expect(sale).to.be.null;
    })

    it('Quando a venda é encontrada deve retornar um objeto com os dados da venda', async () => {
      const { insertedId: productId } = await connectionMock.collection('products').insertOne(productExample);
      const { _id: saleId } = await salesModel.addSales([{ productId, quantity: 5}]);
      const selectedSale = await salesModel.getSaleById(saleId);
      expect(selectedSale).to.be.an('object');
      expect(selectedSale).to.include.all.keys('_id', 'itensSold')

    })
  })

  describe('Ao buscar todas as vendas', () => {
    before(async() => {
      await connectionMock.collection('products').drop();
      await connectionMock.collection('sales').drop();
    });

    it('Deve retornar um array com todas as vendas', async() => {
      const { insertedId: productId } = await connectionMock.collection('products').insertOne(productExample);
      const { _id: saleId } = await salesModel.addSales([{ productId, quantity: 5}]);
      const salesList = await salesModel.getAllSales();
      expect(salesList).to.eql({
        sales: [
          {
            _id: saleId,
            itensSold: [
              { productId, quantity: 5}
            ]
          }
        ]
      })
    })
  })

  describe('Ao atualizar uma venda', () => {
    before( async () => {
      await connectionMock.collection('products').drop();
      await connectionMock.collection('sales').drop();
    });

    it('Ao passar um Id inválido deve retornar um null', async () => {
      const saleUpdated = await salesModel.updateSale('123');
      expect(saleUpdated).to.be.null;
    });

    it('Ao passar um Id válido deve retornar um objeto com os novos dados da venda', async () => {
      const { insertedId: productId } = await connectionMock.collection('products').insertOne(productExample);
      const { _id: saleId } = await salesModel.addSales([{ productId, quantity: 5}]);
      const updatedSale = await salesModel.updateSale(saleId, [{ name: 'teclado', quantity: 100}]);
      expect(updatedSale.itensSold[0].quantity).to.be.eql(100);
    });
  })

  describe('Ao deletar uma venda', () => {
    before( async () => {
      await connectionMock.collection('products').drop();
      await connectionMock.collection('sales').drop();
    });

    it('A lista de venda não deve conter a venda removida', async () => {
      const { insertedId: productId } = await connectionMock.collection('products').insertOne(productExample);
      const { _id: saleId } = await salesModel.addSales([{ productId, quantity: 5}]);
      const deletedSale = await salesModel.deleteSale(saleId);
      expect(deletedSale).to.be.an('object');
      const allSales = await salesModel.getAllSales();
      expect(allSales.sales).to.be.empty;
    })
  })
})
