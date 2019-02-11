##Frontend Starter Kid https://github.com/dshm/markup-framework.git
## Author https://github.com/netergart

##Requirements
* node ^8.3.0
* npm ^5.3.0

##You must be globally installed *gulp*
To set the type in the console `npm install gulp -g`

## Install dependencies, and check if it works

* cd 'project'
* npm install
* npm start / gulp

## Gulp tasks

* **gulp** - default task which runs the project with the initial settings with browsersync and Livereload

* **gulp build** - default task which runs the project with the initial settings without browsersync and Livereload

* **gulp png-sprite** - run task that takes image and converts them into a stylesheet and sprites(retina and default)

* **gulp svg-sprite** - run task which takes a bunch of SVG files, optimizes them and bakes them into SVG sprites of several types

* **gulp clean** - run task which remove *dist* folder


## Application Structure
```
.
├── app
│   ├── _includes
│   ├── API
│   ├── data
│   ├── fonts
│   ├── images
│   ├── png-sprite
│   ├── scripts
│   │   ├── components
│   │   ├── index.js
│   │   └── markup-menu.js
│   ├── scss
│   │   ├── app
│   │   ├── components.scss
│   │   ├── extends.scss
│   │   ├── mixins.scss
│   │   ├── normalize.scss
│   │   ├── variable.scss
│   │   └── index.scss
│   ├── svg-sprite
│   └── index.html     
├── dist               
├── gulp                    
│   └── tasks
├── browsers.json           
├── uncss.json   
└── options.json                
```