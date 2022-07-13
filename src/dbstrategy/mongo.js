import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let db = null;
let mongoClient = new MongoClient(process.env.MONGO_URI);

try {
    await mongoClient.connect();
    db = mongoClient.db(process.env.MONGO_DATABASE);
    console.log('conectado ao banco de dados');

} catch (error) {
    console.error('Não foi possível conectar ao banco de dados');
}

export default db;