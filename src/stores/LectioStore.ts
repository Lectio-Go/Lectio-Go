import {observable, computed, action} from 'mobx';
import * as Keychain from 'react-native-keychain';
import {AuthenticatedUser, GetAllSchools, ISchool, GetBriefTimetable} from 'liblectio';
import {LectioRequest} from 'liblectio/lib/LectioRequest';
import {RNRequest} from '../RNLectioRequest';
import { Lesson } from 'liblectio/lib/Skema/Timetable';
import { cos } from 'react-native-reanimated';



export default class LectioStore {
  @observable username: string = "";
  @observable password: string = "";
  @observable school: number = -1;
  
  @observable signedIn: boolean = false;

  @observable user: AuthenticatedUser = new AuthenticatedUser('', '', '');
  @observable requestHelper: LectioRequest = new RNRequest();


  @observable schoolList: ISchool[] = [];
  @action async GetSchoolList() {
    this.schoolList = await GetAllSchools();
  }

  @observable lessonList: Lesson[] = [];
  @action async GetBriefLessonList(year: number, week: number) {
    // We should check whether we are logged in before making an api request
    this.lessonList = await (await GetBriefTimetable(this.user, this.requestHelper, year, week)).lessons;
  }

  async isLoggedIn(): Promise<boolean> {
    console.log("Hello")
    const credentials = await Keychain.getGenericPassword();
    if(credentials) {
      console.log("Passwword: " + credentials.password)
      this.username = JSON.parse(credentials.username)[0];
      this.password = credentials.password;
      this.school = JSON.parse(credentials.username)[1];
      this.signedIn = true;

      this.user = new AuthenticatedUser(
        this.username,
        this.password,
        String(this.school)
      );
      return true;
    }
    console.log("Flase")


    return false;
  }

  @action async login(): Promise<string> {
    this.user = new AuthenticatedUser(
      this.username,
      this.password,
      String(this.school)
    );

    return new Promise((resolve) => {
      this.user.Authenticate(this.requestHelper).then(async ()=> {
        this.signedIn = true;
        // Since generic password only can store username and password, we put the school id into the username
        await Keychain.setGenericPassword(JSON.stringify([this.username, this.school]), this.password);
        resolve('success');
      }).catch(error => {
        resolve(`ERROR: ${error.message}`);
      });
    });
  }

  @action async indlæsLectioSkema() {
    try {
      throw new Error('indlæsLectioSkema is not Implemented');
    } catch (e) {
      console.log(e);
    }
  }
}
