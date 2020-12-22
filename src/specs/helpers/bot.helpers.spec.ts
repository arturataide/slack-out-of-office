import { BotHelper } from '../../helpers/bot.helper';
import {
  botDataPayload,
  botMessageEventPayload,
  challengeMessagePayload,
  outOfWorkingHours,
  userMessageEventPayload,
  workingHours,
} from '../mock/data.mock';

test('isChallenge', () => {
  expect(BotHelper.isChallenge(challengeMessagePayload)).toBe(true);
  expect(BotHelper.isChallenge({ event: userMessageEventPayload })).toBe(false);
  expect(BotHelper.isChallenge({ event: userMessageEventPayload })).toBe(false);
});

test('isBot', () => {
  expect(BotHelper.isBot(botMessageEventPayload)).toBe(true);
  expect(BotHelper.isBot(userMessageEventPayload)).toBe(false);
});

test('isOutOfOffice', () => {
  expect(BotHelper.isOutOfOffice(workingHours, botDataPayload)).toBe(false);
  expect(BotHelper.isOutOfOffice(outOfWorkingHours, botDataPayload)).toBe(true);
});
