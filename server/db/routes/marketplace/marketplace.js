const router = require('express').Router();
const Crop = require('../../models/Crop');
const User = require('../../models/User');
router.get('/', (req, res) => {
  return User.where({ city: req.user.city })
    .orderBy('updated_at', 'DESC')
    .fetchAll({ columns: ['stand_name', 'username', 'avatar_link'] })
    .then(user => {
      return res.json(user);
    })
    .catch(err => {
      console.log('error :', err);
    });
});

router.get('/crops', (req, res) => {
  return Crop.where({ selling: true })
    .orderBy('updated_at', 'DESC')
    .fetchAll({ withRelated: ['photo'] })
    .then(crops => {
      console.log('crops', crops);
      return res.json(crops);
    });
});
module.exports = router;
