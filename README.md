# Display Device

Display Device (DD) is a full front-end app built using
[Vue.js](https://vuejs.org/), [Bootstrap](https://getbootstrap.com/),
[ECharts](https://echarts.apache.org/), and many awesome open source libraries.
It provides various charts and analytics information about BPPTKG monitoring
data.

For current version, DD only supports Vue.js version 2, Bootstrap version 4, and
ECharts version 4.

## Environment Variables Settings

There are several required environment variables that need to be set in `.env`
file:

- VUE_APP_BMA_URL

  BMA web services URL, e.g. `https://bma.cendana15.com` to fetch various
  monitoring data. The app will automatically prefix any web request with
  `/api/v1/` because all monitoring data use v1 endpoints. See client module in
  the `src/utils/client.js`.

- VUE_APP_BMA_API_KEY

  BMA API key credentials to grant access to the APIs. You can contact BMA
  administrator to get the key.

- VUE_APP_CENDANA_URL

  Cendana15 web services URL, e.g. `https://cendana15.com`. This is used to get
  user account info and grant permissions to access the resources provided by
  Cendana15 web services.

  On production environment, if user is not authenticated, they will be
  redirected to the login page. On local development, user authentication may be
  skipped.

## Project Setup

Install all package dependencies:

    npm install

Compiles and hot-reloads for development:

    npm run serve

Lints and fixes files:

    npm run lint

Compiles and minifies for production:

    npm run build

## Deployment

On production environment, we deploy the app using `/display-device/` public
path. You can change this setting by adding `VUE_APP_PUBLIC_PATH` in your env
file. You have to also add the following to the Nginx configuration:

    location /display-device {
        alias /path/to/display-device/dist/;
        try_files $uri $uri/ /index.html = 404;
    }

On staging environment, we deploy the app using `/display-device-dev/` public
path. To build for staging, create `.env.staging.local` file and add the
following:

    NODE_ENV=production
    VUE_APP_PUBLIC_PATH=/display-device-dev/

Then, run:

    npm run build -- --mode staging

Do not forget to adjust your Nginx site location configuration if you deploy for
staging.

## License

[MIT](https://github.com/bpptkg/display-device/blob/master/LICENSE)
