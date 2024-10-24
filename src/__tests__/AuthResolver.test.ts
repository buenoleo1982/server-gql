import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { AuthResolver } from '../resolvers/AuthResolver';
import { refreshAccessToken } from '../utils/auth';

// Mock the auth utils
vi.mock('../utils/auth', () => ({
  generateTokens: vi.fn(),
  refreshAccessToken: vi.fn(),
}));

describe('AuthResolver', () => {
  let authResolver: AuthResolver;

  beforeEach(() => {
    authResolver = new AuthResolver();
    vi.clearAllMocks();
  });

  describe('refreshToken', () => {
    it('should return new access token when refresh token is valid', () => {
      const mockNewAccessToken = 'newAccessToken';
      (refreshAccessToken as Mock).mockReturnValue(mockNewAccessToken);

      const result = authResolver.refreshToken('validRefreshToken');

      expect(result).toBe(mockNewAccessToken);
      expect(refreshAccessToken).toHaveBeenCalledWith('validRefreshToken');
    });

    it('should return null when refresh token is invalid', () => {
      (refreshAccessToken as Mock).mockReturnValue(null);

      const result = authResolver.refreshToken('invalidRefreshToken');

      expect(result).toBeNull();
      expect(refreshAccessToken).toHaveBeenCalledWith('invalidRefreshToken');
    });
  });
});
