module.exports = function override(config, env) {
  //do stuff with the webpack config...
  config.disableHostCheck = true;
  env.NODE_ENV="development";
  return config;
};
