var mongoose = require('mongoose');

const schema = mongoose.Schema;
const bkSchema = new schema({

    businessName: {type: String},
    businessKey: {type: String}

});

var bk = mongoose.model('bk', bkSchema)

module.exports = bk;