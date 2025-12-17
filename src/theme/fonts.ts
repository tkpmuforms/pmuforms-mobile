export const Fonts = {
  ExtraLight: 'RedditSans-ExtraLight',
  Light: 'RedditSans-Light',
  Regular: 'RedditSans-Regular',
  Medium: 'RedditSans-Medium',
  SemiBold: 'RedditSans-SemiBold',
  Bold: 'RedditSans-Bold',
  ExtraBold: 'RedditSans-ExtraBold',
  Black: 'RedditSans-Black',

  ExtraLightItalic: 'RedditSans-ExtraLightItalic',
  LightItalic: 'RedditSans-LightItalic',
  Italic: 'RedditSans-Italic',
  MediumItalic: 'RedditSans-MediumItalic',
  SemiBoldItalic: 'RedditSans-SemiBoldItalic',
  BoldItalic: 'RedditSans-BoldItalic',
  ExtraBoldItalic: 'RedditSans-ExtraBoldItalic',
  BlackItalic: 'RedditSans-BlackItalic',
};

export const FontAliases = {
  GeneralFont: Fonts.Regular,
  RegularFont: Fonts.Regular,
  ThinFont: Fonts.ExtraLight,
  LightFont: Fonts.Light,
  MediumFont: Fonts.Medium,
  BoldFont: Fonts.Bold,
  ExtraBoldFont: Fonts.ExtraBold,
  ExtraLightFont: Fonts.ExtraLight,
};

export const defaultFont = Fonts.Regular;

export const getFontFamily = (weight?: string | number): string => {
  const numericWeight =
    typeof weight === 'string' ? parseInt(weight, 10) : weight;

  switch (numericWeight) {
    case 100:
    case 200:
      return Fonts.ExtraLight;
    case 300:
      return Fonts.Light;
    case 400:
    case undefined:
      return Fonts.Regular;
    case 500:
      return Fonts.Medium;
    case 600:
      return Fonts.SemiBold;
    case 700:
      return Fonts.Bold;
    case 800:
      return Fonts.ExtraBold;
    case 900:
      return Fonts.Black;
    default:
      return Fonts.Regular;
  }
};
