export interface ResponseSchema<T> {
    err?: {
        code?: string;
        message: string
    },
    ok?: {
        data: T
    }
}

export interface UserByUsername {
    description?: string,
    username: string,
    verified?: boolean,
    profile_image_url?: string,
    name: string,
    location?: string,
    url?: string,
    id: string,
    protected?: boolean,
    created_at?: string,
    public_metrics?: {
        followers_count?: number;
        following_count?: number;
        tweet_count?: number;
        listed_count?: number;
    }
}

export interface Tweet {
    id: number,
    text: string,
    username: string,
    created_at: string,
    user_id: bigint,
    tweet_id: string,
    likes: number,
    retweets: number
}

export interface TweetWithImage extends Tweet {
    image_url: string
}

export interface User {
    id: number,
    user_id: bigint,
    username: string,
    image_url: string
}

export interface keyword {
    id: number,
    word: string,
}

export interface Token {
    id: number,
    token: string,
    count: number
}

export interface TopUser {
    count: number,
    username: string,
    image_url: string
}