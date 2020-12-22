import { mount } from '@vue/test-utils';
import ProductCard from '@/components/ProductCard';
import { makeServer } from '@/miragejs/server';

describe('ProductCard - Unit', () => {
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });
  afterEach(() => {
    server.shutdown();
  });
  it('Should mount the component', () => {
    const wrapper = mount(ProductCard, {
      propsData: {
        product: server.create('product', {
          title: 'Relogio Bonito',
          price: '22.00',
        }),
      },
    });

    expect(wrapper.text()).toContain('Relogio Bonito');
    expect(wrapper.text()).toContain('22.00');
  });
});
