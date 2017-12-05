var path = require('path'),
  rootPath = path.normalize(__dirname + '/..'),
  env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'utra'
    },
    port: process.env.PORT || 3000,
    domain: 'http://localhost:3000',
    db: 'mongodb://localhost/utra-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'utra'
    },
    port: process.env.PORT || 3000,
    domain: 'http://localhost:3000',
    db: 'mongodb://localhost/utra-test'
    // db: 'mongodb://mongodb:27017/utra-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'utra'
    },
    port: process.env.PORT || 4000,
    domain: 'http://rapp.bigcomplexdata.com:4000',
    // db: 'mongodb://mongodb:27017/utra-production'
    db: 'mongodb://localhost/utra-production'
  }
};

var envConfig = config[env];
envConfig.facebookClientId = '1374529882597020';
envConfig.facebookClientSecret = 'f59cbf3081c003f06cedbc220e5c9569';
envConfig.googleClientId = '955665183738-69fafim72gagh8eigmlrsr4d2l54hkmn.apps.googleusercontent.com';
envConfig.googleClientSecret = 'uZPCHL8kht9WCii_eEGjUNyv';
envConfig.sessionSecret = '402769bd3831cfbe37e';
envConfig.sessionSecret = '402769bd3831cfbe37e';
envConfig.dbPassword = 'G0dj697iyZLR9OpgAvDG';


module.exports = envConfig;
