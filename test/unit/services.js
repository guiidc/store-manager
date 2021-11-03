const productService = require('../../services/productService');
const salesService = require('../../services/salesService');
const productModel = require('../../models/productModel');
const salesModel = require('../../models/salesModel');
const sinon = require('sinon');
const { expect } = require('chai');

const nameError = {
  err: {
    code: 'invalid_data',
    message: '"name" length must be at least 5 characters long',
  },
};
const alreadyExistError = {
  err: {
    code: 'invalid_data',
    message: 'Product already exists',
  },
};
const quantityLengthError = {
  err: {
    code: 'invalid_data',
    message: '"quantity" must be larger than or equal to 1',
  },
};
const quantityTypeError = {
  err: {
    code: 'invalid_data',
    message: '"quantity" must be a number',
  },
};
const wrongIdError = {
  err: {
    code: 'invalid_data',
    message: 'Wrong id format',
  },
};

const productListExample = {
  products: [{
      _id: '6181f3b7204f845080b65c9e',
      name: 'Mouse sem fio',
      quantity: 155,
    }]
};

describe('Testa services de PRODUTOS', () => {
  describe('11 - Ao aidiconar um produto', () => {
    it('Deve retornar um erro se o nome do produto não for uma string', async () => {
      const newProduct = await productService.addProduct({ name: 155, quantity: 155 });
      expect(newProduct).to.eql(nameError);
    });
    it('Deve retornar um erro se o nome do produto não conter no minimo 6 caracteres', async () => {
      const newProduct = await productService.addProduct({ name: 'nome', quantity: 155 });
      expect(newProduct).to.eql(nameError);
    });
    it('Deve retornar um erro se a quantidade não for do tipo number', async () => {
      const newProduct = await productService.addProduct({ name: 'mouse sem fio', quantity: '155' });
      expect(newProduct).to.eql(quantityTypeError);
    });
    it('Deve retornar um erro se a quantidade for menor ou igual a zero', async () => {
      const newProduct = await productService.addProduct({ name: 'mouse sem fio', quantity: 0 });
      expect(newProduct).to.eql(quantityLengthError);
    });
    it('Deve retornar um erro caso o já exista um produto com o mesmo nome', async() => {
      sinon.stub(productModel, 'getProductByName').resolves(true);
      const newProduct = await productService.addProduct({ name: 'mouse sem fio', quantity: 155 });
      expect(newProduct).to.eql(alreadyExistError);
      productModel.getProductByName.restore();
    })
    it('Consegue criar produto com sucesso quando atende todos os requisitos', async () => {
      sinon.stub(productService, 'addProduct').resolves({ _id: 123, name: 'mouse sem fio', quantity: 155 })
      const newProduct = await productService.addProduct({ name: 'mouse sem fio', quantity: 155 });
      expect(newProduct).to.include.all.keys('_id', 'name', 'quantity');
      productService.addProduct.restore();
    })
  });

  describe('12 - Quando buscamos a lista de produtos cadastrados', () => {

    before(async () => {
      sinon.stub(productModel, 'getAllProducts').resolves(productListExample)
    })
    it('Deve retornar um objeto com uma lista de produtos', async () => {
      const productList = await productService.getAllProducts();
      expect(productList).to.eql(productListExample)
    })
  });

  describe('13 - Ao buscar um produto pelo Id', () => {
    it('Quando passado um Id inválido deve retornar um null', async () => {
      sinon.stub(productModel, 'getProductById').resolves(null)
      const product = await productService.getProductById(123);
      expect(product).to.eql(wrongIdError);
      productModel.getProductById.restore();
    });
    
    it('Deve retornar o produto solicitado quando passado o id correto', async () => {
      sinon.stub(productModel, 'getProductById').resolves({ _id: '6181f3b7204f845080b65c9e', name: 'mouse sem fio', quantity: 155})
      const product = await productService.getProductById('6181f3b7204f845080b65c9e');
      expect(product).to.eql({ _id: '6181f3b7204f845080b65c9e', name: 'mouse sem fio', quantity: 155});
      productModel.getProductById.restore();
    })
  });

  describe('14 - Ao atualizar um produto', () => {
    const invalidQuantity = '155';
    const invalidName = '123';
    const validId = '6181f3b7204f845080b65c9e';
    const productName = 'mouse sem fio';
    const productQuantity = 155;
    it('Deve retornar um erro se o novo nome do produto não for uma string', async () => {
      const newProduct = await productService.updateProduct(validId, productQuantity, productQuantity);
      expect(newProduct).to.eql(nameError);
    });
    it('Deve retornar um erro se o nome do produto não conter no minimo 6 caracteres', async () => {
      const newProduct = await productService.updateProduct(validId, invalidName, productQuantity);
      expect(newProduct).to.eql(nameError);
    });
    it('Deve retornar um erro se a quantidade não for do tipo number', async () => {
      const newProduct = await productService.updateProduct(validId, productName, invalidQuantity);
      expect(newProduct).to.eql(quantityTypeError);
    });
    it('Deve retornar um erro se a quantidade for menor ou igual a zero', async () => {
      const newProduct = await productService.updateProduct(validId, productName, 0);
      expect(newProduct).to.eql(quantityLengthError);
    });
    it('Deve retornar o produto atualizado se todos os dados passados forem validos', async () => {
      sinon.stub(productModel, 'updateProduct').resolves({ _id: validId, name: productName, quantity: productQuantity })
      const newProduct = await productService.updateProduct(validId, productName, 155);
      expect(newProduct).to.include.all.keys('_id', 'name', 'quantity');
      productModel.updateProduct.restore();
    });
  });

  describe('15 - Ao remove um produto da lista', () => {
    it('Retorna null caso o ID passado seja inválido', async () => {
      sinon.stub(productModel, 'removeProduct').resolves(null);
      const removedProduct = await productService.removeProduct('155');
      expect(removedProduct).be.eql(wrongIdError);
      productModel.removeProduct.restore();
    });
    it('Deve retornar um objeto com o produto removid', async () => {
      const validId = '6181f3b7204f845080b65c9e';
      const productName = 'mouse sem fio';
      const productQuantity = 155;
  
      sinon.stub(productModel, 'removeProduct').resolves({ _id: validId, name: productName, quantity: productQuantity});
      const removedProduct = await productService.removeProduct(validId);
      expect(removedProduct).to.include.all.keys('_id', 'name', 'quantity');
      productModel.removeProduct.restore();

    })
  })
})

