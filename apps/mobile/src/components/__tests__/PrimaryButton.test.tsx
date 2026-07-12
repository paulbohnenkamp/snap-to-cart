import { fireEvent, render } from '@testing-library/react-native'; import { PrimaryButton } from '../PrimaryButton';
test('invokes press handler',()=>{const onPress=jest.fn();const x=render(<PrimaryButton title="Add" onPress={onPress}/>);fireEvent.press(x.getByText('Add'));expect(onPress).toHaveBeenCalledTimes(1)});
