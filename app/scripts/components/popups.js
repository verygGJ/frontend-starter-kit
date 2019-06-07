if (!Array.from) {
  Array.from = (function fn1() {
    const toStr = Object.prototype.toString;
    const isCallable = function fn2(fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    const toInteger = function fn3(value) {
      const number = Number(value);
      if (isNaN(number)) { 
        return 0; 
      }
      if (number === 0 || !isFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    const maxSafeInteger = Math.pow(2, 53) - 1;
    const toLength = function fn4(value) {
      const len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };
    return function from(arrayLike) {
      const C = this;
      const items = Object(arrayLike);
      if (arrayLike == null) {
        throw new TypeError('Array.from requires an array-like object - not null or undefined');
      }
      let mapFn = arguments[1];
      if (typeof mapFn !== 'undefined') {
        mapFn = arguments.length > 1 ? arguments[1] : undefined;
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }
        if (arguments.length > 2) {
          const T = arguments[2];
        }
      }
      const len = toLength(items.length);
      const A = isCallable(C) ? Object(new C(len)) : new Array(len);
      let k = 0;
      let kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      A.length = len;
      return A;
    };
  }());
}

class Popups {
  constructor(options) {
    const defaultOption = {
      htmlBlock: 'html',
      bodyBlock: 'body',
      popupActiveClassName: 'active',
      popupLinkDataAttr: 'data-for',
      popupLinkSelector: '.popup-open',
      popupSelector: '.popup',
      closeButtonSelector: '.popup__close',
      popupOverlaySelector: '.popup__overlay',
      bugIOSClassName: 'iosBugFixCaret',
    };
    this.options = {
      ...defaultOption,
      ...options
    };
    return this.init(this.options);
  }

  init(options) {
    const popupOpen = () => {
      const popupInner = document.querySelectorAll(options.popupSelector);
      const link = document.querySelectorAll(options.popupLinkSelector);
      link.forEach((option) => {
        const data = option.getAttribute(options.popupLinkDataAttr);
        const popupElement = document.querySelector(`.${data}`);
        if (popupElement) {
          option.addEventListener('click', (event) => {
            event.preventDefault();
            popupInner.forEach(popupInnerElement => {
              popupInnerElement.classList.remove(options.popupActiveClassName);
              this.popupOverlaySelectorDestroy();
              this.iosRemoveClass();
            });
            popupElement.classList.toggle(options.popupActiveClassName);
            this.popupOverlaySelectorActive();
          });
        }
      });
    }
    Array.from(`[${options.popupLinkSelector[options.popupLinkDataAttr]}]`).forEach(popupOpen); 
    this.popupClose();
  }

  popupOverlaySelectorActive() {
    const htmlBlock = document.querySelector(this.options.htmlBlock);
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    htmlBlock.style.marginRight = `${scrollbarWidth}px`;
    htmlBlock.style.overflow = 'hidden';
  }

  popupOverlaySelectorDestroy() {
    const htmlBlock = document.querySelector(this.options.htmlBlock);
    htmlBlock.removeAttribute('style');
  }

  iosRemoveClass() {
    const bodyBlock =  document.querySelector(this.options.bodyBlock);
    bodyBlock.classList.remove(this.options.bugIOSClassName);
  }

  popupCloseButton() {
    const popupSelector = document.querySelectorAll(this.options.popupSelector);
    const close = document.querySelectorAll(this.options.closeButtonSelector);
    close.forEach(closeElement => {
      closeElement.addEventListener('click', () => {
        popupSelector.forEach(popupSelectorElement => {
          popupSelectorElement.classList.remove(this.options.popupActiveClassName);
          this.popupOverlaySelectorDestroy();
          this.iosRemoveClass();
        });
      });
    });
  }

  popupCloseOverlay() {
    const popupSelector = document.querySelectorAll(this.options.popupSelector);
    const popupOverlaySelectors = document.querySelectorAll(this.options.popupOverlaySelector);
    popupOverlaySelectors.forEach(popupOverlaySelectorsElement => {
      popupOverlaySelectorsElement.addEventListener('click', () => {
        popupSelector.forEach(popupSelectorElement => {
          popupSelectorElement.classList.remove(this.options.popupActiveClassName);
          this.popupOverlaySelectorDestroy();
          this.iosRemoveClass();
        });
      }); 
    });
  }
  
  popupClose() {
    this.popupCloseButton();
    this.popupCloseOverlay();
  }

  update() {
    this.init(this.options);
  }
}

export default Popups;