import { describe, it, expect } from 'vitest';
import { createFrontal } from '../src/frontal-provider';

describe('Frontal Provider', () => {
  it('should create a provider instance', () => {
    const provider = createFrontal({
      baseURL: 'https://api.example.com/v1',
      name: 'test-provider',
      apiKey: 'test-key'
    });
    
    expect(provider).toBeDefined();
    expect(typeof provider).toBe('function');
  });

  it('should create a chat model', () => {
    const provider = createFrontal({
      baseURL: 'https://api.example.com/v1',
      name: 'test-provider',
      apiKey: 'test-key'
    });
    
    const model = provider.chatModel('test-model');
    expect(model).toBeDefined();
  });

  it('should create a completion model', () => {
    const provider = createFrontal({
      baseURL: 'https://api.example.com/v1',
      name: 'test-provider',
      apiKey: 'test-key'
    });
    
    const model = provider.completionModel('test-model');
    expect(model).toBeDefined();
  });

  it('should create an embedding model', () => {
    const provider = createFrontal({
      baseURL: 'https://api.example.com/v1',
      name: 'test-provider',
      apiKey: 'test-key'
    });
    
    const model = provider.embeddingModel('test-model');
    expect(model).toBeDefined();
  });

  it('should create an image model', () => {
    const provider = createFrontal({
      baseURL: 'https://api.example.com/v1',
      name: 'test-provider',
      apiKey: 'test-key'
    });
    
    const model = provider.imageModel('test-model');
    expect(model).toBeDefined();
  });
});