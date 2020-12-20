import Cart from './Cart';
describe('Cart', () => {
  let cart;
  let product;
  let product2;

  beforeEach(() => {
    cart = new Cart();
    product = {
      title: 'Adidas running shoes - men',
      price: 35388,
    };
    product2 = {
      title: 'Adidas running shoes - women',
      price: 41872,
    };
  });

  describe('getTotal()', () => {
    it('should return 0 when getTotal() is executed in a newly created instance', () => {
      expect(cart.getTotal().getAmount()).toEqual(0);
    });
    it('should multiply quantity and price and receive the total amount', () => {
      const item = {
        product,
        quantity: 2, //70776
      };

      cart.add(item);

      expect(cart.getTotal().getAmount()).toEqual(70776);
    });
    it('should ensure no more then one product exists at a time', () => {
      cart.add({
        product,
        quantity: 2,
      });
      cart.add({
        product,
        quantity: 1,
      });

      expect(cart.getTotal().getAmount()).toEqual(35388);
    });
    it('should update total when a product gets included', () => {
      cart.add({
        product,
        quantity: 2,
      });
      cart.add({
        product: product2,
        quantity: 1,
      });
      expect(cart.getTotal().getAmount()).toEqual(112648);
      cart.remove(product);

      expect(cart.getTotal().getAmount()).toEqual(41872);
    });
  });

  describe('checkout()', () => {
    it('should return an object with total and the list of items', () => {
      cart.add({
        product,
        quantity: 2,
      });
      cart.add({
        product: product2,
        quantity: 3,
      });
      expect(cart.checkout()).toMatchSnapshot();
    });
    it('should return an object with total and the list of items', () => {
      cart.add({
        product,
        quantity: 2,
      });
      cart.add({
        product: product2,
        quantity: 3,
      });
      expect(cart.summary()).toMatchSnapshot();
      expect(cart.getTotal().getAmount()).toBeGreaterThan(0);
    });
    it('should reset the cart when checkout is called', () => {
      cart.add({
        product: product2,
        quantity: 3,
      });
      cart.checkout();
      expect(cart.getTotal().getAmount()).toEqual(0);
    });
  });

  describe('Special conditions', () => {
    it('should apply percentage discount when buy more then min itens', () => {
      const condition = {
        percentage: 30,
        minimum: 2,
      };
      cart.add({
        product,
        condition,
        quantity: 3,
      });

      expect(cart.getTotal().getAmount()).toEqual(74315);
    });
    it('should NOT apply percentage discount when qnt is bellow our iqual de limit', () => {
      const condition = {
        percentage: 30,
        minimum: 2,
      };
      cart.add({
        product,
        condition,
        quantity: 2,
      });

      expect(cart.getTotal().getAmount()).toEqual(70776);
    });
    it('should apply percentage discount for even quantities', () => {
      const condition = {
        quantity: 2,
      };
      cart.add({
        product,
        condition,
        quantity: 4,
      });

      expect(cart.getTotal().getAmount()).toEqual(70776);
    });
    it('should NOT apply percentage discount for odd amonut', () => {
      const condition = {
        quantity: 2,
      };
      cart.add({
        product,
        condition,
        quantity: 1,
      });

      expect(cart.getTotal().getAmount()).toEqual(35388);
    });
    it('should apply quantity discount for odd quantities', () => {
      const condition = {
        quantity: 2,
      };
      cart.add({
        product,
        condition,
        quantity: 5,
      });

      expect(cart.getTotal().getAmount()).toEqual(106164);
    });
  });
});
