import { queryString, parse } from './queryString';

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
  it('should throw an error when receive and object', () => {
    const obj = {
      name: 'Jhonatan',
      abilities: {
        first: 'js',
        second: 'tdd',
      },
    };
    expect(() => queryString(obj)).toThrowError();
  });
});

describe('query string to Object ', () => {
  it('it shoud convert a queryString to an object', () => {
    const qs = 'name=Jhonatan&profession=developer';
    expect(parse(qs)).toEqual({
      name: 'Jhonatan',
      profession: 'developer',
    });
  });
  it('it shoud convert a queryString with a single key-pair to an object', () => {
    const qs = 'name=Jhonatan';
    expect(parse(qs)).toEqual({
      name: 'Jhonatan',
    });
  });
  it('it shoud convert a queryString with a key-pair with multiple values to an object', () => {
    const qs = 'name=Jhonatan&abilities=js,css';
    expect(parse(qs)).toEqual({
      name: 'Jhonatan',
      abilities: ['js', 'css'],
    });
  });
});
