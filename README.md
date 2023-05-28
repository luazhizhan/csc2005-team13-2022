# csc2005-team13-2022

This project is generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.6.

## Demo

Visit http://csc2005-team13.web.app/

Create or use the demo account below.

| Email            | Password  |
| ---------------- | --------- |
| test@example.com | asdqwe123 |

## Getting Started

### Installation

1. [Node.js](https://nodejs.org/en/) - Install LTS version

### Code Editor

I recommend using [VSCode](https://code.visualstudio.com/). Please install the following extensions if you are using VSCode.

- [Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

Do enable `Format on save` on your VSCode as well.

### Setting up

_Clone this repository locally:_

```bash
git clone https://github.com/hci-singaporetech/csc2005-team13-2022.git
```

_Install dependencies with npm:_

```bash
npm install
```

If you want to generate Angular components with Angular-cli , you **MUST** install `@angular/cli` in npm global context.
Please follow [Angular-cli documentation](https://github.com/angular/angular-cli) if you had installed a previous version of `angular-cli`.

```bash
npm install -g @angular/cli
```

_Create `.env` file at root directory:_

`.env` is used to store environment varibles. Please create one at the root directory of the project.

The variables in the `.env` files. Please add in your `FIREBASE_CONFIG` accordingly.

```text
FIREBASE_CONFIG=<SECRET>
```

Example of how the `<SECRET>` value is like

```text
{apiKey: "KEY",authDomain: "URL",projectId: "ID",appId: "ID"}
```

### Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