const saleQuantityError = {
  err: {
    code: 'invalid_data',
    message: 'Wrong product ID or invalid quantity',
  },
};
const saleIdError = {
  err: {
    code: 'invalid_data',
    message: 'Wrong sale ID format',
  },
};
const stockError = {
  err: {
    code: 'stock_problem',
    message: 'Such amount is not permitted to sell',
  },
};


describe('16 - testa services de VENDAS', () => {
  const validId = '618219512f8cd974613455eb'
  describe('Quando adiciona vendas', () => {
    it('Deve retornar erro se alguma venda possuir quantidade menor ou igual a zero', async () => {
      const sale = await salesService.addSales([{productId: validId, quantity: 0 }]);
      expect(sale).to.have.all.keys('err');
    })
    it('Deve retornar erro alguma quantidade não for do tipo number', async () => {
      const sale = await salesService.addSales([{productId: validId, quantity: '15' }]);
      expect(sale).to.have.all.keys('err');
    })
    it('Deve retornar um erro se a quantidade de venda de algum produto for maior do que a do estoque', async () => {
      sinon.stub(productModel, 'getProductById').resolves({ _id:validId, name: 'capa do batman', quantity: 15 });
      const sale = await salesService.addSales([{ productId: validId, quantity: 20 }]);
      expect(sale).to.include.all.keys('err');
      productModel.getProductById.restore();
    })
    it('Deverá retornar um objeto contendo os dados da venda caso ela seja bem sucedida', async () => {
      sinon.stub(productModel, 'getProductById').resolves({ _id:validId, name: 'capa do batman', quantity: 15 });
      sinon.stub(salesModel, 'addSales').resolves({ _id:'123', itensSold: [] });
      const sale = await salesService.addSales([{ productId: validId, quantity: 5 }]);
      expect(sale).to.include.all.keys('_id', 'itensSold');
      productModel.getProductById.restore();
      salesModel.addSales.restore();
    })
  })
  describe('17 - Quando listada todas as vendas efetuadas', () => {
    it('Quando não há nenhuma venda, deverá retornar um array vazio', async () => {
      sinon.stub(salesModel, 'getAllSales').resolves([]);
      const sales = await salesService.getAllSales();
      expect(sales).to.be.empty;
      salesModel.getAllSales.restore();
    })
    it('Deve retornar um objeto com as vendas cadastradas', async () => {
      sinon.stub(salesModel, 'getAllSales').resolves({ sales: []});
      const sales = await salesService.getAllSales();
      expect(sales).to.include.all.keys('sales');
      salesModel.getAllSales.restore();
    })
  })

  describe('18 - Quando feita a busca de uma venda por Id', () => {
    it('Deve retornar um null quando o ID é inválido', async () => {
      sinon.stub(salesModel, 'getSaleById').resolves(null);
      const sale = await salesService.getSaleById(123);
      expect(sale).to.be.null;
      salesModel.getSaleById.restore();
    });
    
    it('Deverá retornar a venda encontrada com os atributos corretos', async () => {
      sinon.stub(salesModel, 'getSaleById').resolves({ _id: '', itensSold: ''});
      const sale = await salesService.getSaleById(123);
      expect(sale).to.include.all.keys('_id', 'itensSold');
      salesModel.getSaleById.restore();
    })
  })

  describe('19 - Ao atualizar uma venda', () => {
    const productId = '6182215b90f4d25d5fd37ae5';
    const saleId = '618221d894075809fb5702d4';
    it('Deve retornar erro se alguma venda possuir quantidade menor ou igual a zero', async () => {
      const sale = await salesService.updateSale( saleId, [{productId, quantity: 0 }]);
      expect(sale).to.have.all.keys('err');
    })
    it('Deve retornar erro alguma quantidade não for do tipo number', async () => {
      const sale = await salesService.updateSale(saleId, [{productId, quantity: '15' }]);
      expect(sale).to.have.all.keys('err');
    })
  });

  describe('20 - Ao remover um venda cadastrada', () => {
    const saleId = '618223abc3f9f311e786c102';
    it('Devera retornar um objeto contendo o erro de Id caso seja passado um id invalido', async () => {
      const removedSale = await salesService.deleteSale('123');
      expect(removedSale).to.include.all.keys('err');
    });
    it('Quando passado o ID correto, remove a venda e retorna a venda removida', async () => {
      sinon.stub(salesModel, 'deleteSale').resolves({_id: '', itensSold: ''});
      sinon.stub(salesModel, 'getSaleById').resolves({itensSold:[{productId: 1, quantity: 10}]});
      sinon.stub(productModel, 'updateStock').resolves(true);
      const deletedSale = await salesService.deleteSale(saleId);
      expect(deletedSale).to.include.all.keys('_id', 'itensSold');
      salesModel.deleteSale.restore();
      salesModel.getSaleById.restore();
      productModel.updateStock.restore();
    })
  })
})