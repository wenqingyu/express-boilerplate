const User = require('../models/user');
const PriceAlert = require('../models/priceAlert');
const co = require('co');

/**
 * PUT /api/v1/pricealert
 * createOrUpdate a
 */
exports.list = (req, res) => {
  co(function* () {
    let list = yield User.find({});
    return res.json(list);
  }).catch((err) => {
    return res.status(500).send({error: err});
  })
};

/**
* PUT /api/v1/user/createOrUpdate/:account
* create new user or update user's info
*/
exports.createOrUpdate = (req, res) => {
  co(function* () {

    // console.log(req.params.account);
    // console.log(req.body.deviceid);
    if(!req.params.account || !req.body.deviceid ){
      return res.status(400).send({error: 'Please provide account and deviceid to create/update user\'s profile! '})
    }

    // Check if this account already exist
    let list = yield User.find({});

    if(list.length < 1){
      // Create
      console.log('Create A New Account . . .')
      const user = new User({
        account: req.params.account,
        IOSAlert: {
          deviceID: req.body.deviceid
        }
      });
      let result = yield user.save();
      return res.json(result);
    }else{
      // Update
      console.log('Update Account . . .');
      let thisUser = list[0];
      thisUser.IOSAlert.deviceID = req.body.deviceid;
      let result = yield thisUser.save();
      return res.json(result);
    }

  }).catch((err) => {
    console.log(err);
    return res.status(500).send({error: err});
  })
};
