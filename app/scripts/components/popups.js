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

export default () => {
  const htmlBlockHollder =  document.querySelector('html');
  const bodyBlock =  document.querySelector('body');
  const popupLink = document.querySelectorAll('.popup-open[data-for]');
  
  const popupOverlayActive = () => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    htmlBlockHollder.style.marginRight = scrollbarWidth;
    htmlBlockHollder.style.overflow = 'hidden';
  }
  const popupOverlayDestroy = () => {
    htmlBlockHollder.removeAttribute('style');
  }
  const iosRemoveClass = () => {
    bodyBlock.classList.remove('iosBugFixCaret')
  }
  
  const popupOpen = (link) => {
    const popupElement = document.querySelector(`.${link.dataset.for}`);
    if (popupElement) {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        popupElement.classList.toggle('active');
        popupOverlayActive();
      });
    }
  };
  Array.from(popupLink).forEach(popupOpen); 

  const popupClose = () => {
    const close = document.querySelectorAll('.popup__close');
    const popupInner = document.querySelectorAll('.popup');
    const popupOverlays = document.querySelectorAll('.popup__overlay');
    close.forEach(closeElement => {
      closeElement.addEventListener('click', () => {
        popupInner.forEach(popupInnerElement => {
          popupInnerElement.classList.remove('active');
          popupOverlayDestroy();
          iosRemoveClass();
        });
      });
    });
    popupOverlays.forEach(popupOverlaysElement => {
      popupOverlaysElement.addEventListener('click', () => {
        popupInner.forEach(popupInnerElement => {
          popupInnerElement.classList.remove('active');
          popupOverlayDestroy();
          iosRemoveClass();
        });
      }); 
    });
  }

  popupClose();

  const ua = navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua);
  const iOS11 = /OS 11/.test(ua);
  const popupBtn = document.querySelectorAll('.popup-open');
  if (iOS && iOS11) {
    popupBtn.forEach(popupBtnSingle => {
      popupBtnSingle.addEventListener('click', () => {
        bodyBlock.classList.add('iosBugFixCaret');
      });
    });  
  }

}