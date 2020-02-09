const moment = require('moment');

const otpService = require('../otpService');
const otpRepository = require('../../repositories/otpRepository');
const playerRepository = require('../../repositories/playerRepository');

describe('OTP Service', () => {
  describe('verify OTP', () => {
    it('throws error when OTP is null/not found', async () => {
      otpRepository.getByPlayerId = jest.fn(() => Promise.resolve(null));

      await expect(otpService.verifyOtp("aPlayerId", "akey"))
        .rejects
        .toThrow('No OTP found in database for playerId aPlayerId');
    });

    it('throws error when provided key does not match DB value', async () => {
      otpRepository.getByPlayerId = jest.fn(() => Promise.resolve({ key: "bkey" }));

      await expect(otpService.verifyOtp("aPlayerId", "akey"))
        .rejects
        .toThrow('OTP Key provided for playerId aPlayerId does not match database value.');
    });

    it('throws error when key has expired', async () => {
      otpRepository.getByPlayerId = jest.fn(() => Promise.resolve({ key: "akey", expiry: moment().subtract(1, 'minutes') }));

      await expect(otpService.verifyOtp("aPlayerId", "akey"))
        .rejects
        .toThrow('OTP for playerId aPlayerId has expired');
    });

    it('removes key and verifies player when verification success', async () => {
      otpRepository.getByPlayerId = jest.fn(() => Promise.resolve({ key: "akey", expiry: moment().add(1, 'minutes') }));
      otpRepository.removeByKey = jest.fn();

      playerRepository.markAsVerified = jest.fn();
      
      await otpService.verifyOtp("aPlayerId", "akey");

      expect(otpRepository.removeByKey).toHaveBeenCalled();
      expect(playerRepository.markAsVerified).toHaveBeenCalled();
    });
  });
})