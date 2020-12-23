import { mount } from '@vue/test-utils';
import ProductList from '.';
import Productcard from '@/components/Productcard';
import Search from '@/components/Search';

describe('ProductList - Integration', () => {
  it('Should mount the component', () => {
    const wrapper = mount(ProductList);
    expect(wrapper.vm).toBeDefined();
  });
  it('Should mount Search component as a child', () => {
    const wrapper = mount(ProductList);
    expect(wrapper.findComponent(Search)).toBeDefined();
  });
  it('Should mount Productcard component as a child', () => {
    const wrapper = mount(ProductList);
    expect(wrapper.findComponent(Productcard)).toBeDefined();
  });
  it('Should mount Productcard component 10 times', () => {
    const wrapper = mount(ProductList);
    const cards = wrapper.findAllComponents(Productcard);
    expect(cards).toHaveLength(10);
  });
});
