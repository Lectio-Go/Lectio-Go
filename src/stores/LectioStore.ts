import {observable, computed, action} from 'mobx';
import {AuthenticatedUser, GetAllSchools, ISchool, GetBriefTimetable} from 'liblectio';
import {LectioRequest} from 'liblectio/lib/LectioRequest';
import {RNRequest} from '../RNLectioRequest';
export default class LectioStore {
  @observable school: number = -1; // This is a spaghetti demon
  @observable signedIn: boolean = false;
  @observable user: AuthenticatedUser = new AuthenticatedUser('', '', '');
  @observable requestHelper: LectioRequest = new RNRequest();

  @observable schoolList: ISchool[] = [];

  @action async GetSchoolList() {
    this.schoolList = await GetAllSchools();
  }

  @action async login(username: string, password: string, schoolID: string): Promise<string> {
    this.user = new AuthenticatedUser(
      username,
      password,
      schoolID
    );

    return new Promise((resolve) => {
      this.user.Authenticate(this.requestHelper).then(()=> {
        this.signedIn = true;
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
