export const Platform = {
  OS: 'ios' as const,
  select: (obj: Record<string, unknown>) => obj['ios'] ?? obj['default'],
  Version: 16,
};

export const StyleSheet = {
  create: <T extends Record<string, unknown>>(styles: T): T => styles,
  flatten: (style: unknown) => style,
  hairlineWidth: 1,
  absoluteFill: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
};

export const Dimensions = {
  get: (_dim: 'window' | 'screen') => ({ width: 390, height: 844, scale: 3, fontScale: 1 }),
  addEventListener: () => ({ remove: () => {} }),
};

export const AppState = {
  currentState: 'active',
  addEventListener: () => ({ remove: () => {} }),
};

export const I18nManager = {
  isRTL: false,
};

// No-op component factory — returns a function component that renders null.
// Used for all RN primitive components (View, Text, Pressable, etc.).
const noop = () => null;

export const View = noop;
export const Text = noop;
export const TextInput = noop;
export const Image = noop;
export const ScrollView = noop;
export const FlatList = noop;
export const SectionList = noop;
export const Modal = noop;
export const Pressable = noop;
export const TouchableOpacity = noop;
export const TouchableHighlight = noop;
export const TouchableWithoutFeedback = noop;
export const ActivityIndicator = noop;
export const Switch = noop;
export const Slider = noop;
export const KeyboardAvoidingView = noop;
export const SafeAreaView = noop;
export const RefreshControl = noop;

export const Animated = {
  View: noop,
  Text: noop,
  Image: noop,
  ScrollView: noop,
  Value: class {
    _value: number;
    constructor(value: number) { this._value = value; }
    setValue(v: number) { this._value = v; }
    addListener() { return { id: '0' }; }
    removeListener() {}
    interpolate() { return this; }
  },
  ValueXY: class {
    x = { _value: 0 };
    y = { _value: 0 };
  },
  timing: () => ({ start: (cb?: () => void) => cb?.(), stop: () => {} }),
  spring: () => ({ start: (cb?: () => void) => cb?.(), stop: () => {} }),
  decay: () => ({ start: (cb?: () => void) => cb?.(), stop: () => {} }),
  sequence: () => ({ start: (cb?: () => void) => cb?.(), stop: () => {} }),
  parallel: () => ({ start: (cb?: () => void) => cb?.(), stop: () => {} }),
  loop: () => ({ start: (cb?: () => void) => cb?.(), stop: () => {} }),
  createAnimatedComponent: (c: unknown) => c,
  event: () => () => {},
};

export const Keyboard = {
  dismiss: () => {},
  addListener: () => ({ remove: () => {} }),
};

export const Alert = {
  alert: () => {},
};

export const Linking = {
  openURL: () => Promise.resolve(),
  canOpenURL: () => Promise.resolve(true),
  getInitialURL: () => Promise.resolve(null),
  addEventListener: () => ({ remove: () => {} }),
};

export const Vibration = {
  vibrate: () => {},
  cancel: () => {},
};

export const useColorScheme = () => 'light';
export const useWindowDimensions = () => ({ width: 390, height: 844, scale: 3, fontScale: 1 });

export default {
  Platform,
  StyleSheet,
  Dimensions,
  AppState,
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  FlatList,
  SectionList,
  Modal,
  Pressable,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Switch,
  Slider,
  KeyboardAvoidingView,
  SafeAreaView,
  RefreshControl,
  Animated,
  Keyboard,
  Alert,
  Linking,
  Vibration,
  I18nManager,
  useColorScheme,
  useWindowDimensions,
};
