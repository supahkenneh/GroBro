const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const router = express.Router();
const app = express()
const User = require('../../models/User');
const saltRounds = 12;

// ===== PASSPORT METHODS ===== //

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  return done(null, {
    id: user.id,
    username: user.username.toLowerCase()
  });
});

passport.deserializeUser((user, done) => {
  new User({ id: user.id })
    .fetch()
    .then(user => {
      user = user.toJSON();
      return done(null, {
        id: user.id,
        username: user.username.toLowerCase(),
      });
    })
    .catch(err => {
      console.log('error : ', err);
      return done(err);
    });
});

passport.use(
  new LocalStrategy((username, password, done) => {
    return new User({ username: username })
      .fetch()
      .then(user => {
        user = user.toJSON();
        if (user === null) {
          return done(null, false, {
            message: 'Invalid Username and/or Password'
          });
        } else {
          bcrypt.compare(password, user.password).then(samePassword => {
            if (samePassword) {
              return done(null, user);
            } else {
              return done(null, false, {
                message: 'Invalid Username and/or Password'
              });
            }
          });
        }
      })
      .catch(err => {
        console.log('error: ', err);
        return done(err);
      });
  })
);

// ===== REGISTRATION ===== //
router.post('/register', (req, res) => {
  let { username, email, first_name, last_name, city, state } = req.body;
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      return res.status(500);
    }
    bcrypt.hash(req.body.password, salt, (err, hashedPassword) => {
      if (err) {
        return res.status(500);
      }
      return new User({
        username: username.toLowerCase(),
        password: hashedPassword,
      })
        .save()
        .then(result => {
          console.log(result);
          res.json({ success: true });
        })
        .catch(err => {
          console.log('error : ', err);
          return res.send('Unable to register with that username');
        });
    });
  });
});

// ===== LOG IN / LOG OUT ===== //

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/login');
    }
    req.login(user, err => {
      if (err) {
        return next(err);
      } else {
        let userProfile = {
          id: user.id,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          rating: user.rating,
          bio: user.bio,
          city: user.city,
          state: user.state,
          stand: user.stand_name
        };
        return res.json(userProfile);
      }
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  res.json({ success: true });
});

module.exports = router;
