import { useWindowDimensions, Platform } from 'react-native';

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();

  const isSmallPhone = width < 380;
  const isPhone = width < 600;
  const isTablet = width >= 600;
  const isLandscape = height < width;
  const isPortrait = height > width;

  return {
    width,
    height,
    isSmallPhone,
    isPhone,
    isTablet,
    isLandscape,
    isPortrait,
    isAndroid: Platform.OS === 'android',
    isIOS: Platform.OS === 'ios',
  };
};

export const useResponsiveSize = () => {
  const { width } = useWindowDimensions();

  return {
    fontSize: {
      xs: width < 380 ? 11 : 12,
      sm: width < 380 ? 12 : 13,
      base: width < 380 ? 14 : 16,
      lg: width < 380 ? 16 : 18,
      xl: width < 380 ? 18 : 20,
      '2xl': width < 380 ? 20 : 24,
    },

    spacing: {
      xs: width < 380 ? 4 : 6,
      sm: width < 380 ? 6 : 8,
      md: width < 380 ? 8 : 12,
      lg: width < 380 ? 12 : 16,
      xl: width < 380 ? 16 : 24,
    },
    cardWidth: width < 380 ? width - 24 : width - 32,
    buttonHeight: 44,
    buttonBorderRadius: 8,
  };
};
