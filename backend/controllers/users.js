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

const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

export {
    getUsers, deleteUser
}