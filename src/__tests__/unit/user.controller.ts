import {
  createStubInstance,
  expect,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {UserRepository} from '../../repositories';
import {UserController} from '../../controllers';
import {User} from '../../models';
import {HttpErrors} from '@loopback/rest';

export function userDefault(): Partial<User> {
  return {
    firstName: 'test',
    middleName: 'test.com',
    lastName: 'test, test',
    email:'test@gmail.com',
    address:'test',
    phoneNumber:"23123123"
  };
}

function givenUserData(data?: Partial<User>): User {
  return Object.assign(
    new User({
      ...userDefault(),
    }),
    data,
  );
}

describe('User controller unit test', () => {
  let repository: StubbedInstanceWithSinonAccessor<UserRepository>;
  beforeEach(givenStubbedRepository);

  describe('Users', () => {
    it('should retrieve Users', async () => {
      const controller = new UserController(repository);
      const testData = givenUserData();

      repository.stubs.find.resolves([testData]);

      const details = await controller.find();

      expect(details).to.be.Array();
      expect(details).to.containEql(testData);
    });

    it("shouldn't return User", async () => {
      const controller = new UserController(repository);
      repository.stubs.find.rejects(new HttpErrors[404]());

      try {
        const data = await controller.find();
        expect(data).to.be.undefined();
      } catch (e) {
        expect(e).to.be.instanceOf(HttpErrors[404]);
      }
    });
  });

  describe('Users controller count:', () => {
    it('retrieves User count', async () => {
      const controller = new UserController(repository);
      repository.stubs.count.resolves({count: 1});

      const details = await controller.count();

      expect(details).to.containEql({count: 1});
    });

    it('retrieves User if not exist', async () => {
      const controller = new UserController(repository);
      repository.stubs.count.rejects(new HttpErrors[404]());

      try {
        const data = await controller.count();
        expect(data).to.be.undefined();
      } catch (e) {
        expect(e).to.be.instanceOf(HttpErrors[404]);
      }
    });
  });

  describe('User by id', () => {
    it('find by id', async () => {
      const controller = new UserController(repository);
      const testData = givenUserData();

      repository.stubs.findById.resolves(testData).withArgs(1);

      const data = await controller.findById(1);
      expect(data).to.be.deepEqual(testData);
    });

    it("doesn't exist with id", async () => {
      const controller = new UserController(repository);
      repository.stubs.findById.rejects(new HttpErrors[404]).withArgs(1);

      try {
        const details = await controller.findById(1);
        expect(details).to.be.undefined();
      } catch (e) {
        expect(e).to.be.instanceOf(HttpErrors[404]);
      }
    });
  });

  describe('create User', () => {
    it('create User', async () => {
      const controller = new UserController(repository);
      const UserData = givenUserData();
      repository.stubs.create.resolves(UserData).withArgs(UserData);

      const data = await controller.create(UserData);
      expect(data).to.be.deepEqual(UserData);
    });
  });

  function givenStubbedRepository() {
    repository = createStubInstance(UserRepository);
  }
});
