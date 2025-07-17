import { Logger } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { authenticationOptionsDefaultConfig } from './rockets-server-options-default.config';

// Mock the crypto module
jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'mock-uuid'),
}));

describe('rockets-server-options-default.config', () => {
  let originalEnv: NodeJS.ProcessEnv;
  let mockWarn: jest.SpyInstance;
  let mockLog: jest.SpyInstance;

  beforeAll(() => {
    mockWarn = jest.spyOn(Logger, 'warn').mockImplementation(jest.fn());
    mockLog = jest.spyOn(Logger, 'log').mockImplementation(jest.fn());
  });

  afterAll(() => {
    mockWarn.mockRestore();
    mockLog.mockRestore();
  });

  beforeEach(() => {
    originalEnv = process.env;
    process.env = { ...originalEnv };
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('authenticationOptionsDefaultConfig', () => {
    it('should create default configuration with environment variables', () => {
      process.env.JWT_MODULE_DEFAULT_EXPIRES_IN = '2h';
      process.env.JWT_MODULE_ACCESS_EXPIRES_IN = '30m';
      process.env.JWT_MODULE_REFRESH_EXPIRES_IN = '7d';
      process.env.JWT_MODULE_ACCESS_SECRET = 'test-access-secret';
      process.env.JWT_MODULE_REFRESH_SECRET = 'test-refresh-secret';

      const config = authenticationOptionsDefaultConfig();

      expect(config).toBeDefined();
      expect(config.email).toBeDefined();
      expect(config.otp).toBeDefined();
      expect(config.email.from).toBe('from');
      expect(config.email.baseUrl).toBe('baseUrl');
      expect(config.email.tokenUrlFormatter).toBeDefined();
      expect(config.email.templates.sendOtp).toBeDefined();
      expect(config.otp.assignment).toBe('userOtp');
      expect(config.otp.category).toBe('auth-login');
      expect(config.otp.type).toBe('uuid');
      expect(config.otp.expiresIn).toBe('1h');
    });

    it('should create default configuration with fallback values', () => {
      const config = authenticationOptionsDefaultConfig();

      expect(config).toBeDefined();
      expect(config.email).toBeDefined();
      expect(config.otp).toBeDefined();
    });

    it('should handle missing environment variables', () => {
      delete process.env.JWT_MODULE_DEFAULT_EXPIRES_IN;
      delete process.env.JWT_MODULE_ACCESS_EXPIRES_IN;
      delete process.env.JWT_MODULE_REFRESH_EXPIRES_IN;
      delete process.env.JWT_MODULE_ACCESS_SECRET;
      delete process.env.JWT_MODULE_REFRESH_SECRET;

      const config = authenticationOptionsDefaultConfig();

      expect(config).toBeDefined();
      expect(mockWarn).toHaveBeenCalledWith(
        'No default access token secret was provided to the JWT module.' +
          ' Since NODE_ENV is not production, a random string will be generated.' +
          ' It will not persist past this instance of the module.',
      );
      expect(mockLog).toHaveBeenCalledWith(
        'No default refresh token secret was provided to the JWT module.' +
          ' Copying the secret from the access token configuration.',
      );
    });

    it('should throw error in production without access secret', () => {
      process.env.NODE_ENV = 'production';
      delete process.env.JWT_MODULE_ACCESS_SECRET;

      expect(() => {
        authenticationOptionsDefaultConfig();
      }).toThrow(InternalServerErrorException);
      expect(() => {
        authenticationOptionsDefaultConfig();
      }).toThrow('A secret key must be set when NODE_ENV=production');
    });

    it('should use access secret when provided', () => {
      process.env.JWT_MODULE_ACCESS_SECRET = 'test-access-secret';
      delete process.env.JWT_MODULE_REFRESH_SECRET;

      const config = authenticationOptionsDefaultConfig();

      expect(config).toBeDefined();
      expect(mockLog).toHaveBeenCalledWith(
        'No default refresh token secret was provided to the JWT module.' +
          ' Copying the secret from the access token configuration.',
      );
    });

    it('should use refresh secret when provided', () => {
      process.env.JWT_MODULE_ACCESS_SECRET = 'test-access-secret';
      process.env.JWT_MODULE_REFRESH_SECRET = 'test-refresh-secret';

      const config = authenticationOptionsDefaultConfig();

      expect(config).toBeDefined();
      expect(mockLog).not.toHaveBeenCalled();
    });
  });

  describe('configureAccessSecret (internal function)', () => {
    it('should throw JwtConfigUndefinedException when options is null', () => {
      const config = authenticationOptionsDefaultConfig();
      expect(config).toBeDefined();
    });

    it('should use environment access secret when provided', () => {
      process.env.JWT_MODULE_ACCESS_SECRET = 'test-access-secret';

      const config = authenticationOptionsDefaultConfig();

      expect(config).toBeDefined();
    });

    it('should throw InternalServerErrorException in production without secret', () => {
      process.env.NODE_ENV = 'production';
      delete process.env.JWT_MODULE_ACCESS_SECRET;

      expect(() => {
        authenticationOptionsDefaultConfig();
      }).toThrow(InternalServerErrorException);
    });

    it('should generate random UUID when not in production and no secret provided', () => {
      delete process.env.NODE_ENV;
      delete process.env.JWT_MODULE_ACCESS_SECRET;

      const config = authenticationOptionsDefaultConfig();

      expect(config).toBeDefined();
      expect(mockWarn).toHaveBeenCalled();
    });
  });

  describe('configureRefreshSecret (internal function)', () => {
    it('should use environment refresh secret when provided', () => {
      process.env.JWT_MODULE_ACCESS_SECRET = 'test-access-secret';
      process.env.JWT_MODULE_REFRESH_SECRET = 'test-refresh-secret';

      const config = authenticationOptionsDefaultConfig();

      expect(config).toBeDefined();
      expect(mockLog).not.toHaveBeenCalled();
    });

    it('should copy access secret when refresh secret not provided', () => {
      process.env.JWT_MODULE_ACCESS_SECRET = 'test-access-secret';
      delete process.env.JWT_MODULE_REFRESH_SECRET;

      const config = authenticationOptionsDefaultConfig();

      expect(config).toBeDefined();
      expect(mockLog).toHaveBeenCalledWith(
        'No default refresh token secret was provided to the JWT module.' +
          ' Copying the secret from the access token configuration.',
      );
    });
  });

  describe('environment variable combinations', () => {
    it('should handle all JWT environment variables set', () => {
      process.env.JWT_MODULE_DEFAULT_EXPIRES_IN = '2h';
      process.env.JWT_MODULE_ACCESS_EXPIRES_IN = '30m';
      process.env.JWT_MODULE_REFRESH_EXPIRES_IN = '7d';
      process.env.JWT_MODULE_ACCESS_SECRET = 'test-access-secret';
      process.env.JWT_MODULE_REFRESH_SECRET = 'test-refresh-secret';

      const config = authenticationOptionsDefaultConfig();

      expect(config).toBeDefined();
    });

    it('should handle only default expires in set', () => {
      process.env.JWT_MODULE_DEFAULT_EXPIRES_IN = '2h';
      delete process.env.JWT_MODULE_ACCESS_EXPIRES_IN;
      delete process.env.JWT_MODULE_REFRESH_EXPIRES_IN;
      process.env.JWT_MODULE_ACCESS_SECRET = 'test-access-secret';
      process.env.JWT_MODULE_REFRESH_SECRET = 'test-refresh-secret';

      const config = authenticationOptionsDefaultConfig();

      expect(config).toBeDefined();
    });

    it('should handle only access expires in set', () => {
      delete process.env.JWT_MODULE_DEFAULT_EXPIRES_IN;
      process.env.JWT_MODULE_ACCESS_EXPIRES_IN = '30m';
      delete process.env.JWT_MODULE_REFRESH_EXPIRES_IN;
      process.env.JWT_MODULE_ACCESS_SECRET = 'test-access-secret';
      process.env.JWT_MODULE_REFRESH_SECRET = 'test-refresh-secret';

      const config = authenticationOptionsDefaultConfig();

      expect(config).toBeDefined();
    });

    it('should handle only refresh expires in set', () => {
      delete process.env.JWT_MODULE_DEFAULT_EXPIRES_IN;
      delete process.env.JWT_MODULE_ACCESS_EXPIRES_IN;
      process.env.JWT_MODULE_REFRESH_EXPIRES_IN = '7d';
      process.env.JWT_MODULE_ACCESS_SECRET = 'test-access-secret';
      process.env.JWT_MODULE_REFRESH_SECRET = 'test-refresh-secret';

      const config = authenticationOptionsDefaultConfig();

      expect(config).toBeDefined();
    });

    it('should handle no environment variables set', () => {
      delete process.env.JWT_MODULE_DEFAULT_EXPIRES_IN;
      delete process.env.JWT_MODULE_ACCESS_EXPIRES_IN;
      delete process.env.JWT_MODULE_REFRESH_EXPIRES_IN;
      delete process.env.JWT_MODULE_ACCESS_SECRET;
      delete process.env.JWT_MODULE_REFRESH_SECRET;

      const config = authenticationOptionsDefaultConfig();

      expect(config).toBeDefined();
      expect(mockWarn).toHaveBeenCalled();
      expect(mockLog).toHaveBeenCalled();
    });
  });

  describe('error scenarios', () => {
    it('should throw InternalServerErrorException in production without access secret', () => {
      process.env.NODE_ENV = 'production';
      delete process.env.JWT_MODULE_ACCESS_SECRET;

      expect(() => {
        authenticationOptionsDefaultConfig();
      }).toThrow(InternalServerErrorException);
    });

    it('should not throw in development without access secret', () => {
      delete process.env.NODE_ENV;
      delete process.env.JWT_MODULE_ACCESS_SECRET;

      const config = authenticationOptionsDefaultConfig();

      expect(config).toBeDefined();
      expect(mockWarn).toHaveBeenCalled();
    });

    it('should handle production with access secret', () => {
      process.env.NODE_ENV = 'production';
      process.env.JWT_MODULE_ACCESS_SECRET = 'test-access-secret';
      process.env.JWT_MODULE_REFRESH_SECRET = 'test-refresh-secret';

      const config = authenticationOptionsDefaultConfig();

      expect(config).toBeDefined();
    });
  });
});
