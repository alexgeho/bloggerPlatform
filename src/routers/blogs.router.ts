import {Request, Response, Router} from "express";
import {BlogInputDto} from "../blogs/dto/blog.input-dto";
import {blogInputDtoValidation} from "../blogs/validation/blogInputDtoValidation";
import {blog, BlogViewModel} from "../blogs/types/blog";
import {HttpStatus} from "../core/types/http-statuses";
import {createErrorMessages} from "../core/utils/error.utils";
import {db} from "../db/in-memory.db"


export const blogsRouter = Router({});

blogsRouter

    .get("/", (req, res) => {
        // возвращаем все блоги
        res.status(200).send(
            db.blogs.map(blog => ({
                ...blog,
                id: String(blog.id)
            })));
    })

    .post("/", (req, res) => {
        const errors = blogInputDtoValidation(req.body);
        if (errors.length > 0) {
            res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
        }
        //1) проверяем приходящие данные на валидность
        //2) создаем newBlog
        const newBlog: blog = {
            id: db.blogs.length ? db.blogs[db.blogs.length - 1].id + 1 : 1,
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl
        };

        //3) добавляем newBlog в БД
        db.blogs.push(newBlog);

        // Возвращаем копию newBlog, но id как строка
        res.status(HttpStatus.Created).send({
            ...newBlog,
            id: String(newBlog.id)
        });
    })

    .get("/:id", (req: Request<{ id: string }>, res: Response<BlogViewModel | null>) => {
        const blog = db.blogs.find(b => b.id === +req.params.id);

        if (!blog) {
            res.sendStatus(404);
            return;
        }

        res.status(200).send({
            ...blog,
            id: String(blog.id),
        });
    })

    .put('/:id', (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const index = db.blogs.findIndex((v) => v.id === id);

        if (index === -1) {
            res
                .status(HttpStatus.NotFound)
                .send(
                    createErrorMessages([{field: 'id', message: 'Blog not found'}]),
                );


            return;
        }

// Оценить!
        const errors = blogInputDtoValidation(req.body);
        if (errors.length > 0) {
            res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
            return;
        }

        const blog = db.blogs[index];

        blog.name = req.body.name;
        blog.description = req.body.description;
        blog.websiteUrl = req.body.websiteUrl;

        res.status(200).send({message: "Blog was updated successfully"});
    })

