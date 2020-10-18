import {observable, computed, action} from 'mobx';
import {AuthenticatedUser, ISchool} from 'liblectio';
import {LectioRequest} from 'liblectio/lib/LectioRequest';
import {RNRequest} from '../RNLectioRequest';
import {Appearance, ColorSchemeName} from 'react-native-appearance';
import {StyleSheet} from 'react-native';
import {DarkTheme, DefaultTheme, Theme} from '@react-navigation/native';

export default class LectioStore {
  constructor() {
    this.colorscheme = Appearance.getColorScheme();
    if (this.colorscheme === 'dark') {
      this.colors = DarkTheme;
    } else {
      this.colors = DefaultTheme;
    }
  }

  // Themes
  @observable colorscheme: ColorSchemeName;
  @observable colors: Theme = DefaultTheme;
  @computed get styles() {
    return StyleSheet.create({
      button: {
        color: this.colors.colors.text,
        height: 40,
      },
    });
  }

  // Lectio
  @observable school: ISchool = {id: '-1', name: 'Select School'};
  @observable user: AuthenticatedUser = new AuthenticatedUser('', '', '');
  @observable requestHelper: LectioRequest = new RNRequest();

  @action async login() {
    // this.user = new AuthenticatedUser(
    //   this.username,
    //   this.password,
    //   this.school.id,
    // );
    // await this.user.Authenticate(this.requestHelper);
  }

  @action async indlæsLectioSkema() {
    try {
      throw new Error('indlæsLectioSkema is not Implemented');
    } catch (e) {
      console.log(e);
    }
  }
}
