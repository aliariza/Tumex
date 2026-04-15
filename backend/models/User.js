const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v),
        message: (props) => `${props.value} geçerli bir e-posta değil`
      }
    },
    password: {
      type: String,
      required: true
    },
    companyname: { type: String, trim: true },
    telephone: { type: String, trim: true },
    address: { type: String, trim: true }
  },
  { timestamps: true }
)

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', userSchema)
