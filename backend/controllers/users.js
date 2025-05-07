import User from '../../db/users.js';

const getUsers = async (req, res) => {
    try {
        const allUsers = await User.find(); 
        if (!allUsers || allUsers.length === 0) {
            res.status(404).json({ error: 'No users found' });
        } res.json(allUsers);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}

export {
    getUsers
}