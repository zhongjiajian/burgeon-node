import mongoose from '@/config/DBHelpler'

const Schema = mongoose.Schema

const UserSchema = new Schema({
  username: { type: String, index: { unique: true }, sparse: true },
  password: { type: String },
  name: { type: String }
  // created: { type: Date },
}, { timestamps: { createdAt: 'created' } })

UserSchema.statics = {
  findByID: function (id) {
    return this.findOne(
      { _id: id },
      {
        password: 0
      }
    )
  }

}

const UserModel = mongoose.model('users', UserSchema)

export default UserModel
