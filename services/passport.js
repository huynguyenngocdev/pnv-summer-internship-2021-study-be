import { Strategy } from 'passport-google-oauth20';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import keys from '../config/config.js';
import passport from 'passport';

import User from '../app/models/user.model.js';
import MyClassFolder from '../app/models/myClassFolder.model.js';
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new Strategy(
    {
      clientID: keys.GOOGLE_CLIENT_ID,
      clientSecret: keys.GOOGLE_CLIENT_SECRET,
      callbackURL: keys.GOOGLE_CALLBACK_URL,
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      const encryptedGoogleId = await bcrypt.hash(profile.id, 10);

      const existingUser = await User.findOne({
        email: profile.emails[0].value,
      });

      if (existingUser) {
        return done(null, existingUser);
      }
      const user = await new User({
        googleId: encryptedGoogleId,
        email: profile.emails[0].value,
        name: profile.name.familyName + ' ' + profile.name.givenName,
        avatar: profile.photos[0].value,
      });
      const myfolder = await MyClassFolder.create({
        name: 'myfolder',
        userName: profile.name.familyName + ' ' + profile.name.givenName,
        userId: user.id,
      });
      user.myClassFolder = myfolder.id;
      user.save();
      return done(null, user);
    }
  )
);
export default passport;
