import User from '../../db/users.js';
import formidable from 'formidable';

const client_ID = "99edec02c798ed5"
const imgur_api = "https://api.imgur.com/3/image"

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

const getMyUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user_uuid);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
};

const updateMyUserProfile = async (req, res) => {
    try {
        const { name, lastname } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user_uuid,
            { name, lastname },
            { new: true }
        );
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update user profile' });
    }
};

export const saveUserPicture = async (req, res) => {
    const form = formidable({ multiples: false });
    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(400).json({ error: 'Form parse error' });
        const base64Image = fields.image;
        if (!base64Image) return res.status(400).json({ error: 'No image provided' });

        try {
            const formdata = new URLSearchParams();
            formdata.append("image", base64Image);
            formdata.append("type", "base64");
            formdata.append("title", req.user_uuid);
            formdata.append("description", req.user_uuid);

            const response = await fetch(imgur_api, {
                method: "POST",
                body: formdata,
                headers: {
                    'Authorization': `Client-ID ${client_ID}`
                }
            });
            const response_json = await response.json();
            if (response.ok) {
                await User.findByIdAndUpdate(
                    req.user_uuid,
                    { profilePicture: response_json.data.link }
                );
                return res.status(201).json({ message: response_json.data.link });
            } else {
                return res.status(400).json({ message: response_json });
            }
        } catch (err) {
            console.error('Error saving user picture:', err);
            return res.status(500).json({ error: err });
        }
    });
};

export {
    getUsers, deleteUser, updateMyUserProfile, getMyUserProfile
}