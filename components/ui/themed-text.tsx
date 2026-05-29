import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'onTint';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const themeColor = useThemeColor({}, 'text');
  const tintContrast = useThemeColor({}, 'tintContrast');
  const linkColor = useThemeColor({}, 'link');
  const color =
    lightColor ??
    darkColor ??
    (type === 'onTint' ? tintContrast : type === 'link' ? linkColor : themeColor);

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'onTint' ? styles.onTint : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: Fonts.mono,
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontFamily: Fonts.monoSemiBold,
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontFamily: Fonts.monoBold,
    fontSize: 32,
    lineHeight: 32,
  },
  subtitle: {
    fontFamily: Fonts.monoSemiBold,
    fontSize: 20,
  },
  link: {
    fontFamily: Fonts.mono,
    lineHeight: 30,
    fontSize: 16,
  },
  onTint: {
    fontFamily: Fonts.monoSemiBold,
    fontSize: 16,
    lineHeight: 24,
  },
});
