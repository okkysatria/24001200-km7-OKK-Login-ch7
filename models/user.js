const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const HttpRequestError = require('../utils/error');

const prisma = new PrismaClient();

module.exports = {
    create: async ({ fullName, email, password }) => {
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: { fullName, email, password: hashedPassword },
        });
    },
    login: async ({ email, password }) => {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new HttpRequestError('Invalid credentials', 401);
        }

        return { id: user.id, fullName: user.fullName, email: user.email };
    },
    generatePasswordResetToken: async (email) => {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new HttpRequestError('User not found', 404);

        const token = crypto.randomBytes(32).toString('hex');
        const expiry = new Date(Date.now() + 60 * 60 * 1000);

        await prisma.user.update({
            where: { email },
            data: { passwordResetToken: token, passwordResetTokenExpiry: expiry },
        });

        return token;
    },
    resetPassword: async ({ token, password }) => {
        const user = await prisma.user.findFirst({
            where: {
                passwordResetToken: token,
                passwordResetTokenExpiry: { gte: new Date() },
            },
        });

        if (!user) throw new HttpRequestError('Invalid or expired token', 400);

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword, passwordResetToken: null, passwordResetTokenExpiry: null },
        });
    },
};
