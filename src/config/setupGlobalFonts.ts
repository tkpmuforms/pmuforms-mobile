import { Text, TextInput } from 'react-native';
import { Fonts } from '../theme/fonts';

// Setup global default fonts for the app
export const setupGlobalFonts = () => {
  // Set default props for Text component
  // @ts-ignore
  const TextRender = Text.render;
  // @ts-ignore
  const TextInputRender = TextInput.render;

  // @ts-ignore
  Text.render = function render(props, ref) {
    return TextRender.call(
      this,
      {
        ...props,
        style: [{ fontFamily: Fonts.Regular }, props.style],
      },
      ref,
    );
  };

  // @ts-ignore
  TextInput.render = function render(props, ref) {
    return TextInputRender.call(
      this,
      {
        ...props,
        style: [{ fontFamily: Fonts.Regular }, props.style],
      },
      ref,
    );
  };
};
