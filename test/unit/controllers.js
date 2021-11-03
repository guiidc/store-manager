const productController = require('../../controllers/productController');
const productService = require('../../services/productService');
const salesController = require('../../controllers/salesController');
const salesService = require('../../services/salesService');
const sinon = require('sinon');
const { expect } = require('chai');
const { response } = require('express');

describe('testa o controller de PRODUTOS', () => {
  describe('21 - Quando chama o controller addProducts', () => {
    describe('Quando ocorre algum erro', () => {
      let response = {};
      let request = {};
      
      before(() => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns(); 
        request.body = {}
        sinon.stub(productService, 'addProduct').resolves({err: 'erro'});
      });

      after(() => {
        productService.addProduct.restore();
      })

      it('Deve retornar status 422 caso ocorra algum erro', async () => {
        const product = await productController.addProduct(request, response);
        expect(response.status.calledWith(422)).to.be.eql(true);
        expect(response.json.calledWith(sinon.match.object)).to.be.eql(true);
      });
    })
    describe('Quando o produto é adicionado com sucesso', () => {
      let response = {};
      let request = {};

      before(async() => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        request.body = {}
        sinon.stub(productService, 'addProduct').resolves({name: 'mouse sem fio', quantity: 15});
      });

      after(() => {
        productService.addProduct.restore();
      });

      it('Deve retornar status 200 e um objeto com o produto criado', async () => {
        const product = await productController.addProduct(request, response);
        expect(response.status.calledWith(201)).to.be.eql(true);
        expect(response.json.calledWith(sinon.match.object)).to.be.eql(true);
      })
    })
  })

  describe('22 - Quando chama o controller GetAllProducts', () => {
    describe('Deve retornar status 200', () => {
      let request = {};
      let response = {};
      before(async () => {
        request.body = {};
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(productService, 'getAllProducts').resolves([]);
      });
      after(() => {
        productService.getAllProducts.restore();
      })
      it('verifica se o response foi chamado com status 200', async () => {
        const allProducts = await productController.getAllProducts(request, response);
        expect(response.status.calledWith(200)).to.be.eql(true);
        expect(response.json.calledWith(sinon.match.object)).to.be.eql(true);
      })
    })
  })
  describe('23 - Quando chama o controller getProductById', () => {
    describe('Quando ocorre algum erro', () => {
      let response = {};
      let request = {};
      
      before(() => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns(); 
        request.params = {}
        sinon.stub(productService, 'getProductById').resolves({err: 'erro'});
      });

      after(() => {
        productService.getProductById.restore();
      });

      it('Deve retornar status 422 caso ocorra algum erro', async () => {
        const product = await productController.getProductById(request, response);
        expect(response.status.calledWith(422)).to.be.eql(true);
        expect(response.json.calledWith(sinon.match.object)).to.be.eql(true);
      });
    });
    describe('Quando o produto encontrado com sucesso', () => {
      let response = {};
      let request = {};

      before(async() => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        request.params = {}
        sinon.stub(productService, 'getProductById').resolves({name: 'mouse sem fio', quantity: 15});
      });

      after(() => {
        productService.getProductById.restore();
      });

      it('Deve retornar status 200 e um objeto com o produto encontrado', async () => {
        const product = await productController.getProductById(request, response);
        expect(response.status.calledWith(200)).to.be.eql(true);
        expect(response.json.calledWith(sinon.match.object)).to.be.eql(true);
      });
    });
  });

  describe('24 - Quando chama o controller updateProduct', () => {
    let request = {};
    let response = {};
    describe('Quando ocorre algum erro', () => {
      before(async () => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        request.body = {};
        request.params = {}
        sinon.stub(productService, 'updateProduct').resolves({err: 'erro' });
      });
      after(() => {
        productService.updateProduct.restore();
      });

      it('verifica se retorna o status 422', async () => {
        const productUpdated = await productController.updateProduct(request, response);
        expect(response.status.calledWith(422)).to.be.eql(true);
        expect(response.json.calledWith(sinon.match.object)).to.be.eql(true);
      })
    })
    describe('Quando atualiza o produto com sucesso', () => {
      before(async () => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        request.body = {};
        request.params = {}
        sinon.stub(productService, 'updateProduct').resolves({});
      });
      after(() => {
        productService.updateProduct.restore();
      });

      it('verifica se retorna o status 200', async () => {
        const productUpdated = await productController.updateProduct(request, response);
        expect(response.status.calledWith(200)).to.be.eql(true);
        expect(response.json.calledWith(sinon.match.object)).to.be.eql(true);
      })
    })
  })
  describe('25 - Quando chama o controller removeProduct', () => {
    let request = {};
    let response = {};
    describe('Quando ocorre algum erro', () => {
      before(async () => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        request.params = {}
        sinon.stub(productService, 'removeProduct').resolves({err: 'erro' });
      });
      after(() => {
        productService.removeProduct.restore();
      });

      it('verifica se retorna o status 422', async () => {
        const productUpdated = await productController.removeProduct(request, response);
        expect(response.status.calledWith(422)).to.be.eql(true);
        expect(response.json.calledWith(sinon.match.object)).to.be.eql(true);
      })
    })
    describe('Quando remove o produto com sucesso', () => {
      before(async () => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        request.params = {}
        sinon.stub(productService, 'removeProduct').resolves({});
      });
      after(() => {
        productService.removeProduct.restore();
      });

      it('verifica se retorna o status 200', async () => {
        const productUpdated = await productController.removeProduct(request, response);
        expect(response.status.calledWith(200)).to.be.eql(true);
        expect(response.json.calledWith(sinon.match.object)).to.be.eql(true);
      })
    })
  })
})

