const imagekit = require('../libs/imagekit')
const path = require('path')
const qr = require('qr-image')
const { updateProfile } = require('./auth.controllers')
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient();

module.exports = {
    imageKitUpload: async (req, res, next) => {
        try {
            let strFile = req.file.buffer.toString('base64')

            let { url } = await imagekit.upload({
                fileName: Date.now() + path.extname(req.file.originalname),
                file: strFile
            })

            res.json({
                status: true,
                message: 'OK',
                data: url
            })
        }
        catch (err) {
            next(err)
        }
    },
    generateQR: async (req, res, next) => {
        try {
            let { qr_data } = req.body

            if (!qr_data) {
                return res.status(400).json({
                    status: false,
                    message: 'qr_data is required',
                    data: null
                })
            }

            let qrCode = qr.imageSync(qr_data, { type: 'png' })

            let { url } = await imagekit.upload({
                fileName: Date.now() + '.png',
                file: qrCode.toString('base64')
            })

            res.status(200).json({
                status: true,
                message: 'OK',
                data: url
            })
        }
        catch (err) {
            next(err)
        }
    },

    updateProfilePic: async (req, res, next) => {
        try {
            let strFile = req.file.buffer.toString('base64')
            let id = Number(req.params.id)

            let exist = await prisma.user.findUnique({ where: { id } })
            if (!exist) {
                return res.status(400).json({
                    status: false,
                    message: `user not found`,
                    data: null
                })
            }


            let { url } = await imagekit.upload({
                fileName: Date.now() + path.extname(req.file.originalname),
                file: strFile
            })


            let updatedUser = await prisma.user.update({
                where: { id },
                data: {
                    avatar_url: url
                }

            })

            return res.status(200).json({
                status: true,
                message: `avatar updated`,
                data: {
                    id: updatedUser.id,
                    avatar_url: updatedUser.avatar_url
                }
            });
        }
        catch (err) {
            next(err)
        }
    },
}