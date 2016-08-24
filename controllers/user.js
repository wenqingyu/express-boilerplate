const User = require('../models/user');
const co = require('co');

/**
 * @swagger
 * resourcePath: /api
 * description: All about API
 */

/**
 * @swagger
 * path: /user
 * operations:
 *   -  httpMethod: GET
 *      summary: Get all users' list
 *      notes: Returns a list of userinfo
 *      responseClass: User
 *      nickname: getUserList
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: username
 *          description: Your username
 *          paramType: query
 *          required: true
 *          dataType: string
 *        - name: password
 *          description: Your password
 *          paramType: query
 *          required: true
 *          dataType: string
 */


/**
 * GET /api/v1/user
 * list all users
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
* GET /api/v1/user/:account
* get a userinfo
*/
exports.getUser = (req, res) => {
  co(function* () {
    if(!req.params.account){
      return res.status(400).send({error: 'Please provide account and deviceid to create/update user\'s profile! '})
    }

    // Check User Existance
    let list = yield User.find({account: req.params.account});
    if(list.length < 1){
      return res.status(401).send({
        error: 'This User is Not Exist!'
      });
    }else{
      return res.json(list[0]);
    }
  }).catch((err) => {
    console.log(err);
    return res.status(500).send({error: err});
  })
};


/**
* PUT /api/v1/user/:account
* create new user or update user's info
*/
exports.createUser = (req, res) => {
  co(function* () {
    if(!req.params.account){
      return res.status(400).send({error: 'Please provide account and deviceid to create/update user\'s profile! '})
    }

    // Check User Existance
    let list = yield User.find({account: req.params.account});

    if(list.length < 1){
      // Create
      console.log('Create A New Account . . .');
      const user = new User({
        account: req.params.account,
        email: req.body.email ? req.body.email : ''
      });
      let result = yield user.save();
      return res.json(result);
    }else{

      return res.json(list[0]);
    }
  }).catch((err) => {
    console.log(err);
    return res.status(500).send({error: err});
  })
};

/**
* GET /api/v1/user/:account/device
* get device list
*/
exports.deviceList = (req, res) => {
  co(function* () {
    if(!req.params.account){
      return res.status(400).send({error: 'Please provide account and deviceid to create/update user\'s profile! '})
    }

    // Check User Existance
    let list = yield User.find({account: req.params.account});
    if(list.length < 1){return res.status(400).send({error: 'This User is not Exist!'})}

    let thisUser = list[0];
    return res.json(thisUser.IOSAlert.deviceIDList);

  }).catch((err) => {
    console.log(err);
    return res.status(500).send({error: err});
  })
};


/**
* PUT /api/v1/user/:account/device
* add a new device
*/
exports.addDevice = (req, res) => {
  co(function* () {
    if(!req.params.account || !req.body.deviceid ){
      return res.status(400).send({error: 'Please provide account and deviceid to create/update user\'s profile! '})
    }

    // Check User Existance
    let list = yield User.find({account: req.params.account});
    if(list.length < 1){return res.status(400).send({error: 'This User is not Exist!'})}

    // Add Deivce
    let thisUser = list[0];
    // check deviceid existance
    if(thisUser.IOSAlert.deviceIDList.indexOf(req.body.deviceid) < 0){
      thisUser.IOSAlert.deviceIDList.push(req.body.deviceid);
    }
    let result = yield thisUser.save();
    return res.json(result);

  }).catch((err) => {
    console.log(err);
    return res.status(500).send({error: err});
  })
};

/**
* GET /api/v1/user/:account/ios
* get device list
*/
exports.getIOSInfo = (req, res) => {
  co(function* () {
    if(!req.params.account){
      return res.status(400).send({error: 'Please provide account and deviceid to create/update user\'s profile! '})
    }

    // Check User Existance
    let list = yield User.find({account: req.params.account});
    if(list.length < 1){return res.status(400).send({error: 'This User is not Exist!'})}

    let thisUser = list[0];
    return res.json(thisUser.IOSAlert);

  }).catch((err) => {
    console.log(err);
    return res.status(500).send({error: err});
  })
};


/**
* PUT /api/v1/user/:account/ios
* switch: ON/OFF
* change ios siwtch state
*/
exports.IOSSwitch = (req, res) => {
  co(function* () {
    if(!req.params.account || !req.body.switch ){
      return res.status(400).send({error: 'Please provide account and switch to create/update user\'s profile! '})
    }
    // Check User Existance
    let list = yield User.find({account: req.params.account});
    if(list.length < 1){return res.status(400).send({error: 'This User is not Exist!'})}

    // Switch Input Validation
    let newSwitch = req.body.switch.toUpperCase();
    let switchMark = ['ON', 'OFF'];
    if(switchMark.indexOf(newSwitch) < 0){ // Request param switch is not legal input
      return res.status(400).send({error: 'switch input is not legal, ON / OFF only :('});
    }

    // Update Switch
    let thisUser = list[0];
    thisUser.IOSAlert.switch = newSwitch;
    let result = yield thisUser.save();
    return res.json(result.IOSAlert);

  }).catch((err) => {
    console.log(err);
    return res.status(500).send({error: err});
  })
};
