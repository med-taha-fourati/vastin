import {User} from "@/types/User";

export type Video = {
    id: Number,
    title: string | undefined,
    description: string  | undefined,
    length:  Number | 0,
    videoPath: string | undefined,
    thumbnailPath: string | undefined,
    owner: User
};

