export default class Keyboard {
  constructor(keys) {
    this.keys = keys;
    this.lang = localStorage.getItem('lang') || 'en';
    this.isShift = false;
    this.isCapsLock = false;
    this.switchLanguageCombination = new Set();
  }

  init() {
    this.createTextarea();
    this.createKeyboard();
    this.createInfoMsg();
  }

  createTextarea() {
    this.textarea = document.createElement('textarea');
    this.textarea.classList.add('textarea');
    document.body.appendChild(this.textarea);
  }

  createKeyboard() {
    this.keyboard = document.createElement('div');
    this.keyboard.classList.add('keyboard');
    document.body.appendChild(this.keyboard);
    this.createButtons();
  }

  createInfoMsg() {
    this.info = document.createElement('p');
    this.info.innerHTML = 'Virtual keyboard for Windows, switch between languages: Ctrl + Shift';
    this.info.classList.add('info');
    document.body.appendChild(this.info);
  }

  createButtons() {
    Object.keys(this.keys).forEach((key) => {
      const button = this.keys[key];
      const value = button.isSystem ? button.systemValue : button[this.lang][this.isShift ? 'shiftValue' : 'defaultValue'];

      const btnElement = document.createElement('div');
      btnElement.classList.add('btn', key, button.systemValue ? 'system' : 'regular');
      btnElement.innerText = value;

      btnElement.addEventListener('mousedown', (e) => {
        e.preventDefault();
        this.textarea.focus();

        btnElement.classList.add('active');
        if (button.isSystem) {
          this.action(button.systemValue);
        } else {
          this.updateValue(e.currentTarget.innerText);
        }
      });

      btnElement.addEventListener('mouseup', () => {
        btnElement.classList.remove('active');
        if (button.systemValue === 'Shift') {
          this.setShiftState();
        }
      });

      this.keyboard.appendChild(btnElement);
    });
  }

  updateButtons() {
    Object.keys(this.keys).forEach((key) => {
      const button = this.keys[key];
      const value = button.isSystem ? button.systemValue : button[this.lang][this.isShift ? 'shiftValue' : 'defaultValue'];

      const btnElement = this.keyboard.querySelector(`.${key}`);
      btnElement.innerText = this.isCapsLock && !button.isSystem ? value.toUpperCase() : value;
      if (button.systemValue === 'CapsLock' && this.isCapsLock === true) {
        const indicator = document.createElement('div');
        btnElement.appendChild(indicator);
        indicator.classList.add('indicator');
      }
    });
  }

  action(systemValue) {
    if (systemValue === 'Backspace') {
      this.backspace();
    } else if (systemValue === 'Tab') {
      this.updateValue('\t');
    } else if (systemValue === 'CapsLock') {
      this.setCapsLockState();
    } else if (systemValue === 'Enter') {
      this.updateValue('\n');
    } else if (systemValue === 'Shift') {
      this.setShiftState();
    } else if (systemValue === '') {
      this.updateValue(' ');
    } else if (systemValue === 'Delete') {
      this.del();
    }
  }

  setCapsLockState() {
    this.isCapsLock = !this.isCapsLock;
    this.updateButtons();
  }

  setShiftState() {
    this.isShift = !this.isShift;
    this.updateButtons();
  }

  updateValue(newValue) {
    this.textarea.setRangeText(newValue, this.textarea.selectionStart, this.textarea.selectionEnd, 'end');
  }

  backspace() {
    this.textarea.setRangeText('', this.textarea.selectionStart - 1, this.textarea.selectionEnd, 'end');
  }

  del() {
    this.textarea.setRangeText('', this.textarea.selectionStart, this.textarea.selectionEnd + 1, 'end');
  }

  triggerEvent() {
    document.addEventListener('keydown', (e) => {
      e.preventDefault();
      this.textarea.focus();

      const button = this.keyboard.querySelector(`.${e.code}`);
      button.dispatchEvent(new MouseEvent('mousedown'));
      if ((e.key === 'Control' || e.key === 'Shift')) {
        this.switchLanguageCombination.add(e.key);
      }
    });

    document.addEventListener('keyup', (e) => {
      e.preventDefault();

      const button = this.keyboard.querySelector(`.${e.code}`);
      button.dispatchEvent(new MouseEvent('mouseup'));

      if (this.switchLanguageCombination.size === 2) {
        this.switchLanguage();
      }
      this.switchLanguageCombination.clear();
    });
  }

  switchLanguage() {
    const newLang = this.lang === 'en' ? 'ru' : 'en';
    localStorage.setItem('lang', newLang);
    this.lang = localStorage.getItem('lang');
  }
}
