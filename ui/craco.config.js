/* craco.config.js */
const CracoAlias = require('craco-alias')

module.exports = {
    devServer: {
      port: 3001
    },
    plugins: [
      {
        plugin: CracoAlias,
        options: {
          source: 'tsconfig',
          baseUrl: '.',
          tsConfigPath: './tsconfig.path.json',
        },
      },
    ],
  }