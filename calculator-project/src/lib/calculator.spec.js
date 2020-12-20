import { sum } from './calculator';

it('should sum 2 and 2 and result must be 4', () => {
  expect(sum(2, 2)).toBe(4);
});
it('should sum 2 and 2 and result must be 4 even when the input is a number as string type', () => {
  expect(sum('2', 2)).toBe(4);
});
it('should an error if the input cant be calculated', () => {
  expect(() => {
    sum('', 2);
  }).toThrowError();

  expect(() => {
    sum([2, 2]);
  }).toThrowError();

  expect(() => {
    sum({});
  }).toThrowError();

  expect(() => {
    sum();
  }).toThrowError();
});
