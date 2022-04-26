import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import 'dotenv/config';
import { ResponseSchema } from './dtos';
var natural = require('natural');

@Injectable()
export class NlpService {
    private readonly tokenizer;
    // private readonly stemmer;
    constructor() {
        this.tokenizer = new natural.AggressiveTokenizer();
    }

    getHello(): string {
        return 'Hello World!';
    }

    async clean(input: string): Promise<string> {
        let output: string = "";
        let text = input.toLowerCase().split(' ');
        for (const t of text) {
            if (!t.includes("@"))
                output += " " + t;
        }
        return output;
    }

    async tokenize(text: string): Promise<string[]> {
        let cleanedText = await this.clean(text);
        let tokens = this.tokenizer.tokenize(cleanedText.toLowerCase());
        return tokens;
    }

    async stem(word: string): Promise<string> {
        let stem = natural.PorterStemmer.stem(word.toLowerCase());
        return stem;
    }

}