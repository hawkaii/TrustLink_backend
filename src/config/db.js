import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
/* const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const mongoose = require('mongoose');




export default prisma;

mongoose.connect('mongodb://localhost/social_media', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = mongoose; */
