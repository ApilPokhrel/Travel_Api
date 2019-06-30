const UserModel = require('./user.schema');

exports.saveUserWithToken =  async (payload)=>{
    let userModel = new UserModel(payload);
    return userModel.generateAuthToken();
}

exports.login = (payload)=>{
    return UserModel.findByCredentials(payload.address, payload.password);
}

exports.findUser = (id)=>{
    return UserModel.findById(id);
}