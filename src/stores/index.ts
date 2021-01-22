import LectioStore from './LectioStore';
import ThemeStore from './ThemeStore';

const lectioStore = new LectioStore();
const themeStore = new ThemeStore();

export default {
  lectio: lectioStore,
  theme: themeStore
};
