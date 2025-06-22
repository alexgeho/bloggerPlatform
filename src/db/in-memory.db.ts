import { blog } from '../blogs/types/blog';
import { post } from '../posts/types/post';


export const db = {
    blogs: <blog[]>[
        {
            id: 1,
            name: 'TestText',
            description: 'TestText',
            websiteUrl: 'TestText.com',

        },
        {
            id: 2,
            name: 'TestText2',
            description: 'TestText2',
            websiteUrl: 'TestText2.com',
        },
        {
            id: 3,
            name: 'TestText3',
            description: 'TestText3',
            websiteUrl: 'TestText3.com',
        },
    ],



    posts: <post[]>[
        {
            id: 1,
            title: 'titleLine',
            shortDescription: 'descriptionLine',
            content: 'contentLine',
            blogId: 'blogIdLine',
            blogName: 'blogNameLine'
        },

        {
            id: 2,
            title: 'titleLine',
            shortDescription: 'descriptionLine',
            content: 'contentLine',
            blogId: 'blogIdLine',
            blogName: 'blogNameLine'
        },

        {
            id: 3,
            title: 'titleLine',
            shortDescription: 'descriptionLine',
            content: 'contentLine',
            blogId: 'blogIdLine',
            blogName: 'blogNameLine'
        }

        ]
};
