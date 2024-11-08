import { loadSignerType, storeSignerType } from './util';
import { ScopedLocalStorage } from ':core/storage/ScopedLocalStorage';

jest.mock(':core/storage/ScopedLocalStorage');

describe('util', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loadSignerType', () => {
    it('should load signer type from storage', () => {
      (ScopedLocalStorage.prototype.getItem as jest.Mock).mockReturnValue('scw');
      const result = loadSignerType();
      expect(result).toBe('scw');
      expect(ScopedLocalStorage.prototype.getItem).toHaveBeenCalledWith('SignerType');
    });

    it('should return null if no signer type is stored', () => {
      (ScopedLocalStorage.prototype.getItem as jest.Mock).mockReturnValue(null);
      const result = loadSignerType();
      expect(result).toBeNull();
    });
  });

  describe('storeSignerType', () => {
    it('should store signer type in storage', () => {
      storeSignerType('scw');
      expect(ScopedLocalStorage.prototype.setItem).toHaveBeenCalledWith('SignerType', 'scw');
    });
  });
});
