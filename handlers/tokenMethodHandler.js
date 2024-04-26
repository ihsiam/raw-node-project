// dependencies
const { hash, randomString, parseJSON } = require('../lib/Utility');
const fileSystem = require('../lib/fileSystem');

// userHandler obj
const tokenMethodHandler = {};

// create user token
tokenMethodHandler.post = (reqObj, callback) => {
    const { pass, phone } = reqObj.body;
    const Phone = typeof phone === 'string' && phone.trim().length === 11 ? phone : false;
    const Pass = typeof pass === 'string' && pass.trim().length > 6 ? pass : false;

    if (Phone && Pass) {
        fileSystem.read('users', Phone, (readError, data) => {
            if (!readError && data) {
                const userData = parseJSON(data);
                const HashPass = hash(Pass);

                if (HashPass === userData.Pass) {
                    const Token = randomString(20);
                    const Expried = Date.now() + 60 * 60 * 1000;
                    const tokenObj = {
                        Phone,
                        Token,
                        Expried,
                    };

                    fileSystem.create('tokens', Token, tokenObj, (cerateError) => {
                        if (!cerateError) {
                            callback(200, tokenObj);
                        } else {
                            callback(500, {
                                msg: 'Internal server problem',
                            });
                        }
                    });
                } else {
                    callback(400, {
                        msg: 'Incorrect Password',
                    });
                }
            } else {
                callback(400, {
                    msg: 'Invalid phone number',
                });
            }
        });
    } else {
        callback(400, {
            msg: 'You have a problem on your request',
        });
    }
};

// get user token
tokenMethodHandler.get = (reqObj, callback) => {
    const { id } = reqObj.queryStringObj;
    const Id = typeof id === 'string' && id.trim().length === 20 ? id : false;

    if (Id) {
        fileSystem.read('tokens', id, (err, data) => {
            if (!err && data) {
                const tokenData = parseJSON(data);
                callback(200, tokenData);
            } else {
                callback(400, {
                    msg: 'Token not found',
                });
            }
        });
    } else {
        callback(400, {
            msg: 'You have a problem on your request',
        });
    }
};

// update user token
tokenMethodHandler.put = (reqObj, callback) => {
    const { id, extend } = reqObj.body;
    const Id = typeof id === 'string' && id.trim().length === 20 ? id : false;
    const Extend = typeof extend === 'boolean' && extend ? extend : false;

    if (Id && Extend) {
        fileSystem.read('tokens', Id, (readErr, data) => {
            if (!readErr && data) {
                const tokenData = { ...parseJSON(data) };

                if (tokenData.Expried > Date.now()) {
                    tokenData.Expried = Date.now() + 60 * 60 * 1000;

                    fileSystem.update('tokens', Id, tokenData, (updateErr) => {
                        if (!updateErr) {
                            callback(200, {
                                msg: 'Extended',
                            });
                        } else {
                            callback(500, {
                                msg: 'Internal server error',
                            });
                        }
                    });
                } else {
                    callback(400, {
                        msg: 'Incorrect token id',
                    });
                }
            } else {
                callback(400, {
                    msg: 'Incorrect token id',
                });
            }
        });
    } else {
        callback(400, {
            msg: 'You have a problem on your request',
        });
    }
};

// delete user token
tokenMethodHandler.delete = (reqObj, callback) => {
    const { id } = reqObj.queryStringObj;
    const Id = typeof id === 'string' && id.trim().length === 20 ? id : false;

    if (Id) {
        fileSystem.read('tokens', Id, (readErr, data) => {
            if (!readErr && data) {
                fileSystem.delete('tokens', Id, (err) => {
                    if (!err) {
                        callback(200, {
                            msg: 'Token deleted',
                        });
                    } else {
                        callback(400, {
                            msg: 'Token data not found',
                        });
                    }
                });
            } else {
                callback(400, {
                    msg: 'Invalid token Id',
                });
            }
        });
    } else {
        callback(400, {
            msg: 'You have a prolem on your request',
        });
    }
};

// verfity function
tokenMethodHandler.tokenVerify = (id, phone, callback) => {
    fileSystem.read('tokens', id, (err, Data) => {
        if (!err && Data) {
            const tokenData = parseJSON(Data);
            const { Phone, Expried } = tokenData;

            if (Phone === phone && Expried > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};

// module export
module.exports = tokenMethodHandler;
