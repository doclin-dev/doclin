import jwt from "jsonwebtoken";
import { User } from "../database/entities/User";

const PORT = process.env.PORT || 3000;

export const githubCallback = (req: any, res: any) => {
    res.redirect(`http://localhost:54321/auth/${req.user.accessToken}`);
}

export const githubLogin = async (_accessToken: any, _refreshToken: any, profile: any, cb: any) => {
    let user = await User.findOne({ where: { githubId: profile.id } });

    if (user) {
        user.name = profile.displayName;
        await user.save();
    } else {
        user = await User.create({
            name: profile.displayName,
            githubId: profile.id,
        }).save();
    }
    
    cb(null, {
        accessToken: jwt.sign(
            { userId: user.id },
            process.env.ACCESS_TOKEN_SECRET,
            {
            expiresIn: "1y",
            }
        ),
    });
}

export const githubOAuthConfig = {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `http://localhost:${PORT}/auth/github/callback`,
}