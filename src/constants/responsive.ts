import { Dimensions, Platform } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const { width } = Dimensions.get('window');


const isDesktopWeb = Platform.OS === 'web' && width > 768;

export const l = (size: number) => isDesktopWeb ? size : scale(size);
export const a = (size: number) => isDesktopWeb ? size : verticalScale(size);
export const td = (size: number, factor = 0.5) => isDesktopWeb ? size : moderateScale(size, factor);