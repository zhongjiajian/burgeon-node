import mongoose from '@/config/DBHelpler'

const Schema = mongoose.Schema

const PostSchema = new Schema({
  uid: { type: String, ref: 'users' },
  title: { type: String },
  note: { type: String },
  content: { type: String },
  isDel: { type: Boolean },
  prodId: { type: String, ref: 'pagesProd' }
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

// PostSchema.virtual('user', {
//   ref: 'users',
//   localField: 'uid',
//   foreignField: '_id'
// })

PostSchema.statics = {
  /**
   * 获取文章列表数据
   * @param {Object} options 筛选条件
   * @param {String} sort 排序方式
   */
  getList: function (options, sort) {
    return this.find(options)
      .sort({ [sort]: -1 })
      .populate({
        path: 'uid',
        select: 'name'
      })
  },
  findByPid: function (id, isSimple) {
    if (isSimple) return this.findOne({ _id: id })
    return this.findOne({ _id: id }).populate({
      path: 'uid',
      select: 'name'
    })
  }

}

const PostModel = mongoose.model('pages', PostSchema)

export default PostModel
