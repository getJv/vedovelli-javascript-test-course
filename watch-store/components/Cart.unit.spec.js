import { mount } from '@vue/test-utils';
import Cart from '@/components/Cart';

describe('Cart', () => {
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
});
