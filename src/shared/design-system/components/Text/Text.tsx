import { Text as RNText } from 'react-native';

import { useTheme } from '../../hooks/use-theme';
import type { DSTextProps } from './Text.types';

export function Text({
  variant = 'body',
  color = 'primary',
  colorValue,
  style,
  ...rest
}: DSTextProps) {
  const theme = useTheme();

  const resolvedColor = colorValue ?? theme.colors.text[color];
  const typographyStyle = theme.typography[variant];

  return (
    <RNText
      style={[
        typographyStyle,
        { color: resolvedColor },
        style,
      ]}
      {...rest}
    />
  );
}
