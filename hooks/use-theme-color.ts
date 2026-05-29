import { Colors } from '@/constants/theme';

type ColorKey = keyof typeof Colors;

export function useThemeColor(
  _props: { light?: string; dark?: string },
  colorName: ColorKey
): string {
  return Colors[colorName];
}
