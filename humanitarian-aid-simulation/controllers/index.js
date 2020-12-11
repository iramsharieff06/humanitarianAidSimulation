const User = require('../models/User')
const PostController = require('./PostController')
const UserController = require('./UserController')

module.exports = {
  post: PostController,
  user: UserController
}
