const productController = require('../../controllers/productController');
const productService = require('../../services/productService');
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
})