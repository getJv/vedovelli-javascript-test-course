import { mount } from '@vue/test-utils';
import Cart from '@/components/Cart';
import CartItem from '@/components/CartItem';
import { makeServer } from '@/miragejs/server';

const mountCartItem = () => {
  const product = server.create('product', {
    title: 'Lindo relogio',
    price: '22.33',
  });
  const wrapper = mount(CartItem, {
    propsData: {
      product,
    },
  });

  return { product, wrapper };
};

describe('Cart', () => {
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });
  afterEach(() => {
    server.shutdown();
  });

  it('should mount the component', async () => {
    const { wrapper } = mountCartItem();

    expect(wrapper.vm).toBeDefined();
  });
  it('should display product info', async () => {
    const {
      wrapper,
      product: { title, price },
    } = mountCartItem();

    expect(wrapper.text()).toContain(title);
    expect(wrapper.text()).toContain(price);
  });
  it('should display quantity 1when product is first displayed product info', async () => {
    const { wrapper } = mountCartItem();
    const quantity = wrapper.find('[data-testid="quantity"]');

    expect(quantity.text()).toContain('1');
  });
  it('should increase quantity when + button gets clicked', async () => {
    const { wrapper } = mountCartItem();
    const quantity = wrapper.find('[data-testid="quantity"]');
    const button = wrapper.find('[data-testid="+"]');
    await button.trigger('click');
    expect(quantity.text()).toContain('2');
    await button.trigger('click');
    expect(quantity.text()).toContain('3');
  });
  it('should decrease quantity when - button gets clicked', async () => {
    const { wrapper } = mountCartItem();
    const quantity = wrapper.find('[data-testid="quantity"]');
    const button = wrapper.find('[data-testid="-"]');
    await button.trigger('click');
    expect(quantity.text()).toContain('0');
  });
  it('should quantity not go to bellow zero', async () => {
    const { wrapper } = mountCartItem();
    const quantity = wrapper.find('[data-testid="quantity"]');
    const button = wrapper.find('[data-testid="-"]');
    await button.trigger('click');
    await button.trigger('click');
    expect(quantity.text()).toContain('0');
  });
});
