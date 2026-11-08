'use strict';

const path = require('path');

module.exports = {
  ...require(path.join(__dirname, 'catalog')),
  ...require(path.join(__dirname, 'runtime')),
};
