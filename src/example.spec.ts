function sum(num1: number, num2: number) {
  return num1 + num2;
}

describe('My Testing', () => {
  it('Adds two numbers', () => {
    expect(sum(2, 2)).toEqual(4);
  });
});
