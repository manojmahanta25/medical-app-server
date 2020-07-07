exports.transformUser= user =>{
    return {...user._doc, _id:user.id, password:null};
}