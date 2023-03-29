const { hash, compare } = require('bcryptjs');
const AppError = require("../utils/AppError");

class UserCreateService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }

    async execute({ name, email, password }) {
        let checkUserExists = await this.usersRepository.findByEmail(email);

        if(checkUserExists) {
            throw new AppError("Esse email já está em uso");
        }

        const hashedPassword = await hash(password, 8);

        const userCreated = await this.usersRepository.create({ name, email, password: hashedPassword })
        return userCreated;
    }
}

module.exports = UserCreateService;
