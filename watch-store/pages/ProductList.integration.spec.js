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
  });

  it('Should mount the component', () => {
    const wrapper = mount(ProductList);
    expect(wrapper.vm).toBeDefined();
  });
  it('Should call axios.get when mount the component', () => {
    mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    });
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('/api/products');
  });
  it('Should mount Search component as a child', () => {
    const wrapper = mount(ProductList);
    expect(wrapper.findComponent(Search)).toBeDefined();
  });
  it('Should mount Productcard component as a child', () => {
    const wrapper = mount(ProductList);
    expect(wrapper.findComponent(Productcard)).toBeDefined();
  });
  it('Should mount Productcard component 10 times', async () => {
    // MirageJs create the objects
    const products = server.createList('product', 10);
    // Mock the axios results with the objects
    axios.get.mockReturnValue(Promise.resolve({ data: { products } }));
    // Create the componets
    const wrapper = mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    });
    // Give time to vue rendereing the component
    await Vue.nextTick();
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
  fit('filter the product list when search is perform', async () => {
    // Arrange
    const products = [
      ...server.createList('product', 10),
      server.create('product', {
        title: 'Meu relógio amado',
      }),
      server.create('product', {
        title: 'Meu outro relógio estimado',
      }),
    ];
    axios.get.mockReturnValue(Promise.resolve({ data: { products } }));

    const wrapper = mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    });

    await Vue.nextTick();

    // Act
    const search = wrapper.findComponent(Search);
    search.find('input[type="search"]').setValue('relógio');
    await search.find('form').trigger('submit');

    // Assert
    const cards = wrapper.findAllComponents(Productcard);
    expect(wrapper.vm.searchTerm).toEqual('relógio');
    expect(cards).toHaveLength(2);
  });
});
