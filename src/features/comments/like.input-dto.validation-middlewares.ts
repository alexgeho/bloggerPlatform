import { body } from "express-validator";

export const likeStatusValidation = [ body("likeStatus")
        .isString()
        .withMessage("likeStatus must be a string")
        .isIn(["None", "Like", "Dislike"])
        .withMessage("likeStatus must be one of: None, Like, Dislike"),
];
