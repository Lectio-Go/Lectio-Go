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
    skemaRubrik?: string;
    greyText?: string;
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
      this.colors = {...this.theme.colors, greyText: "#aaaaaa"}
    } else {
      this.theme = DefaultTheme;
      this.colors = {...this.theme.colors, greyText: "#909090"}
    }
    this.colors = {...this.colors, skemaRubrik: "#0080FF"}
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
        backgroundColor: this.colors.primary,
      },
      SkemaBrikAflyst: {
        backgroundColor: "#FF0000"
      }
    });
  }
}