// SALES CONTROLLER
describe('testa o controller de VENDAS', () => {
  describe('26 - Quando chama o controller addSales', () => {
    describe('Quando ocorre algum erro', () => {
      let response = {};
      let request = {};
      
      before(() => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns(); 
        request.body = {}
        sinon.stub(salesService, 'addSales').resolves({err: {code: 'err'}});
      });

      after(() => {
        salesService.addSales.restore();
      })

      it('Deve retornar status 422 caso ocorra algum erro no estoque', async () => {
        const sales = await salesController.addSales(request, response);
        expect(response.status.calledWith(422)).to.be.eql(true);
        expect(response.json.calledWith(sinon.match.object)).to.be.eql(true);
      });
    })
    describe('Quando ocorre algum erro', () => {
      let response = {};
      let request = {};
      
      before(() => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns(); 
        request.body = {}
        sinon.stub(salesService, 'addSales').resolves({err: 'err'});
      });

      after(() => {
        salesService.addSales.restore();
      })

      it('Deve retornar status 404 caso ocorra algum erro relacionado aos dados', async () => {
        const sales = await salesController.addSales(request, response);
        expect(response.status.calledWith(422)).to.be.eql(true);
        expect(response.json.calledWith(sinon.match.object)).to.be.eql(true);
      });
    })
    describe('Quando o produto é adicionado com sucesso', () => {
      let response = {};
      let request = {};

      before(async() => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        request.body = {}
        sinon.stub(salesService, 'addSales').resolves({});
      });

      after(() => {
        salesService.addSales.restore();
      });

      it('Deve retornar status 200 e um objeto com a venda cadastrada', async () => {
        const sale = await salesController.addSales(request, response);
        expect(response.status.calledWith(200)).to.be.eql(true);
        expect(response.json.calledWith(sinon.match.object)).to.be.eql(true);
      })
    })
  })

  describe('27 - Quando chama o controller GetAllSales', () => {
    describe('Deve retornar status 200', () => {
      let request = {};
      let response = {};
      before(async () => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(salesService, 'getAllSales').resolves([]);
      });
      after(() => {
        salesService.getAllSales.restore();
      })
      it('verifica se o response foi chamado com status 200', async () => {
        const allSales = await salesController.getAllSales(request, response);
        expect(response.status.calledWith(200)).to.be.eql(true);
        expect(response.json.calledWith(sinon.match.array)).to.be.eql(true);
      })
    })
  })
  describe('28 - Quando chama o controller getSaleById', () => {
    describe('Quando ocorre algum erro', () => {
      let response = {};
      let request = {};
      
      before(() => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns(); 
        request.params = {}
        sinon.stub(salesService, 'getSaleById').resolves(null);
      });

      after(() => {
        salesService.getSaleById.restore();
      });

      it('Deve retornar status 422 não encontre a venda', async () => {
        const sale = await salesController.getSaleById(request, response);
        expect(response.status.calledWith(404)).to.be.eql(true);
        expect(response.json.calledWith(sinon.match.object)).to.be.eql(true);
      });
    });
    describe('Quando a venda é encontrada com sucesso', () => {
      let response = {};
      let request = {};

      before(async() => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        request.params = {}
        sinon.stub(salesService, 'getSaleById').resolves({name: 'mouse sem fio', quantity: 15});
      });

      after(() => {
        salesService.getSaleById.restore();
      });

      it('Deve retornar status 200 e um objeto com a venda encontrada', async () => {
        const sale = await salesController.getSaleById(request, response);
        expect(response.status.calledWith(200)).to.be.eql(true);
        expect(response.json.calledWith(sinon.match.object)).to.be.eql(true);
      });
    });
  });

  describe('29 - Quando chama o controller updateSale', () => {
    let request = {};
    let response = {};
    describe('Quando ocorre algum erro', () => {
      before(async () => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        request.params = {}
        sinon.stub(salesService, 'updateSale').resolves({err: 'erro' });
      });
      after(() => {
        salesService.updateSale.restore();
      });

      it('verifica se retorna o status 422', async () => {
        const saleUpdated = await salesController.updateSale(request, response);
        expect(response.status.calledWith(422)).to.be.eql(true);
        expect(response.json.calledWith(sinon.match.object)).to.be.eql(true);
      })
    })
    describe('Quando atualiza a venda com sucesso', () => {
      before(async () => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        request.params = {}
        sinon.stub(salesService, 'updateSale').resolves({});
      });
      after(() => {
        salesService.updateSale.restore();
      });

      it('verifica se retorna o status 200', async () => {
        const productUpdated = await salesController.updateSale(request, response);
        expect(response.status.calledWith(200)).to.be.eql(true);
        expect(response.json.calledWith(sinon.match.object)).to.be.eql(true);
      })
    })
  })
  describe('30 - Quando chama o controller deleteSale', () => {
    let request = {};
    let response = {};
    describe('Quando ocorre algum erro', () => {
      before(async () => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        request.params = {}
        sinon.stub(salesService, 'deleteSale').resolves({err: 'erro' });
      });
      after(() => {
        salesService.deleteSale.restore();
      });

      it('verifica se retorna o status 422', async () => {
        const deletedSale = await salesController.deleteSale(request, response);
        expect(response.status.calledWith(422)).to.be.eql(true);
        expect(response.json.calledWith(sinon.match.object)).to.be.eql(true);
      })
    })
    describe('Quando remove a venda com sucesso', () => {
      before(async () => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        request.params = {}
        sinon.stub(salesService, 'deleteSale').resolves({});
      });
      after(() => {
        salesService.deleteSale.restore();
      });

      it('verifica se retorna o status 200', async () => {
        const deletedSale = await salesController.deleteSale(request, response);
        expect(response.status.calledWith(200)).to.be.eql(true);
        expect(response.json.calledWith(sinon.match.object)).to.be.eql(true);
      })
    })
  })
})