import { Dimensions } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

export const WINDOW_WIDTH = Dimensions.get('window').width;

export const AXIS_WIDTH = scale(30);
export const COLUMN_WIDTH = scale(140);
export const HEADER_HEIGHT = verticalScale(40);