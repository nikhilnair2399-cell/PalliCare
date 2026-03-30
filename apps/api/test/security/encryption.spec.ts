import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EncryptionService } from '../../src/common/services/encryption.service';

describe('EncryptionService', () => {
  let service: EncryptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EncryptionService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue('test-encryption-key-32chars-long!'),
          },
        },
      ],
    }).compile();

    service = module.get(EncryptionService);
  });

  describe('hashPhone', () => {
    it('should produce consistent hash for same phone number', () => {
      const hash1 = service.hashPhone('+919876543210');
      const hash2 = service.hashPhone('+919876543210');
      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different phone numbers', () => {
      const hash1 = service.hashPhone('+919876543210');
      const hash2 = service.hashPhone('+919876543211');
      expect(hash1).not.toBe(hash2);
    });

    it('should return 64-character hex string', () => {
      const hash = service.hashPhone('+919876543210');
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });
  });

  describe('anonymizeId', () => {
    it('should produce consistent anonymous ID for same user', () => {
      const anon1 = service.anonymizeId('user-uuid-123');
      const anon2 = service.anonymizeId('user-uuid-123');
      expect(anon1).toBe(anon2);
    });

    it('should produce different anonymous IDs for different users', () => {
      const anon1 = service.anonymizeId('user-uuid-123');
      const anon2 = service.anonymizeId('user-uuid-456');
      expect(anon1).not.toBe(anon2);
    });

    it('should return 16-character hex string', () => {
      const anon = service.anonymizeId('user-uuid-123');
      expect(anon).toMatch(/^[a-f0-9]{16}$/);
    });
  });

  describe('getEncryptionKey', () => {
    it('should return the configured encryption key', () => {
      const key = service.getEncryptionKey();
      expect(key).toBe('test-encryption-key-32chars-long!');
    });
  });
});
