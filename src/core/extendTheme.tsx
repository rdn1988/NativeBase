import { theme as defaultTheme, Theme } from './../theme';
import mergeWith from 'lodash.mergewith';
// import { updateComponentThemeMap } from '../utils/styled';

function isFunction(value: any): boolean {
  return typeof value === 'function';
}

type ThemeUtil = Theme | (Record<string, any> & {});

// function resolveComponentThemeAndUpdateMap(theme: any) {
//   if (theme.components) {
//     // Object.keys(theme.components).map((key?: string) => {
//     //   // updateComponentThemeMap(key, theme.components[key]);
//     // });
//   }
// }
export function extendTheme<T extends ThemeUtil>(
  overrides: T,
  ...restOverrides: T[]
) {
  function customizer(source: any, override: any) {
    if (isFunction(source)) {
      return (...args: any[]) => {
        const sourceValue = source(...args);
        const overrideValue = isFunction(override)
          ? override(...args)
          : override;
        return mergeWith({}, sourceValue, overrideValue, customizer);
      };
    }
    return undefined;
  }

  const finalOverrides = [overrides, ...restOverrides].reduce(
    (prevValue, currentValue) => {
      // console.log(prevValue, currentValue, 'value');
      // resolveComponentThemeAndUpdateMap(currentValue);
      return mergeWith({}, prevValue, currentValue, customizer);
    },
    defaultTheme
  );

  return finalOverrides as T & Theme;
}
