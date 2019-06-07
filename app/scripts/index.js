import  "./markup-menu";

import Popups from './components/popups';
import Select from './components/select';

document.addEventListener("DOMContentLoaded", () => {
  global.customePopups = new Popups();
  global.customeSelect = new Select();
});