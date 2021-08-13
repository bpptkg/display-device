// We inject environment variables in the webpack configuration. See
// vue.config.js for more details.
export default {
  version: process.env.DD_APP_VERSION,
  commitHash: process.env.DD_COMMIT_HASH,
  buildDate: process.env.DD_BUILD_DATE,
}
