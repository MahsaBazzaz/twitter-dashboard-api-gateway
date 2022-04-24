export interface ResponseSchema<T> {
    status: boolean,
    data: T
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
    image_url : string 
}