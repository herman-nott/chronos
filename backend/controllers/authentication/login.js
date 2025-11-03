import User from "../../database/models/User.js";

async function handleLogin(req, res, bcrypt) {
    const { emailOrLogin, password } = req.body;

    if (!emailOrLogin || !password) {
        return res.status(400).json('Incorrect form submission');
    }

    try {
        const user = await User.findOne({
            $or: [{ email: emailOrLogin }, { login: emailOrLogin }]
        });

        if (!user) {
            return res.status(400).json('Wrong credentials');
        }

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return res.status(400).json('Wrong credentials');
        }

        // добавить сессию
        req.session.user = {
            id: user.id,
            login: user.login
        };

        // вернуть пользователя без пароля
        const { password_hash, ...safeUser } = user.toObject();
        res.json(safeUser);

    } catch (error) {
        // console.error(error);
        res.status(500).json('Server error');
    }
}

export default handleLogin;