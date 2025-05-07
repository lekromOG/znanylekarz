import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) res.sendStatus(401);

    jwt.verifyverify(token, process.env.TOKEN_SECRET, (err, user) => {
        console.log(err);
        if (err) res.sendStatus(403);
        req.user = user;
        next();
    });
};

export {
    authenticateToken
};