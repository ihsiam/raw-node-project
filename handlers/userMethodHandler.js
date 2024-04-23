/* eslint-disable operator-linebreak */
// dependencies
const { hash, parseJSON } = require('../lib/Utility');
const fileSystem = require('../lib/fileSystem');

// userHandler obj
const userMethodHandler = {};

// create user
userMethodHandler.post = (reqObj, callback) => {
    // eslint-disable-next-line object-curly-newline
    const { firstName, lastName, pass, phone, agreement } = reqObj.body;

    // type check & storing data
    const FirstName =
        typeof firstName === 'string' && firstName.trim().length > 0 ? firstName : false;
    const LastName = typeof lastName === 'string' && lastName.trim().length > 0 ? lastName : false;
    const Phone = typeof phone === 'string' && phone.trim().length === 11 ? phone : false;
    const Pass = typeof pass === 'string' && pass.trim().length > 6 ? pass : false;
    const Agreement = typeof agreement === 'boolean' && agreement ? agreement : false;

    if (FirstName && LastName && Phone && Pass && Agreement) {
        fileSystem.read('users', Phone, (readErr) => {
            if (readErr) {
                const userObj = {
                    FirstName,
                    LastName,
                    Phone,
                    Pass: hash(Pass),
                    Agreement,
                };

                // store to db
                fileSystem.create('users', Phone, userObj, (createErr) => {
                    if (!createErr) {
                        callback(200, {
                            msg: 'User created',
                        });
                    } else {
                        callback(400, {
                            msg: 'Server side error',
                        });
                    }
                });
            } else {
                callback(400, {
                    msg: 'User with this phone already exists',
                });
            }
        });
    } else {
        callback(400, {
            msg: 'You have a problem on your request',
        });
    }
};

// get user data
userMethodHandler.get = (reqObj, callback) => {
    const { phone } = reqObj.queryStringObj;
    const Phone = typeof phone === 'string' && phone.trim().length === 11 ? phone : false;

    if (Phone) {
        fileSystem.read('users', Phone, (err, data) => {
            if (!err && data) {
                const user = { ...parseJSON(data) };
                delete user.Pass;
                callback(200, user);
            } else {
                callback(400, {
                    msg: 'User data not found',
                });
            }
        });
    } else {
        callback(400, {
            msg: 'User not found',
        });
    }
};

// update user data
userMethodHandler.put = (reqObj, callback) => {
    // eslint-disable-next-line object-curly-newline
    const { firstName, lastName, pass, phone } = reqObj.body;

    // type check & storing data
    const FirstName =
        typeof firstName === 'string' && firstName.trim().length > 0 ? firstName : false;
    const LastName = typeof lastName === 'string' && lastName.trim().length > 0 ? lastName : false;
    const Phone = typeof phone === 'string' && phone.trim().length === 11 ? phone : false;
    const Pass = typeof pass === 'string' && pass.trim().length > 6 ? pass : false;

    if (Phone) {
        if (FirstName || LastName || Pass) {
            fileSystem.read('users', Phone, (readErr, data) => {
                if (!readErr && data) {
                    const user = { ...parseJSON(data) };

                    // update data
                    if (FirstName) {
                        user.FirstName = FirstName;
                    }
                    if (LastName) {
                        user.LastName = LastName;
                    }
                    if (FirstName) {
                        user.Pass = hash(Pass);
                    }

                    fileSystem.update('users', Phone, user, (updateErr) => {
                        if (!updateErr) {
                            callback(200, {
                                msg: 'Updated',
                            });
                        } else {
                            callback(500, {
                                msg: 'Server Problem',
                            });
                        }
                    });
                } else {
                    callback(400, {
                        msg: 'Problem in request',
                    });
                }
            });
        } else {
            callback(400, {
                msg: 'Problem in request',
            });
        }
    } else {
        callback(400, {
            msg: 'Invalid phone number',
        });
    }
};

// delete user data
userMethodHandler.delete = (reqObj, callback) => {
    const { phone } = reqObj.queryStringObj;
    const Phone = typeof phone === 'string' && phone.trim().length === 11 ? phone : false;

    if (Phone) {
        fileSystem.read('users', Phone, (readErr, data) => {
            if (!readErr && data) {
                fileSystem.delete('users', Phone, (err) => {
                    if (!err) {
                        callback(200, {
                            msg: 'User deleted',
                        });
                    } else {
                        callback(400, {
                            msg: 'User data not found',
                        });
                    }
                });
            } else {
                callback(400, {
                    msg: 'User data not found',
                });
            }
        });
    } else {
        callback(400, {
            msg: 'Invalid Phone Number',
        });
    }
};

// module export
module.exports = userMethodHandler;
