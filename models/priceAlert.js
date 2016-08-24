const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const Promise = require('bluebird');
const mongoose = Promise.promisifyAll(require('mongoose'));
const Schema = mongoose.Schema;

// const autoIncrement = require('mongoose-auto-increment');

const priceAlertSchema = new mongoose.Schema({
  price: { type: String, default: '' },
  direction: { type: String, default: '' },
  lastUpdated: { type: Date, default: Date.now },
  lastTriggered: { type: Date }
  }
}, { timestamps: true });


const PriceAlert = mongoose.model('PriceAlert', priceAlertSchema);

module.exports = PriceAlert;
