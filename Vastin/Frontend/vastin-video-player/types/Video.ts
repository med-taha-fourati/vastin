import { User } from "@/types/User";

export type Video = {
    id: number,
    title: string | undefined,
    description: string | undefined,
    length: number | 0,
    videoPath: string | undefined,
    thumbnailPath: string | undefined,
    visibility: Visibility,
    createdAt: string,
    owner: User
};

enum Visibility {
    Public = 0,
    Private = 1,
    Unlisted = 2
}

export function visibilityResolver(input: Visibility ): string {
    switch (input) {
        case Visibility.Public:
            return "Public";
        case Visibility.Private:
            return "Private";
        case Visibility.Unlisted:
            return "Unlisted";
        default:
            return "Unknown";
    }
} 

