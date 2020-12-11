const express = require('express')
const controllers = require('../controllers')
const UserController = require('../controllers/UserController')
const router = express.Router()

router.get('/', (req, res, next) =>{
    const data = req.context

    res.render('simulation', data)
})

router.get('/references', (req, res,next) =>{
    res.render('references');
})

router.post('/user', async (req, res, next) => {
    const userData = req.body
    //res.json(userData)
   const userCtr = controllers.user.instance()
   const user = await userCtr.post(userData)

    res.json(user)
})
module.exports = router