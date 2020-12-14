const { queryString } = require('./queryString');

describe('Object to query string', () => {
  it('should created a valid queryString from a object', () => {
    const obj = {
      name: 'Jhonatan',
      profession: 'Developer',
    };
    expect(queryString(obj)).toBe('name=Jhonatan&profession=Developer');
  });
  it('should created a valid queryString from a object even when one of main properties contains an array as value', () => {
    const obj = {
      name: 'Jhonatan',
      abilities: ['JS', 'TDD'],
    };
    expect(queryString(obj)).toBe('name=Jhonatan&abilities=JS,TDD');
  });
});
