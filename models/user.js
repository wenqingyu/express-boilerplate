const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const Promise = require('bluebird');
const mongoose = Promise.promisifyAll(require('mongoose'));
const Schema = mongoose.Schema;

// const autoIncrement = require('mongoose-auto-increment');

const userSchema = new mongoose.Schema({
  account: { type: String, index: {unique: true} },
  email: { type: String, default: '', unique: false },

  IOSAlert: {
    deviceIDList: [{type: String, default: '', unique: false }],
    switch: {type: String, default: 'ON'}, // ON / OFF
    alertList: [{type: Schema.Types.ObjectId, ref: 'PriceAlert'}]
  }
}, { timestamps: true });

// Auto Incremental _id
// userSchema.plugin(autoIncrement.plugin, 'User');
const User = mongoose.model('User', userSchema);

module.exports = User;
