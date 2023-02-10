const AppError = require('../utils/AppError');

const sqliteConnection = require('../database/sqlite');

const { hash, compare } = require('bcryptjs');

class UsersControllers {
    async create(request, response) {
        const { name, email, password } = request.body;

        const database = await sqliteConnection();
        const checkIfUserExists = await database.get('SELECT * FROM users WHERE email = (?)', [email])

        if(checkIfUserExists) {
            throw new AppError("Este email já está em uso!")
        }

        const hashedPassword = await hash(password, 8);

        await database.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
        [name, email, hashedPassword]);

        response.status(201).json();
    }

    async update(request, response) {
        const { name, email, password, old_password } = request.body;
        const { id } = request.params;

        const database = await sqliteConnection();
        const user = await database.get('SELECT * FROM users WHERE id = (?)', [id])

        if(!user) {
            throw new AppError('Usuário não encontrado');
        }

        const existingUser = await database.get('SELECT * FROM users WHERE email = (?)', [email])
        console.log(existingUser)
        if(existingUser && existingUser.id != id) {
            throw new AppError('Esse email já está em uso.');
        }

        if(password && !old_password) {
            throw new AppError('Senha Antiga não informada');
        }

        if(password && old_password) {
            const checkOldPassword = await compare(old_password, user.password);
            if(!checkOldPassword) {
                throw new AppError('Senha Antiga não confere');
            }

            user.password = await hash(password, 8);
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;

         await database.run(
        `UPDATE users SET 
         name = (?),
         email = (?),
         password = (?),
         updated_at = DATETIME('now')
         WHERE id = (?)
         `, [user.name, user.email, user.password, user.id])

         return response.status(202).json();
    }
}

module.exports = UsersControllers;