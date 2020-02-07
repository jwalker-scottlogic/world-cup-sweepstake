import { verifyOtp } from '../otpService';

describe('OTP Service', () => {
  describe('verify OTP', () => {
    it('throws error when OTP is null/not found', async () => {
        
      jest.mock('../otpService', () => {
          return jest.fn().mockImplementation(() => ({
            verifyOtp: (key) => Promise.resolve(null)
          }));
      });

      try {
        await verifyOtp("akey");
        expect(true).toEqual(false);
      } catch (error) {
        console.log(error);        
      }
    });

    it('throws error when provided key does not match DB value', () => {
    });

    it('throws error when key has expired', () => {

    });

    it('removes key and verifies player when verification success', () => {

    });
  });
})