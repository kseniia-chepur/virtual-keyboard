import keys from './components/keys.js';
import Keyboard from './components/keyboard.js';

const VirtualKeyboard = new Keyboard(keys);
VirtualKeyboard.init();
VirtualKeyboard.triggerEvent();
