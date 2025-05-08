import jwt from 'jsonwebtoken';

const authenticateToken = async (req, res, next) => {
    try {
        const authorization = req.get('Authorization');
        const token = authorization.split(' ')[1]; 

        if (token != null) {
            jwt.verify(token, 'privateKey', (err, user) => {
                if (err) { return res.status(500).json({ error: `${err}` }); }
                req.user_uuid = user.sub;
                next();
            });
        } else return res.status(200).json({ role: "guest" });
    } catch (err) { 
        return res.status(200).json({ role: "guest" }) 
    };
};

export {
    authenticateToken
};