import {observable, computed, action} from 'mobx';
import {Appearance, ColorSchemeName} from 'react-native-appearance';
import {StyleSheet} from 'react-native';
import {DarkTheme, DefaultTheme, Theme} from '@react-navigation/native';
import { NavigationScreenProp } from 'react-navigation';

export interface Colors {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
    skemaRubrik: string;
};

export interface ThemeProps {
    theme: ThemeStore;
    navigation: NavigationScreenProp<any, any>;
}

export default class ThemeStore {
  constructor() {
    this.colorscheme = Appearance.getColorScheme();
    if (this.colorscheme === 'dark') {
      this.theme = DarkTheme;
    } else {
      this.theme = DefaultTheme;
    }
    this.colors = {...this.theme.colors, skemaRubrik: "#0080FF"}

    // Listen to check if colorscheme has changed
    setInterval(()=>{
        this.UpdateColorScheme();
    }, 100)
  }

  @action UpdateColorScheme() {
    const colorscheme = Appearance.getColorScheme();
    if (this.colorscheme !== colorscheme) {
      this.colorscheme = colorscheme;
      this.theme = colorscheme === 'dark'? DarkTheme : DefaultTheme;
      this.colors = {...this.theme.colors}
    }
  }

  // Themes
  @observable theme: Theme = DefaultTheme;
  @observable colorscheme: ColorSchemeName;
  @observable colors: Colors = DefaultTheme.colors;
  @computed get styles() {
    return StyleSheet.create({
      button: {
        color: this.colors.text,
        height: 40,
      },
    });
  }
}
