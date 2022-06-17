const bcrypt = require('bcryptjs');
//const helpers = {};
const helpers = require('../lib/helpers');

helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

helpers.matchPassword = async (password, savedPassword) => {
    /*try {
        
    }
    catch (e) {
        console.log(e);
    }*/

    return await bcrypt.compare(password, savedPassword);
};

module.exports = helpers;