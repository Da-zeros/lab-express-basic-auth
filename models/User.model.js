const bcrypt = require('bcryptjs');
const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const UserSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  password:{
    type:String,
    required: [true, 'Password is required.']
  }
});

/**
 * This is the middleware, It will be called before saving any record
 */
 UserSchema.pre("save", async function() {
  const user = this
  
  try {
    if (this.isModified("password") || this.isNew){
      const salt = await bcrypt.genSalt(10)
      
      const hash = await bcrypt.hash(user.password, salt)
      
      user.password = hash
    }
  } catch (error) {
    console.log(error)
  }
})


const UserModel = model("User", UserSchema);

module.exports = UserModel;
