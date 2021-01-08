import { mount } from '@vue/test-utils';
import Cart from '@/components/Cart';
import CartItem from '@/components/CartItem';
import { makeServer } from '@/miragejs/server';

describe('Cart', () => {
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });
  afterEach(() => {
    server.shutdown();
  });

  it('should mount the component', async () => {
    const wrapper = mount(Cart);
    expect(wrapper.vm).toBeDefined();
  });

  it('should emit close event when button gets clicked', async () => {
    const wrapper = mount(Cart);
    const button = wrapper.find('[data-testid="close-button"]');

    await button.trigger('click');
    expect(wrapper.emitted()['update:isOpen']).toBeTruthy();
    expect(wrapper.emitted()['update:isOpen']).toHaveLength(1);
  });
  it('should hide the cart when no prop isOpne is passed', async () => {
    const wrapper = mount(Cart);

    expect(wrapper.classes()).toContain('hidden');
  });
  it('should display the cart when prop isOpne is passed', async () => {
    const wrapper = mount(Cart, {
      propsData: {
        isOpen: true,
      },
    });

    expect(wrapper.classes()).not.toContain('hidden');
  });
  it('should display Cart is empty when are o products', async () => {
    const wrapper = mount(Cart);

    expect(wrapper.text()).toContain('Cart is empty');
  });
  it('should display 2 instances of CartItem when 2 products are selected', async () => {
    const products = server.createList('product', 2);

    const wrapper = mount(Cart, {
      propsData: {
        products,
      },
    });

    expect(wrapper.findAllComponents(CartItem)).toHaveLength(2);
    expect(wrapper.text()).not.toContain('Cart is empty');
  });
});
