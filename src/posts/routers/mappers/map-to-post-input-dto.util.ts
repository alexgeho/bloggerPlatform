import { PostInputDto } from '../../application/dtos/post.input-dto';
import { PostUpdateInput } from '../input/post-update.input';

export function mapToPostInputDto(input: PostUpdateInput): PostInputDto {
    // Здесь input.data — это твой объект для обновления
    return {
        id: Number(input.data.id), // преобразуем string в number
        title: input.data.title ?? '', // если нет поля — будет пустая строка
        shortDescription: input.data.shortDescription ?? '',
        content: input.data.content ?? '',
        blogId: input.data.blogId ?? '',
        createdAt: new Date().toISOString(), // или другое значение, если надо
    };
}
