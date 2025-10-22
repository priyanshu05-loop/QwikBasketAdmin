import { Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';


const { width } = Dimensions.get('window');

// --- COLOR PALETTE FOR QWIKBASKET ADMIN ---

export const colors = {
  // Primary Colors
  primary: '#2D5A5B', // The main blue for buttons and highlights
  primaryLight: '#E9F2FC', // Light blue for backgrounds and highlights
  primaryDark: '#3A77C4',
  
  // Accent & Status Colors
  accent: '#42C42B', // A bright teal/green for 'Verified' status
  warning: '#F34447', // Orange for 'Pending' status
  danger: '#D0021B', // Red for 'Delete' actions

  // Greyscale
  text: '#4A4A4A',      // Main text color
  textLight: '#9B9B9B',  // Lighter text for subtitles, placeholders
  textDark: '#000000',    // For titles and important text
  
  white: '#FFFFFF',
  black: '#000000',

  // Backgrounds & Borders
  background: '#F7F8FA', // The main light grey background of the app
  surface: '#FFFFFF',    // For cards, inputs, and modals
  border: '#E4E4E4',      // Borders for inputs, dividers
  
  // Specific UI elements
  icon: '#4A90E2',
  iconLight: '#9B9B9B',
};


export const typography = {
  

  titleBold: (height) => ({
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: RFValue(18, height),
  }),
  paragraphRegular: (height) => ({
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    fontSize: RFValue(14, height),
  }),
  paragraphMedium: (height) => ({
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    fontSize: RFValue(14, height),
  }),
  label: (height) => ({
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    fontSize: RFValue(12, height),
  }),
  button: (height) => ({
    fontFamily: 'Poppins-Medium',
    fontWeight: '700',
    fontSize: RFValue(14, height),
  }),

  // Customers Screen Small text
  paragraphMedium1: (height) => ({
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    fontSize: RFValue(7, height),
  }),
  titleBold1: (height) => ({
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: RFValue(8, height),
  }),
  paragraphRegular1: (height) => ({
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    fontSize: RFValue(8, height),
  }),
  label1: (height) => ({
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    fontSize: RFValue(7, height),
  }),

};



// --- SIZING & SPACING ---
export const SIZES = {
  // global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  // font sizes
  h1: 30,
  h2: 22,
  h3: 16,
  h4: 14,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,

  // app dimensions
  width,

};

const appTheme = { colors, typography, SIZES };

export default appTheme;
