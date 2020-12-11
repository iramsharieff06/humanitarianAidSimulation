const { Model } = require('vertex360')({ site_id: process.env.TURBO_APP_ID })

const props = {
  path: {type: String, default: "", display: true},
  clues: {type: String, default: ""},
  helpers: {type: String, default: ""},
  popUps: {type: String, default: ""},
  promptUse: {type: String, default: ""},
  questions: {type: String, default: ""},
  sessionTime: {type:String, default: ""},
  answerClick: {type: String, default: ""},
  popupTime: {type: String, default: ""},
//  slug: {type: String, default: ''},
  schema: { type: String, default: 'user', immutable: true },
  timestamp: { type: Date, default: new Date(), immutable: true }
}

class User extends Model {
  constructor () {
    super()
    this.schema(props)
  }
}

module.exports = User
