import dayjs from 'dayjs';
import { db, objectId } from '../dbstrategy/mongo.js';
import { choiceSchema } from '../Schemas/choiceSchema.js'

export async function postChoice(req, res){

    const { title, poolId } = req.body;

    try {

        //valida se tem as informações no request
        const validData = choiceSchema.validate(req.body);

        if(validData.error){
            return res.sendStatus(422);
        }

        //verifica se a enquete existe
        const poolExists = await db.collection('polls').findOne({
             _id: objectId(poolId) 
        });

        if(!poolExists){
            return res.sendStatus(404);
        }

        const dateNow = dayjs().format('YYYY-MM-DD HH:mm');
        const { expireAt } = poolExists;

        //verifica se a enquete é válida
        if(expireAt < dateNow){
            return res.sendStatus(403);
        }

        //verifica se o titulo da opção ja está em uso
        const titleInUse = await db.collection('choices').findOne({ title: title});

        if(titleInUse){
            return res.sendStatus(409);
        }

        //insere a opção na coleção de opções
        const option = await db.collection('choices').insertOne({
            title,
            poolId
        });

        res.send(option).status(201);

    } catch(error){
        res.sendStatus(500);
    }
} 

export async function showPollChoices(req, res){

}