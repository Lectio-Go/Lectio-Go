import {observable, computed, action} from 'mobx';
import {Appearance, ColorSchemeName} from 'react-native-appearance';
import {StyleSheet} from 'react-native';
import {DarkTheme, DefaultTheme, Theme} from '@react-navigation/native';
import { NavigationScreenProp } from 'react-navigation';
import SkemaBrik from '../components/skema/SkemaBrik';

export interface Colors {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
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
    this.colors = {...this.theme.colors}

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
  @observable colors: Colors = {...DefaultTheme.colors};
  @computed get styles() {
    return StyleSheet.create({
      button: {
        color: this.colors.text,
        height: 40,
      },
      SkemaBrik: {
        borderRadius: 7,
        padding: 7,
        backgroundColor: "#0080FF",
      },
      SkemaBrikAflyst: {
        backgroundColor: "#FF0000"
      }
    });
  }
}
