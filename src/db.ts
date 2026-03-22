// db.ts
import { Collection, Db, MongoClient } from 'mongodb';


const mongoUri = "mongodb+srv://admin:12345@incubator.gje1g5d.mongodb.net/?appName=Incubator";

const dbName = "Incubetor";

export let db: Db;
export const client = new MongoClient(mongoUri);

export const runDb = async () => {
    try {
        await client.connect();
        db = client.db(dbName);
        console.log("✅ Connected to MongoDB");
    } catch (e) {
        console.error("❌ MongoDB connection error:", e);
        await client.close();
    }
};


// type Video = {
//     id: number;
//     title: string;
//     author: string;
//     canBeDownloaded: boolean;
//     minAgeRestriction: null | number;
//     createdAt: string;
//     publicationDate: string;
//     availableResolutions: string[];
// }

// type Blog = {
//     id: string;
//     name: string;
//     description: string;
//     websiteUrl: string;
// }

// type Posts = {
//     id: string;
//     blogId: string;
//     title: string,
//     content: string;
//     shortDescription: string;
//     blogName: string
// }

// export const db: { videos: Video[], blogs: Blog[], posts: Posts[] } = {
//     videos: [{
//         id: 1,
//         title: "Fack",
//         author: "Bukva",
//         canBeDownloaded: true,
//         minAgeRestriction: null,
//         createdAt: new Date().toISOString(),
//         publicationDate: new Date().toISOString(),
//         availableResolutions: ["P144"]
//     }],

//     blogs: [{
//         id: '1',
//         name: "Blog_fack",
//         description: "Bukva_fuck",
//         websiteUrl: "https://localhost:5000",
//     }],

//     posts: [{
//         id: "1",
//         blogId: "1",
//         title: "Fuck_Post",
//         content: "Fuck_post",
//         shortDescription: "Fuck_describtion",
//         blogName: "Fuck_Blog"
//     }]
// }