const UserCreateService = require("./UserCreateService");
const UsersRepositoryInMemory = require("../repositories/UsersRepositoryInMemory");
const AppError = require("../utils/AppError");


describe("UserCreateService", () => {
    let usersRepositoryInMemory = null;
    let userCreateService = null;

    beforeEach(()=> {
        usersRepositoryInMemory = new UsersRepositoryInMemory()
        userCreateService = new UserCreateService(usersRepositoryInMemory)
    })

    it("user should be created", async () => {
        const user = {
            name: "user",
            email: "user@test.com",
            password: "123"
        };
    
        const userCreated = await userCreateService.execute(user)
    
        console.log(userCreated)
        expect(userCreated).toHaveProperty("id")
    })

    it("user should not be created if email already exists", async () => {
        const user1 = {
            name: "user1",
            email: "user@test.com",
            password: "123"
        };
        
        const user2 = {
            name: "user2",
            email: "user@test.com",
            password: "456"
        };

        await userCreateService.execute(user1)
        await expect(userCreateService.execute(user2)).rejects.toEqual(new AppError("Esse email já está em uso"));
    })
})