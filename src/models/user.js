var mongoose = require('../config/db.js').mongoose;
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    user: {
        username: String,
        userId: String,
        email: String,
        salt: String,
        hash: String,
        name: String,
        address: String,
        phone: String,
        interestId: [String],
        PicUrl: String,
        UserRole: [String],
        LastLoginDate: Date,
        RegistrationDate: Date
    }
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.user.password);
};

userSchema.methods.updateUser = function(request, response) {

    this.user.name = request.body.name;
    this.user.address = request.body.address;
    this.user.save();
    response.redirect('/user');
};

mongoose.model('User', userSchema);
var user = mongoose.model('User');

module.exports = 
{
    user: user
}  