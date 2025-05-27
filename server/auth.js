import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";

// Passport config
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.AUTH_GOOGLE_ID,
			clientSecret: process.env.AUTH_GOOGLE_SECRET,
			callbackURL: "/auth/google/callback",
		},
		async (accessToken, refreshToken, profile, done) => {
			// Aquí puedes buscar/crear el usuario en tu BD y agregar info extra
			// Ejemplo: const user = await User.findOrCreate({ googleId: profile.id })
			return done(null, profile);
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});
passport.deserializeUser((user, done) => {
	done(null, user);
});

export default passport;
