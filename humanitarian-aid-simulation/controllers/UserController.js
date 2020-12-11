const { Controller } = require('vertex360')({ site_id: process.env.TURBO_APP_ID })
const User = require('../models/User')

class UserController extends Controller {
  constructor () {
    super(User, process.env)
  }

  async get (params) {
    const users = await User.find(params, Controller.parseFilters(params))
    return User.convertToJson(users)
  }

  async getById (id) {
    const user = await User.findById(id)
    if (user == null) {
      throw new Error(`${User.resourceName} ${id} not found.`)
    }

    return user.summary()
  }

  async post (body) {
    const user = await User.create(body)
    return user.summary()
  }

  async put (id, params) {
    const user = await User.findByIdAndUpdate(id, params, { new: true })
    return user.summary()
  }

  async delete (id) {
    const user = await User.findByIdAndRemove(id)
    return user
  }
}

module.exports = new UserController()

