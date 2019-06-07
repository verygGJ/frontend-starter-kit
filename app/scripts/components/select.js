if (!String.prototype.includes) {
  String.prototype.includes = function (search, start) {
    'use strict';
    if (typeof start !== 'number') {
      start = 0;
    }
    
    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}

class Select {
  constructor(options) {
    const defaultOptions = {
      selector: 'select',
      customSelectClassName: 'select',
      customSelectActiveClassName: 'select--open',
      currentClassName: 'select__current',
      selectListClassName: 'select__list',
      selectItemClassName: 'select__item',
      activeItemClass: 'select__item--active',
      disableItemClass: 'select__item--disabled',
      activeClass: 'select--open',
      placeholderClass: 'placeholder',
      event: 'click',
      onChange(/* select */) {
        // select onChange event
      }
    }
    this.options = {
      ...defaultOptions,
      ...options
    }

    return this.init(this.options.selector);
  }

  init(selector) {
    const selects = document.querySelectorAll(selector);
    if (!selects) return;
    selects.forEach((element) => {
      const customSelect = this.renderSelect(element);
      element.insertAdjacentElement('afterEnd', customSelect);
      if (element.dataset.search) {
        const el = document.createElement('li')
        customSelect.querySelector('ul').prepend(el)
      }
    });
  }

  update() {
    const oldSelect =  document.querySelectorAll('.select');
    oldSelect.forEach((e) => {
      e.parentNode.removeChild(e);
    })
    this.init(this.options.selector)
  }

  renderSelect(select) {
    const currentElement = document.createElement('span');
    const customSelectList = document.createElement('ul');
    const customSelect = document.createElement('div');
    const nativeSelectClasses = select.className.split(' ');
    // add classes to custm select
    customSelect.classList.add(this.options.customSelectClassName);
    if (select.className) {
      customSelect.classList.add(...nativeSelectClasses);
    }

    // add tabindex if it exist
    if (select.getAttribute('tabindex')) {
      customSelect.setAttribute('tabindex', select.getAttribute('tabindex'));
    }
    // add disabled class if it exist
    if (select.disabled) {
      customSelect.classList.add('disabled');
    }
    currentElement.classList.add(this.options.currentClassName);
    customSelectList.classList.add(this.options.selectListClassName);

    customSelect.appendChild(currentElement);
    customSelect.appendChild(customSelectList);

    const options = select.querySelectorAll('option');
    if (!options) return;
    const selected = select.querySelector('option:checked') || select.querySelector('option:first-child');
    // set current
    if (!selected) return

    const currentOptionImage = selected.getAttribute('data-image');
    const currentHTML = selected.getAttribute('data-display') || selected.innerHTML;
    currentElement.innerHTML = currentHTML;

    if (currentOptionImage) {
      const optionImageElement = `<div class="option-image"><img src="${currentOptionImage}" alt=""></div>`;
      currentElement.insertAdjacentHTML('afterBegin', optionImageElement);
    }

    // build list
    options.forEach((option, index) => {
      const optionImage = option.getAttribute('data-image');
      const display = option.getAttribute('data-display');
      const nativeOptionClasses = option.className.split(' ');
      const item = document.createElement('li');
      item.classList.add(this.options.selectItemClassName);

      if (option.className) {
        item.classList.add(...nativeOptionClasses);
      }

      if (option.selected) {
        item.classList.add(this.options.activeItemClass);
      }

      if (option.disabled) {
        item.classList.add(this.options.disableItemClass);
      }

      if (option.selected && option.disabled) {
        currentElement.classList.add(this.options.placeholderClass)
      }

      item.setAttribute('data-value', option.value);
      item.innerText = display || option.innerText;
      

      if (optionImage) {
        const optionImageElement = `<div class="option-image"><img src="${optionImage}" alt=""></div>`;
        item.insertAdjacentHTML('afterBegin', optionImageElement);
      }

      if (select.dataset.search && index === 0) {
        const sh = document.createElement('div');
        sh.classList.add('search-holder');
        const search = document.createElement('input');
        search.type = 'search';
        search.placeholder = select.dataset.search;
        sh.appendChild(search);
        search.addEventListener('click', (e) => {
          e.stopImmediatePropagation()
        })
        const Search = function Search  () {
          const list = customSelectList.querySelectorAll('li');
          list.forEach((element) => {
            if(!element.classList.contains('search') && !element.textContent.toLowerCase().includes(this.value.toLowerCase())){
              element.classList.add('hidden')
            } else {
              element.classList.remove('hidden')
            }
            if(!this.value) {
              element.classList.remove('hidden')
            }
          })
        }
        search.addEventListener('keyup',Search)
        search.addEventListener('change', Search)
        customSelectList.insertAdjacentElement('beforeBegin', sh)
        return;
      }

      customSelectList.appendChild(item);
    });

    this.addListeners(select, customSelect);

    return customSelect;
  }

  addListeners(select, customSelect) {
    const { options } = this;

    select.addEventListener('change', function changeSelectEvent() {
      if (typeof options.onChange === "function") {
        options.onChange(this);
      }
    });

    customSelect.addEventListener('click', function openSelectEven(event) { 
      const innerHeightToBottom = window.innerHeight - customSelect.getBoundingClientRect().bottom;
      const thisList = this.querySelectorAll('ul');
      this.classList.toggle(options.customSelectActiveClassName);
      document.body.classList.toggle('select-is-open');
      thisList.forEach((el) => {
        const listHeight = el.offsetHeight;
        if (innerHeightToBottom < listHeight) {
          this.classList.toggle('to-up');
        }
      })
      event.stopPropagation();
    });

    document.body.addEventListener('click', () => {
      const openSelect = document.querySelectorAll('.select');
      for (let i = 0; i < openSelect.length; i += 1) {
        openSelect[i].classList.remove(options.customSelectActiveClassName)
      }
    })

    customSelect.addEventListener('click', function closeOthersSelects() {
      const openSelect = document.querySelectorAll('.select');
      openSelect.forEach(selectItem => {
        if (selectItem.classList.contains('select--open')) {
          selectItem.classList.remove(options.customSelectActiveClassName);
          this.classList.add(options.customSelectActiveClassName);
        } 
      })
    })

    const optionsList = customSelect.getElementsByClassName(options.selectItemClassName);
    const currentElement = customSelect.getElementsByClassName(options.currentClassName)[0];
    const naviveOptions = select.querySelectorAll('option');

    Array.prototype.forEach.call(optionsList, (item) => {
      item.addEventListener('click', function selectEvents(event) {

        if (currentElement.classList.contains(options.placeholderClass)) {
          currentElement.classList.remove(options.placeholderClass);
        }

        if (this.classList.contains(options.activeItemClass)) {
          return;
        }

        if (this.classList.contains(options.disableItemClass)) {
          event.stopPropagation();
          return;
        }
        const index = Array.prototype.indexOf.call(this.parentElement.children, this);

        Array.prototype.forEach.call(customSelect.getElementsByClassName(options.selectItemClassName), (element) => {
          element.classList.remove(options.activeItemClass);
        });

        currentElement.innerHTML = this.innerHTML;
        this.classList.add(options.activeItemClass);

        // change select value
        select.value = this.getAttribute('data-value');
        naviveOptions.forEach((nativeItem) => {
          nativeItem.selected = false;
        });
        naviveOptions[index].selected = true;
        const changeEvent = document.createEvent('Event');
        changeEvent.initEvent('change', true, true);
        select.dispatchEvent(changeEvent)
      })
    });
  }
}

export default Select;