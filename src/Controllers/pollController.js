import { db } from '../dbstrategy/mongo.js';
import dayjs from 'dayjs';
import { titleSchema } from '../Schemas/titleSchema.js';

export async function postPoll(req, res){

    const { title } = req.body;
    let expireAt = req.body.expireAt;

    const validData = titleSchema.validate(req.body);

    if(validData.error){
        return res.sendStatus(422);
    }

    if(expireAt === "" || !expireAt){
        expireAt = dayjs().add(30, 'day').format('YYYY-MM-DD HH:MM');
    } 
    
    try {

        await db.collection('polls').insertOne({
            title,
            expireAt
        });

        res.sendStatus(201);

    } catch(error){
        res.send('Não foi possível postar a enquete').status(500);
    }
}

export async function getPoll(req, res){

    try {

        const polls = await db.collection('polls').find().toArray();

        res.send(polls).status(201);
        
    } catch(error){
        res.send('Não foi possível encontrar as enquetes').status(500);
    }

}