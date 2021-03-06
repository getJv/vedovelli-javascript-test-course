import { mount } from '@vue/test-utils';
import axios from 'axios';
import Vue from 'vue';
import { makeServer } from '@/miragejs/server';
import Productcard from '@/components/Productcard';
import Search from '@/components/Search';
import ProductList from '.';

jest.mock('axios', () => ({
  get: jest.fn(),
}));

describe('ProductList - Integration', () => {
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });
  afterEach(() => {
    server.shutdown();
    jest.clearAllMocks();
  });

  const getProducts = async (quantity = 10, overrides = []) => {
    let overrideList = [];
    if (overrides.length > 0) {
      overrideList = overrides.map((override) =>
        server.create('product', override)
      );
    }
    const products = [
      ...server.createList('product', quantity),
      ...overrideList,
    ];
    return products;
  };

  const mountProductList = async (
    quantity = 10,
    overrides = [],
    shoudReject = false
  ) => {
    // Arrange
    const products = await getProducts(quantity, overrides);

    if (shoudReject) {
      axios.get.mockReturnValue(Promise.reject(new Error('')));
    } else {
      axios.get.mockReturnValue(Promise.resolve({ data: { products } }));
    }

    const wrapper = mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    });

    await Vue.nextTick();

    return { wrapper, products };
  };

  it('Should mount the component', async () => {
    const { wrapper } = await mountProductList();
    expect(wrapper.vm).toBeDefined();
  });
  it('Should call axios.get when mount the component', async () => {
    await mountProductList();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('/api/products');
  });
  it('Should mount Search component as a child', async () => {
    const { wrapper } = await mountProductList();
    expect(wrapper.findComponent(Search)).toBeDefined();
  });
  it('Should mount Productcard component as a child', () => {
    const wrapper = mount(ProductList);
    expect(wrapper.findComponent(Productcard)).toBeDefined();
  });
  it('Should mount Productcard component 10 times', async () => {
    const { wrapper } = await mountProductList();

    // tests
    const cards = wrapper.findAllComponents(Productcard);
    expect(cards).toHaveLength(10);
  });
  it('Should display the error when promise reject', async () => {
    axios.get.mockReturnValue(Promise.reject(new Error('')));

    const wrapper = mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    });

    await Vue.nextTick();

    expect(wrapper.text()).toContain('Problemas ao carregar lista');
  });
  it('Should filter the product list when search is perform', async () => {
    const { wrapper } = await mountProductList(10, [
      {
        title: 'Meu relógio amado',
      },
      {
        title: 'Meu outro relógio estimado',
      },
    ]);

    // Act
    const search = wrapper.findComponent(Search);
    search.find('input[type="search"]').setValue('relógio');
    await search.find('form').trigger('submit');

    // Assert
    const cards = wrapper.findAllComponents(Productcard);
    expect(wrapper.vm.searchTerm).toEqual('relógio');
    expect(cards).toHaveLength(2);
  });
  it('Should filter the product list when search is perform', async () => {
    // Arrange
    const { wrapper } = await mountProductList(10, [
      {
        title: 'Meu relógio amado',
      },
    ]);

    // Act
    const search = wrapper.findComponent(Search);
    search.find('input[type="search"]').setValue('relógio');
    await search.find('form').trigger('submit');
    search.find('input[type="search"]').setValue('');
    await search.find('form').trigger('submit');

    // Assert
    const cards = wrapper.findAllComponents(Productcard);
    expect(wrapper.vm.searchTerm).toEqual('');
    expect(cards).toHaveLength(11);
  });
});
