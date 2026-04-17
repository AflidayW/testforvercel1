import { query } from "express-validator";
import { PostSortFieldEnum, PostDirectionEnum } from '..//middlewares/main.enums';


export const sortValidator = [
    query('sortBy')
        .optional()
        .default(PostSortFieldEnum.CREATED_AT)
        .isIn(Object.values(PostSortFieldEnum))
        .withMessage(`Allowed sort fields: ${Object.values(PostSortFieldEnum).join(', ')}`),
    query("sortDirection")
        .optional()
        .default(PostDirectionEnum.DESC)
        .isIn(Object.values(PostDirectionEnum))
        .withMessage(`Allowed sort fields: ${Object.values(PostDirectionEnum).join(', ')}`),
    query('pageNumber')
        .optional()
        .default(1)
        .isInt({ min: 1 })
        .withMessage('pageNumber must be a positive integer')
        .toInt(),
    
    query('pageSize')
        .optional()
        .default(10)
        .isInt({ min: 1 })
        .withMessage('pageSize must be a positive integer')
        .toInt(),

]

