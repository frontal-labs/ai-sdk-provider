import { describe, it, expect } from 'vitest';
import { createFrontal } from '../src/frontal-provider';

describe('Frontal Provider - Basic Tests', () => {
  it('should create a provider instance with correct structure', () => {
    const provider = createFrontal({
      baseURL: 'https://api.example.com/v1',
      name: 'test-provider',
      apiKey: 'test-key'
    });
    
    expect(provider).toBeDefined();
    expect(typeof provider).toBe('function');
    expect(provider.specificationVersion).toBe('v4');
  });

  it('should have correct provider methods', () => {
    const provider = createFrontal({
      baseURL: 'https://api.example.com/v1',
      name: 'test-provider',
      apiKey: 'test-key'
    });
    
    expect(provider.chatModel).toBeDefined();
    expect(provider.completionModel).toBeDefined();
    expect(provider.embeddingModel).toBeDefined();
    expect(provider.imageModel).toBeDefined();
    expect(provider.languageModel).toBeDefined();
  });

  it('should create models with correct types', () => {
    const provider = createFrontal({
      baseURL: 'https://api.example.com/v1',
      name: 'test-provider',
      apiKey: 'test-key'
    });
    
    const chatModel = provider.chatModel('test-model');
    const completionModel = provider.completionModel('test-model');
    const embeddingModel = provider.embeddingModel('test-model');
    const imageModel = provider.imageModel('test-model');
    
    expect(chatModel).toBeDefined();
    expect(completionModel).toBeDefined();
    expect(embeddingModel).toBeDefined();
    expect(imageModel).toBeDefined();
  });
});