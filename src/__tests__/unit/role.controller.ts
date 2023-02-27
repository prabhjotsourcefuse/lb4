import {
  createStubInstance,
  expect,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {RoleRepository} from '../../repositories';
import {RoleController} from '../../controllers';
import {Role} from '../../models';
import {HttpErrors} from '@loopback/rest';

export function roleDefault(): Partial<Role> {
  return {
    name: 'test',
    key: 'admin',
    description: 'test',
  };
}

function givenRoleData(data?: Partial<Role>): Role {
  return Object.assign(
    new Role({
      ...roleDefault(),
    }),
    data,
  );
}

describe('Role controller unit test', () => {
  let repository: StubbedInstanceWithSinonAccessor<RoleRepository>;
  beforeEach(givenStubbedRepository);

  describe('Roles', () => {
    it('should retrieve Roles', async () => {
      const controller = new RoleController(repository);
      const testData = givenRoleData();

      repository.stubs.find.resolves([testData]);

      const details = await controller.find();

      expect(details).to.be.Array();
      expect(details).to.containEql(testData);
    });

    it("shouldn't return Role", async () => {
      const controller = new RoleController(repository);
      repository.stubs.find.rejects(new HttpErrors[404]());

      try {
        const data = await controller.find();
        expect(data).to.be.undefined();
      } catch (e) {
        expect(e).to.be.instanceOf(HttpErrors[404]);
      }
    });
  });

  describe('Roles controller count:', () => {
    it('retrieves Role count', async () => {
      const controller = new RoleController(repository);
      repository.stubs.count.resolves({count: 1});

      const details = await controller.count();

      expect(details).to.containEql({count: 1});
    });

    it('retrieves Role if not exist', async () => {
      const controller = new RoleController(repository);
      repository.stubs.count.rejects(new HttpErrors[404]());

      try {
        const data = await controller.count();
        expect(data).to.be.undefined();
      } catch (e) {
        expect(e).to.be.instanceOf(HttpErrors[404]);
      }
    });
  });

  describe('Role by id', () => {
    it('find by id', async () => {
      const controller = new RoleController(repository);
      const testData = givenRoleData();

      repository.stubs.findById.resolves(testData).withArgs(1);

      const data = await controller.findById(1);
      expect(data).to.be.deepEqual(testData);
    });

    it("doesn't exist with id", async () => {
      const controller = new RoleController(repository);
      repository.stubs.findById.rejects(new HttpErrors[404]).withArgs(1);

      try {
        const details = await controller.findById(1);
        expect(details).to.be.undefined();
      } catch (e) {
        expect(e).to.be.instanceOf(HttpErrors[404]);
      }
    });
  });

  describe('create Role', () => {
    it('create Role', async () => {
      const controller = new RoleController(repository);
      const RoleData = givenRoleData();
      repository.stubs.create.resolves(RoleData).withArgs(RoleData);

      const data = await controller.create(RoleData);
      expect(data).to.be.deepEqual(RoleData);
    });
  });

  function givenStubbedRepository() {
    repository = createStubInstance(RoleRepository);
  }
});
