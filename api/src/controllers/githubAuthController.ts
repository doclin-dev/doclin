import jwt from "jsonwebtoken";
import axios from "axios";
import { User } from "../database/entities/User";
import { 
    PRODUCTION_SERVER_URL, 
    DEVELOPMENT_SERVER_URL, 
    PRODUCTION, 
    ACCESS_TOKEN_SECRET, 
    GITHUB_CLIENT_ID, 
    GITHUB_CLIENT_SECRET 
} from "../envConstants";
import { UserRepository } from "../database/repositories/UserRepository";
import { Request, Response } from "express";

const SERVER_URL = PRODUCTION ? PRODUCTION_SERVER_URL : DEVELOPMENT_SERVER_URL;
const VSCODE_AUTH_URL = `http://localhost:54321/auth/`;

export const GITHUB_OAUTH_CONFIG = {
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: `${SERVER_URL}/auth/github/callback`,
}

export const githubCallback = async (req: Request, res: Response) => {
    const token = (req.user as any)?.accessToken;

    const header = {
        headers: {
          'Content-Type': 'application/json',
        },
    };

    const data = { token }

    try {
        await axios.post(VSCODE_AUTH_URL, data, header);
        res.send("Authentication complete! You can close this now.");
    } catch (error) {
        console.error(error);
        res.status(400).send("Unable to authenticate!");
    }

}

export const githubLogin = async (_accessToken: any, _refreshToken: any, profile: any, callback: any) => {
    let user = await UserRepository.findUserByGithubId(profile.id);

    if (user) {
        await updateUserDetails(user, profile);
    } else {
        user = await createUser(profile);
    }
    
    callback(null, {
        accessToken: jwt.sign({ userId: user.id }, ACCESS_TOKEN_SECRET, { expiresIn: "1y" }),
    });
}

const updateUserDetails = async (user: User, profile: any) => {
    user.name = profile.displayName;
    await user.save();
}

const createUser = async (profile: any) => {
    return await User.create({
        name: profile.displayName,
        githubId: profile.id,
    }).save();
}