import {User} from "@/types/User";
import {Video} from "@/types/Video";

export type Comment = {
    id: Number;
    content: String;
    commentOwner: User;
    commentVideo: Video;
}