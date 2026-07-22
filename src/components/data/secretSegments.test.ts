import { describe, expect, it } from 'vitest';
import { splitSecretSegments } from './secretSegments';

describe('splitSecretSegments', () => {
  it('splits text around {{secret:...}} placeholders', () => {
    expect(splitSecretSegments('Bearer {{secret:slot:a.example:auth_bearer}} end')).toEqual([
      { text: 'Bearer ', isSecret: false },
      { text: '{{secret:slot:a.example:auth_bearer}}', isSecret: true },
      { text: ' end', isSecret: false },
    ]);
  });

  it('returns one plain segment when no placeholder present', () => {
    expect(splitSecretSegments('plain')).toEqual([{ text: 'plain', isSecret: false }]);
  });
});
