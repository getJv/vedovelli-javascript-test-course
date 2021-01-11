import { mount } from '@vue/test-utils';
import ProductCard from '@/components/ProductCard';
import { cartState } from '@/state';
import { makeServer } from '@/miragejs/server';

const mountProductCard = () => {
  const product = server.create('product', {
    title: 'Relogio Bonito',
    price: '22.00',
  });

  return {
    wrapper: mount(ProductCard, {
      propsData: {
        product,
      },
    }),
    product,
  };
};

describe('ProductCard - Unit', () => {
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });
  afterEach(() => {
    server.shutdown();
  });

  it('Should mount the component', () => {
    const { wrapper } = mountProductCard();

    expect(wrapper.text()).toContain('Relogio Bonito');
    expect(wrapper.text()).toContain('22.00');
  });

  /* it('Should emmit addToCart Event when clicked on the button', async () => {
    const { wrapper, product } = mountProductCard();
    await wrapper.find('button').trigger('click');

    expect(wrapper.emitted().addToCart).toBeTruthy();
    expect(wrapper.emitted().addToCart.length).toBe(1);
    expect(wrapper.emitted().addToCart[0]).toEqual([{ product }]);
  }); */
  it('Should add item to cart on button link', async () => {
    const { wrapper } = mountProductCard();
    await wrapper.find('button').trigger('click');

    expect(cartState.items).toHaveLength(1);
  });
  /* it('Should ensure not to add item to cart twice', async () => {
    const { wrapper } = mountProductCard();
    await wrapper.find('button').trigger('click');
    await wrapper.find('button').trigger('click');

    expect(cartState.items).toHaveLength(1);
  }); */
});
