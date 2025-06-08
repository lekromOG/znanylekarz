import jwt from 'jsonwebtoken';
import * as fs from 'node:fs';

const authenticateToken = async (req, res, next) => {
    try {
        const authorization = req.get('Authorization');
        if (!authorization) {
            return res.status(401).json({ error: 'No authorization header' });
        }
        const token = authorization.split(' ')[1]; 

        if (token != null) {
            var publicKey = fs.readFileSync('./backend/keys/pubkey.pem', 'utf8');
            jwt.verify(token, publicKey, (err, user) => {
                if (err) { return res.status(401).json({ error: `${err}` }); }
                req.user_uuid = user.sub;
                next();
            });
        } 
        else return res.status(401).json({ error: 'No token provided' });
    } catch (err) {
        console.log(err);
        return res.status(401).json({ error: "Unauthorized" }) 
    };
};

export {
    authenticateToken
};