/**
 * DailyDiary App Color Scheme
 *
 * Palette:
 * - Primary: #660B05
 * - Dark:    #3E0703
 * - Accent:  #8C1007
 * - Cream:   #FFF0C4
 */

const tintColorLight = '#660B05'; // primary
const tintColorDark = '#FFF0C4';  // cream

export const Colors = {
    palette: {
        primary: '#660B05',
        dark: '#3E0703',
        accent: '#8C1007',
        cream: '#FFF0C4',
    },

    light: {
        text: '#3E0703',          // dark text on cream
        background: '#FFF0C4',    // cream bg
        tint: tintColorLight,
        icon: '#8C1007',
        tabIconDefault: '#8C1007',
        tabIconSelected: tintColorLight,
    },

    dark: {
        text: '#FFF0C4',          // cream text on dark bg
        background: '#3E0703',    // dark bg
        tint: tintColorDark,
        icon: '#8C1007',
        tabIconDefault: '#8C1007',
        tabIconSelected: tintColorDark,
    },
};
