import jwt from 'jsonwebtoken';
import * as fs from 'node:fs';

const authenticateToken = async (req, res, next) => {
    try {
        const authorization = req.get('Authorization');
        const token = authorization.split(' ')[1]; 
        console.log(token); // Log the token for debugging
        if (token != null) {
            var publicKey = fs.readFileSync('./backend/keys/pubkey.pem', 'utf8');
            jwt.verify(token, publicKey, (err, user) => {
                if (err) { return res.status(500).json({ error: `${err}` }); }
                req.user_uuid = user.sub;
                next();
            });
        } 
        else return res.status(200).json({ role: "guest" });
    } catch (err) {
        console.log(err);
        return res.status(200).json({ role: "guest" }) 
    };
};

export {
    authenticateToken
};