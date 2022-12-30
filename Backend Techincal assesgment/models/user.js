const mongoose = require("mongoose");
bcrypt = require("bcrypt");
SALT_WORK_FACTOR = 10;
const adminSchema = new mongoose.Schema({
  username: { type: String,required:true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  creationDate:{type:Date,default:Date.now}
},
{ timestamps: true }
);

adminSchema.pre("save", function(next) {
    var user = this;

// only hash the password if it has been modified (or is new)
if (!user.isModified('password')) return next();

// generate a salt
bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);

        // override the cleartext password with the hashed one
        user.password = hash;
        next();
    });
});


});

adminSchema.methods.comparePassword = async function(password) {
    if(!password) throw new Error("cannot compare password");
    try{
const result= await bcrypt.compare(password,this.password)
return result
    }catch(error){
console.log("error while comparing password",error.message)
    }
};

module.exports = mongoose.model("User", adminSchema);