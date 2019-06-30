const router = require('express').Router();
const UserController = require('./user.controller');

router.post('/', (req, res, next)=>{
   UserController.saveUserWithToken(req.body).then(d => res.json(d)).catch(e => next(e));
});

router.post('/login', (req, res, next)=>{
    UserController.login(req.body).then(d => res.json(d)).catch(e =>{ next(e) });
});

router.get('/:id', (req, res, next)=>{
    UserController.findUser(req.params.id).then(d => res.json(d)).catch(e => next(e));
 });

module.exports = router;