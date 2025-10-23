import passport from 'passport'
import PassportJWT from 'passport-jwt'
import PassportHttp from 'passport-http'
import { SECRET } from '../utils/config.js'
import UserModel from '../models/user.model.js'
import { comparePassword } from '../utils/helper.js'

const options = {
  jwtFromRequest: PassportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET,
}

passport.use(
  // JWT Strategy
  new PassportJWT.Strategy(options, async (payload, done) => {
    try {
      const user = await UserModel.findOne({ _id: payload.id }) // Find user by ID stored in JWT payload
      if (user) {
        return done(null, {
          _id: user._id,
          email: user.email,
          displayName: user.displayName,
        }) // User found, return user object - don't return the whole user object
      } else {
        return done(null, false) // User not found
      }
    } catch (error) {
      return done(error) // Error occurred
    }
  })
)

passport.use(
  // Basic Strategy
  new PassportHttp.BasicStrategy(async (userid, password, done) => {
    try {
      const user = await UserModel.findOne({ email: userid }) // Find user by email (userid)
      if (!user) {
        return done(null, false) // User not found
      }
      const isPasswordCorrect = await comparePassword(
        password,
        user.passwordHash
      ) // Compare provided password with stored password hash
      if (!isPasswordCorrect) {
        return done(null, false) // Password incorrect
      }
      return done(null, {
        _id: user._id,
        email: user.email,
        displayName: user.displayName,
      }) // Authentication successful, return user object - don't return the whole user object
    } catch (error) {
      return done(error) // Error occurred
    }
  })
)

export function optionalAuthenticate(req, res, next) {
  // Custom middleware to optionally authenticate user
  passport.authenticate(['jwt', 'basic'], { session: false }, (err, user) => {
    if (err) {
      return next(err)
    }
    if (user) {
      req.user = user
    }
    next()
  })(req, res, next)
}

export default passport
