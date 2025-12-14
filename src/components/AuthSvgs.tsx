import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

interface SvgButtonProps {
  onPress?: () => void;
  width?: number;
  height?: number;
}

export const GoogleLoginButton: React.FC<SvgButtonProps> = ({
  onPress,
  width = 56,
  height = 56,
}) => {
  return (
    <View style={styles.buttonContainer}>
      <Svg
        width={width}
        height={height}
        viewBox="0 0 56 56"
        fill="none"
        onPress={onPress}
      >
        <Rect width="56" height="56" rx="8" fill="#E2E8F0" />
        <G>
          {/* Google "G" logo */}
          <Path
            d="M28 20C23.6 20 20 23.6 20 28C20 32.4 23.6 36 28 36C32.4 36 36 32.4 36 28C36 23.6 32.4 20 28 20Z"
            fill="#fff"
          />
          <Path
            d="M28 22.4C25.2 22.4 22.8 24.8 22.8 27.6C22.8 30.4 25.2 32.8 28 32.8C30.8 32.8 33.2 30.4 33.2 27.6C33.2 24.8 30.8 22.4 28 22.4Z"
            fill="#4285F4"
          />
          <Path
            d="M28 24C29.1 24 30 24.9 30 26C30 27.1 29.1 28 28 28C26.9 28 26 27.1 26 26C26 24.9 26.9 24 28 24Z"
            fill="#FBBC05"
          />
        </G>
      </Svg>
    </View>
  );
};

export const AppleLoginButton: React.FC<SvgButtonProps> = ({
  onPress,
  width = 56,
  height = 56,
}) => {
  return (
    <View style={styles.buttonContainer}>
      <Svg
        width={width}
        height={height}
        viewBox="0 0 56 56"
        fill="none"
        onPress={onPress}
      >
        <Rect width="56" height="56" rx="8" fill="#000" />
        <G>
          {/* Apple logo - simplified */}
          <Path
            d="M28 18C28 18 24 22 24 26C24 30 26.7 32 28 32C29.3 32 32 30 32 26C32 22 28 18 28 18Z"
            fill="#fff"
          />
          <Circle cx="25" cy="32" r="1.5" fill="#fff" />
          <Circle cx="31" cy="32" r="1.5" fill="#fff" />
        </G>
      </Svg>
    </View>
  );
};

export const FacebookLoginButton: React.FC<SvgButtonProps> = ({
  onPress,
  width = 56,
  height = 56,
}) => {
  return (
    <View style={styles.buttonContainer}>
      <Svg
        width={width}
        height={height}
        viewBox="0 0 56 56"
        fill="none"
        onPress={onPress}
      >
        <Rect width="56" height="56" rx="8" fill="#1877F2" />
        <Path
          d="M32 18H30C27.79 18 26 19.79 26 22V24H24V27H26V36H29V27H31L32 24H29V22C29 21.45 29.45 21 30 21H32V18Z"
          fill="#fff"
        />
      </Svg>
    </View>
  );
};

export const LockIconSvg: React.FC<{ width?: number; height?: number }> = ({
  width = 20,
  height = 20,
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 1C6.48 1 2 5.48 2 11V20C2 21.1 2.9 22 4 22H20C21.1 22 22 21.1 22 20V11C22 5.48 17.52 1 12 1Z"
        fill="none"
        stroke="#8e2d8e"
        strokeWidth="2"
      />
      <Path
        d="M7 11C7 8.24 9.24 6 12 6C14.76 6 17 8.24 17 11"
        fill="none"
        stroke="#8e2d8e"
        strokeWidth="2"
      />
      <Circle cx="12" cy="15" r="1.5" fill="#8e2d8e" />
    </Svg>
  );
};

export const EyeIconSvg: React.FC<{
  width?: number;
  height?: number;
  visible: boolean;
}> = ({ width = 20, height = 20, visible }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      {visible ? (
        <>
          <Path
            d="M12 5C7 5 2.73 8.11 1 12.46C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.46C21.27 8.11 17 5 12 5Z"
            stroke="#64748b"
            strokeWidth="2"
            fill="none"
          />
          <Circle cx="12" cy="12" r="2.5" fill="#64748b" />
        </>
      ) : (
        <>
          <Path
            d="M1 12C1 12 5 5 12 5C19 5 23 12 23 12"
            stroke="#64748b"
            strokeWidth="2"
            fill="none"
          />
          <Path
            d="M1 12C1 12 5 19 12 19C19 19 23 12 23 12"
            stroke="#64748b"
            strokeWidth="2"
            fill="none"
          />
          <Path d="M3 3L21 21" stroke="#64748b" strokeWidth="2" fill="none" />
        </>
      )}
    </Svg>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
