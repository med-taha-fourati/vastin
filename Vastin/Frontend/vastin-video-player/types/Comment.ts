import { User } from "./User";

export type Comment = {
    id: number;
    content: string;
    createdAt: string;
    commentOwner: User;
    videoOwnerId: number;
};