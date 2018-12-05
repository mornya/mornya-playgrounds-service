# mornya-playgrounds-service
##### NodeJS server with JWT, MongoDB, Social-login, File-uploader and Send-mail

A mostly unopinionated starter project for using Babel and ES6+ features in a Node.js server environment as well as providing linting and testing solutions. It provides the setup for compiling, linting and testing your code but doesn't make any further assumptions on how your project should be structured.

## Features
- ES6+ support with [Babel](https://babeljs.io/).
- Automatic polyfill requires based on environment with [babel-preset-env](https://github.com/babel/babel-preset-env).
- [Express.js](https://expressjs.com/) as the web framework.
- Linting with [ESLint](http://eslint.org/).
- Testing with [Jest](https://facebook.github.io/jest/).

## Getting started

```sh
# Install dependencies
npm install

# or if you're using Yarn
yarn
```
Then generate SSL self-certification files (`ssl-cert.pem` and `ssl-key.pem`) and copy them on project root directory.
```sh
openssl req -x509 -newkey rsa:2048 -nodes -keyout ssl-key.pem -out ssl-cert.pem -days 365
```

Next, copy `.env.development` file to `.env` also configure it.

And then you can begin development:

```sh
# npm
npm run dev

# yarn
yarn run dev
```

This will launch a [nodemon](https://nodemon.io/) process for automatic server restarts when your code changes.

### Testing

Testing is powered by [Jest](https://facebook.github.io/jest/). This project also uses [supertest](https://github.com/visionmedia/supertest) for demonstrating a simple routing smoke test suite. Feel free to remove supertest entirely if you don't wish to use it.

Start the test runner in watch mode with:

```sh
# npm
npm test

# yarn
yarn test
```

You can also generate coverage with:

```sh
# npm
npm test -- --coverage

# yarn
yarn test --coverage
```

### Linting

Linting is set up using [ESLint](http://eslint.org/). It uses ESLint's default [eslint:recommended](https://github.com/eslint/eslint/blob/master/conf/eslint.json) rules. Feel free to use your own rules and/or extend another popular linting config (e.g. [airbnb's](https://www.npmjs.com/package/eslint-config-airbnb) or [standard](https://github.com/feross/eslint-config-standard)).

Begin linting in watch mode with:

```sh
# npm
npm run lint

# yarn
yarn run lint
```

To begin linting and start the server simultaneously, edit the `package.json` like this:

```
"dev": "nodemon src/index.js --exec \"node -r dotenv/config -r babel-register --max_old_space_size=1024\" | npm run lint"
```

### Environmental variables in development

The project uses [dotenv](https://www.npmjs.com/package/dotenv) for setting environmental variables during development. Simply copy `.env.sample`, rename it to `.env` and add your env vars as you see fit. 

It is **strongly** recommended **never** to check in your .env file to version control. It should only include environment-specific values such as database passwords or API keys used in development. Your production env variables should be different and be set differently depending on your hosting solution. `dotenv` is only for development.

### Deployment

Deployment is specific to hosting platform/provider but generally:

```sh
# npm
npm run build

# yarn
yarn run build
```

will compile your `src` into `/dist`, and 

```sh
# npm
npm start

# yarn
yarn start
```

will run `build` (via the `prestart` hook) and start the compiled application from the `/dist` folder.

The last command is generally what most hosting providers use to start your application when deployed, so it should take care of everything.

You can find small guides for Heroku, App Engine and AWS in [the deployment](DEPLOYMENT.md) document.

## FAQ

**Where is all the configuration for ESLint, Jest and Babel?**

> In `package.json`. Feel free to extract them in separate respective config files if you like.

**Why are you using `babel-register` instead of `babel-node`?**

> `babel-node` contains a small "trap", it loads Babel's [polyfill](https://babeljs.io/docs/usage/polyfill/) by default. This means that if you use something that needs to be polyfilled, it'll work just fine in development (because `babel-node` polyfills it automatically) but it'll break in production because it needs to be explicitely included in Babel's CLI which handles the final build.
>
> In order to avoid such confusions, `babel-register` is a more sensible approach in keeping the development and production runtimes equal. By using [babel-preset-env](https://github.com/babel/babel-preset-env) only code that's not supported by the running environment is transpiled and any polyfills required are automatically inserted.

**Should I use this?**

> Full disclosure: If you have to ask perhaps you should reconsider. There is some debate on whether to use Babel-transpiled code on the server or not. Personally, I think it's fine and I've found this setup to be a sensible approach in doing so. That said, I'd suggest to take anything you read online with a grain of salt and refrain from blindly using boilerplates without first investigating personally.
>
> Node is very rapidly converging with the latest ECMAScript specification, and there's mostly full native support for ES2015 and ES2016. The need to transpile on the server is way smaller nowadays, albeit the language is constantly improving and transpiling will probably always be a part of our workflow. At the time of this writing the main benefits are mainly ES6 module syntax and async/await without flags.
>
> In any case, you can simply remove transpilation and keep everything else that this kit has to offer.
>
> If you see anything that needs improvement feel free to open an issue for discussion!

## License
See the [LICENSE](LICENSE) file.
