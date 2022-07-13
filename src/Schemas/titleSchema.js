import joi from "joi";

export const titleSchema = joi.object({
    title: joi.string().required(),
    expireAt: joi.string().allow("")
});

