import { Test, TestingModule } from '@nestjs/testing';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';

describe('FollowController', () => {
  let followController: FollowController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FollowController],
      providers: [FollowService],
    }).compile();

    followController = app.get<FollowController>(FollowController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(followController.getHello()).toBe('Hello World!');
    });
  });
});
