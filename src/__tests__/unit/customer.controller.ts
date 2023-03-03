import {
  createStubInstance,
  expect,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {CustomerRepository} from '../../repositories';
import {CustomerController} from '../../controllers';
import {Customer} from '../../models';
import {HttpErrors} from '@loopback/rest';

export function customerDefault(): Partial<Customer> {
  return {
    name: 'test',
    website: 'test.com',
    address: 'test, test',
  };
}

function givenCustomerData(data?: Partial<Customer>): Customer {
  return Object.assign(
    new Customer({
      ...customerDefault(),
    }),
    data,
  );
}

describe('Customer controller unit test', () => {
  let repository: StubbedInstanceWithSinonAccessor<CustomerRepository>;
  beforeEach(givenStubbedRepository);

  describe('customers', () => {
    it('should retrieve customers', async () => {
      const controller = new CustomerController(repository);
      const testData = givenCustomerData();

      repository.stubs.find.resolves([testData]);

      const details = await controller.find();

      expect(details).to.be.Array();
      expect(details).to.containEql(testData);
    });

    it("shouldn't return customer", async () => {
      const controller = new CustomerController(repository);
      repository.stubs.find.rejects(new HttpErrors[404]());

      try {
        const data = await controller.find();
        expect(data).to.be.undefined();
      } catch (e) {
        expect(e).to.be.instanceOf(HttpErrors[404]);
      }
    });
  });

  describe('customers controller count:', () => {
    it('retrieves Customer count', async () => {
      const controller = new CustomerController(repository);
      repository.stubs.count.resolves({count: 1});

      const details = await controller.count();

      expect(details).to.containEql({count: 1});
    });

    it('retrieves Customer if not exist', async () => {
      const controller = new CustomerController(repository);
      repository.stubs.count.rejects(new HttpErrors[404]());

      try {
        const data = await controller.count();
        expect(data).to.be.undefined();
      } catch (e) {
        expect(e).to.be.instanceOf(HttpErrors[404]);
      }
    });
  });

  describe('customer by id', () => {
    it('find by id', async () => {
      const controller = new CustomerController(repository);
      const testData = givenCustomerData();

      repository.stubs.findById.resolves(testData).withArgs(1);

      const data = await controller.findById(1);
      expect(data).to.be.deepEqual(testData);
    });

    it("doesn't exist with id", async () => {
      const controller = new CustomerController(repository);
      repository.stubs.findById.rejects(new HttpErrors[404]).withArgs(1);

      try {
        const details = await controller.findById(1);
        expect(details).to.be.undefined();
      } catch (e) {
        expect(e).to.be.instanceOf(HttpErrors[404]);
      }
    });
  });

  describe('create customer', () => {
    it('create customer', async () => {
      const controller = new CustomerController(repository);
      const customerData = givenCustomerData();
      repository.stubs.create.resolves(customerData).withArgs(customerData);

      const data = await controller.create(customerData);
      expect(data).to.be.deepEqual(customerData);
    });
  });

  function givenStubbedRepository() {
    repository = createStubInstance(CustomerRepository);
  }
});
