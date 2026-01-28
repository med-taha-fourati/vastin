import { User } from "@/types/User";

export type Video = {
    id: number,
    title: string | undefined,
    description: string | undefined,
    length: number | 0,
    videoPath: string | undefined,
    thumbnailPath: string | undefined,
    visibility: "Public" | "Private" | "Unlisted",
    createdAt: string,
    owner: User
};

