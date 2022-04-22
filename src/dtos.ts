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

export interface User {
    id: number,
    user_id: bigint,
    user_name: string
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