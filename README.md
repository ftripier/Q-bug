# Q-Bug

A work-in-progress web-based visual debugger for Quil programs.

## Development workflow for UI

1. If you haven't already, build the docker image with `docker build . -t qbugserver`. This
   builds a Q-bug image that serves the UI on port 8001 and the websocket
   server on port 8765.
2. Run the server with ./scripts/run.sh
3. Once shelled into the server, run `pipenv run start`
4. In a different terminal, on your host machine, start the dev server with `REACT_APP_DEBUG_SERVER_PORT=8765 npm run start`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
