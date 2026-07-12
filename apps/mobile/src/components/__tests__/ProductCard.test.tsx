import { fireEvent, render } from '@testing-library/react-native';
import { ProductCard } from '../ProductCard';

jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));

test('exposes and toggles its selected state', () => {
  const onToggle = jest.fn();
  const view = render(
    <ProductCard
      product={{ id: '1', brand: 'Simple Truth', name: 'Breakfast Sausage', confidence: 0.98, selected: true }}
      onToggle={onToggle}
    />,
  );

  const checkbox = view.getByRole('checkbox');
  expect(checkbox.props.accessibilityState).toEqual({ checked: true });
  expect(view.getByText('Selected')).toBeTruthy();
  fireEvent.press(checkbox);
  expect(onToggle).toHaveBeenCalledTimes(1);
});
