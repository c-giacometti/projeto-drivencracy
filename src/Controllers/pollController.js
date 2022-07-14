import { db } from '../dbstrategy/mongo.js';
import dayjs from 'dayjs';
import { titleSchema } from '../Schemas/titleSchema.js';

export async function postPoll(req, res){

    const { title } = req.body;
    let expireAt = req.body.expireAt;

    //validação inicial de dados
    const validData = titleSchema.validate(req.body);

    if(validData.error){
        return res.sendStatus(422);
    }

    //verifica se a enquete tem validade, se não insere 30 dias
    if(expireAt === "" || !expireAt){
        expireAt = dayjs().add(30, 'day').format('YYYY-MM-DD HH:mm');
    } 
    
    //insere a enquete na coleção de enquetes
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

    //retorna a coleção de enquetes
    try {

        const polls = await db.collection('polls').find().toArray();

        res.send(polls).status(201);
        
    } catch(error){
        res.send('Não foi possível encontrar as enquetes').status(500);
    }

}