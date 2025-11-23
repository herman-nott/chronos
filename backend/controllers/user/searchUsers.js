import User from '../../database/models/User.js';

async function handleSearchUsers(req, res) {
    const query = req.query.query;
    if (!query) return res.json({ users: [] });

    const regex = new RegExp(query, 'i'); // case-insensitive
    const users = await User.find({ $or: [{ email: regex }, { login: regex }] }).limit(10);
  res.json({ users });
}

export default handleSearchUsers;