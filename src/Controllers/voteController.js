import { db, objectId } from '../dbstrategy/mongo.js';
import dayjs from 'dayjs';

export async function postVote(req, res){

    const choiceId = req.params.id;
    const dateNow = dayjs().format('YYYY-MM-DD HH:mm');

    try {

        //valida se existe a opção
        const validChoice = await db.collection('choices').findOne({
             _id: objectId(choiceId)
        });

        if(!validChoice){
            return res.sendStatus(404);
        }

        //valida se a enquete da opção não expirou
        const validPoll = await db.collection('polls').findOne({
             _id: objectId(validChoice.poolId)
        });

        if(validPoll.expireAt < dateNow){
            return res.sendStatus(403);
        }

        //insere um voto na coleção de votos
        await db.collection('votes').insertOne({
            createdAt: dateNow,
            choiceId: objectId(choiceId)
        });

        res.sendStatus(201);

    } catch(error){
        res.sendStatus(500);
    }

}

export async function showPollResult(req, res){

    const poolId = req.params.id;

    try {

        //verifica se enquete existe
        const validPool = await db.collection('polls').findOne({
            _id: objectId(poolId)
        });

        if(!validPool){
            return res.send('Enquete não encontrada').status(404);
        }

        //encontra as opções da enquete
        const poolChoices = await db.collection('choices').find({ poolId: objectId(poolId) }).toArray();

        let mostVoted = 0;
        let mostVotedTitle = "";
        let result = [];

        //encontra os votos das opções

        const promises = poolChoices.map( async (item) => {

            const vote = await db.collection('votes').find({ choiceId: item._id }).toArray();
            const voteCount = vote.length;

            if(voteCount > mostVoted){
                mostVoted = voteCount;
                mostVotedTitle = item.title;
            }

            return mostVoted, mostVotedTitle;
        });

        const data = await Promise.all(promises);

        const { _id, title, expireAt } = validPool;

        result = {
            _id,
            title,
            expireAt,
            result: {
                title: mostVotedTitle,
                votes: mostVoted
            }
        }

        /* const finalResult = data.slice(-1); */

        res.send(result).status(201);

    } catch(error){
        console.log(error)
        res.sendStatus(500);
    }

}