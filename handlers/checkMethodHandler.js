/* eslint-disable operator-linebreak */
// dependencies
const { parseJSON, randomString } = require('../lib/Utility');
const fileSystem = require('../lib/fileSystem');
// const { tokenVerify } = require('./tokenMethodHandler');

// userHandler obj
const checkMethodHandler = {};

// create user
checkMethodHandler.post = (reqObj, userData, callback) => {
    // eslint-disable-next-line object-curly-newline
    const { protocol, url, method, succCode, timeOut } = reqObj.body;

    const Protocol =
        typeof protocol === 'string' && ['http', 'https'].indexOf(protocol) > -1 ? protocol : false;
    const URL = typeof url === 'string' && url.trim().length > 0 ? url : false;
    const Method =
        typeof method === 'string' && ['get', 'put', 'post', 'delete'].indexOf(method) > -1
            ? method
            : false;
    const SuccCode = typeof succCode === 'object' && succCode instanceof Array ? succCode : false;
    const TimeOut = typeof timeOut === 'number' && timeOut % 1 === 0 ? timeOut : false;

    if (Protocol && URL && Method && SuccCode && TimeOut) {
        const UserData = parseJSON(userData);
        const { checks, Phone } = UserData;

        const Checks = typeof checks === 'object' && checks instanceof Array ? checks : [];
        if (Checks.length <= 5) {
            const CheckID = randomString(20);
            const checkObj = {
                CheckID,
                Protocol,
                URL,
                Method,
                SuccCode,
                TimeOut,
            };
            // create check
            fileSystem.create('checks', CheckID, checkObj, (createErr) => {
                if (!createErr) {
                    UserData.checks = Checks;
                    UserData.checks.push(CheckID);

                    // update on userdata
                    fileSystem.update('users', Phone, UserData, (updateErr) => {
                        if (!updateErr) {
                            callback(200, checkObj);
                        } else {
                            callback(500, {
                                msg: 'Server problem',
                            });
                        }
                    });
                } else {
                    callback(500, {
                        msg: 'Server problem',
                    });
                }
            });
        } else {
            callback(400, {
                msg: 'Request full',
            });
        }
    } else {
        callback(400, {
            msg: 'You have a problem on your request',
        });
    }
};

// get user data
checkMethodHandler.get = (reqObj, userData, callback) => {
    const { id } = reqObj.queryStringObj;
    const Id = typeof id === 'string' && id.trim().length === 20 ? id : false;

    if (Id) {
        fileSystem.read('checks', id, (readErrr, tokenData) => {
            if (!readErrr && tokenData) {
                const data = parseJSON(tokenData);
                callback(200, data);
            } else {
                callback(400, {
                    msg: 'Invalid id',
                });
            }
        });
    } else {
        callback(400, {
            msg: 'You have a problem on your request',
        });
    }
};

// update user data
checkMethodHandler.put = (reqObj, userData, callback) => {
    const { id } = reqObj.queryStringObj;
    const Id = typeof id === 'string' && id.trim().length === 20 ? id : false;

    // eslint-disable-next-line object-curly-newline
    const { protocol, url, method, succCode, timeOut } = reqObj.body;

    const Protocol =
        typeof protocol === 'string' && ['http', 'https'].indexOf(protocol) > -1 ? protocol : false;
    const URL = typeof url === 'string' && url.trim().length > 0 ? url : false;
    const Method =
        typeof method === 'string' && ['get', 'put', 'post', 'delete'].indexOf(method) > -1
            ? method
            : false;
    const SuccCode = typeof succCode === 'object' && succCode instanceof Array ? succCode : false;
    const TimeOut = typeof timeOut === 'number' && timeOut % 1 === 0 ? timeOut : false;

    if (Id) {
        if (Protocol || URL || Method || SuccCode || TimeOut) {
            fileSystem.read('checks', Id, (readErr, checkData) => {
                if (!readErr && checkData) {
                    const CheckData = { ...parseJSON(checkData) };

                    if (Protocol) {
                        CheckData.Protocol = Protocol;
                    }
                    if (URL) {
                        CheckData.URL = URL;
                    }
                    if (Method) {
                        CheckData.Method = Method;
                    }
                    if (SuccCode) {
                        CheckData.SuccCode = SuccCode;
                    }
                    if (TimeOut) {
                        CheckData.TimeOut = TimeOut;
                    }

                    fileSystem.update('checks', Id, CheckData, (updateErr) => {
                        if (!updateErr) {
                            callback(400, {
                                msg: 'Updated',
                            });
                        } else {
                            callback(500, {
                                msg: 'Server error',
                            });
                        }
                    });
                } else {
                    callback(400, {
                        msg: 'Invalid Id',
                    });
                }
            });
        } else {
            callback(400, {
                msg: 'You have a problem on your id request',
            });
        }
    } else {
        callback(400, {
            msg: 'You have a problem on your id request',
        });
    }
};

// delete user data
checkMethodHandler.delete = (reqObj, userData, callback) => {
    const { id } = reqObj.queryStringObj;
    const Id = typeof id === 'string' && id.trim().length === 20 ? id : false;

    if (Id) {
        fileSystem.read('checks', Id, (readErr, data) => {
            if (!readErr && data) {
                fileSystem.delete('checks', Id, (delErr) => {
                    if (!delErr) {
                        const UserData = parseJSON(userData);
                        const { checks, Phone } = UserData;
                        const Checks =
                            typeof checks === 'object' && checks instanceof Array ? checks : [];

                        const pos = Checks.indexOf(Id);
                        Checks.splice(pos, 1);
                        UserData.checks = Checks;

                        fileSystem.update('users', Phone, UserData, (UpErr) => {
                            if (!UpErr) {
                                callback(200, {
                                    msg: 'Deleted',
                                });
                            } else {
                                callback(500, {
                                    msg: 'Server problem',
                                });
                            }
                        });
                    } else {
                        callback(500, {
                            msg: 'Server problem',
                        });
                    }
                });
            } else {
                callback(400, {
                    msg: 'invalid id',
                });
            }
        });
    } else {
        callback(400, {
            msg: 'You have a problem on your id request',
        });
    }
};

// module export
module.exports = checkMethodHandler;
