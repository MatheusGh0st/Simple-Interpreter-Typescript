"use strict";
/*******************************************
*                                          *
*   INTERPRETER                            *
*                                          *
********************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const input = (0, prompt_sync_1.default)();
const parse_1 = require("./parse");
const lex_1 = require("./lex");
const interpreter = (initialState) => {
    let context = initialState;
    let ast = (0, parse_1.expr)(context);
    let tree = (0, parse_1.createParseTree)(ast);
    let result = (0, parse_1.resolveParseTree)(tree);
    return result;
};
const main = () => {
    while (true) {
        const text = input("λ: ");
        if (text === 'exit')
            break;
        const firstChar = text[0] ? text[0] : "\0";
        const initialState = (0, lex_1.createState)(text, firstChar, 0, lex_1.tokens.I);
        let result = interpreter(initialState);
        console.log(result);
    }
};
main();
