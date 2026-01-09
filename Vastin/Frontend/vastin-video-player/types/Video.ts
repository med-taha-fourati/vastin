import {User} from "@/types/User";

export type Video = {
    id: Number,
    title: String | null,
    description: String  | null,
    length:  Number | 0,
    videoPath: String | null,
    thumbnailPath: String | null,
    owner: User
};

