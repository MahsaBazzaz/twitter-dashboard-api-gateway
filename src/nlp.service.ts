import { Injectable } from '@nestjs/common';
import 'dotenv/config';
var natural = require('natural');
const { removeStopwords, eng } = require('stopword')

@Injectable()
export class NlpService {
    private readonly tokenizer;
    constructor() {
        this.tokenizer = new natural.AggressiveTokenizer();
        // natural.PorterStemmer.attach();
    }

    getHello(): string {
        return 'Hello World!';
    }

    private async clean(input: string[]): Promise<string[]> {
        let newString: string[] = [];
        for (const t of input) {
            if (!t.includes("@") && !t.includes("https:") && !t.includes("www.") && !t.includes("http:"))
                newString.push(t)
        }
        const output = removeStopwords(newString, eng);
        return output;
    }

    private async tokenize(text: string): Promise<string[]> {
        let tokens = this.tokenizer.tokenize(text);
        return tokens;
    }

    async stem(word: string): Promise<string> {
        let stem1 = natural.PorterStemmer.stem(word);
        let stem2 = natural.LancasterStemmer.stem(word);
        return stem2;
    }

    async getTokens(text: string): Promise<string[]> {
        let cleanedText = await this.clean(text.toLowerCase().split(' '));
        let tokens = await this.tokenize(cleanedText.join(' '));
        return tokens;
    }

    
}