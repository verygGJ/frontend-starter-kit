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
    const currentText =selected.getAttribute('data-display') || selected.innerText;
    currentElement.innerText = currentText;

    // build list
    options.forEach((option) => {
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

      item.setAttribute('data-value', option.value);
      item.innerText = display || option.innerText;
      customSelectList.appendChild(item);
    });
    this.addListeners(select, customSelect);

    return customSelect;
  }

  addListeners(select, customSelect) {
    const { options } = this;

    select.addEventListener('change', function selectChangeFn() {
      if (typeof options.onChange === "function") {
        options.onChange(this);
      }
    });

    customSelect.addEventListener('click', function selectToggleClass(event) {
      this.classList.toggle(options.customSelectActiveClassName);
      document.body.classList.toggle('select-is-open');
      event.stopPropagation();
    });

    document.body.addEventListener('click', () => {
      const openSelect = document.querySelectorAll('.select');
      for (let i = 0; i < openSelect.length; i+= 1) {
        openSelect[i].classList.remove(options.customSelectActiveClassName)
      }
    })

    const optionsList = customSelect.getElementsByClassName(options.selectItemClassName);
    const currentElement = customSelect.getElementsByClassName(options.currentClassName)[0];
    const naviveOptions = select.querySelectorAll('option');


    Array.prototype.forEach.call(optionsList, (item) => {
      item.addEventListener('click', function addActiveClassName(event) {
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

        currentElement.innerText = this.innerText;
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