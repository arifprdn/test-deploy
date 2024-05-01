const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient();

module.exports = {
    register: async (req, res, next) => {
        try {
            let { first_name, last_name, email, password } = req.body
            if (!first_name || !last_name || !email || !password) {
                return res.status(400).json({
                    status: false,
                    message: `fields can not empty!!`,
                    data: null
                });
            }
            let exist = await prisma.user.findUnique({ where: { email } })
            if (exist) {
                return res.status(400).json({
                    status: false,
                    message: `user already exist`,
                    data: null
                })
            }

            let user = await prisma.user.create({
                data: {
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    password: password
                }
            })

            return res.status(201).json({
                status: true,
                message: `account created`,
                data: {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email
                }
            });
        }
        catch (err) {
            next(err)
        }

    },

    updateProfile: async (req, res, next) => {
        try {
            let id = Number(req.params.id)
            let { first_name, last_name, email, address, occupation } = req.body
            if (!id || !first_name || !last_name || !email || !address || !occupation) {
                return res.status(400).json({
                    status: false,
                    message: `fields can not empty`,
                    data: null
                });
            }
            let exist = await prisma.user.findUnique({ where: { id } })
            if (!exist) {
                return res.status(400).json({
                    status: false,
                    message: `user not found`,
                    data: null
                })
            }

            let updatedUser = await prisma.user.update({
                where: { id },
                data: {
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    address: address,
                    occupation: occupation
                }

            })

            return res.status(200).json({
                status: true,
                message: `account updated`,
                data: {
                    id: updatedUser.id,
                    first_name: updatedUser.first_name,
                    last_name: updatedUser.last_name,
                    email: updatedUser.email,
                    address: updatedUser.address,
                    occupation: updatedUser.occupation
                }
            });
        }
        catch (err) {
            next(err)
        }
    }
};