"use strict";
/*******************************************
*                                          *
*   INTERPRETER                            *
*                                          *
********************************************/
const promptSync = require('prompt-sync');
const input = promptSync();
const { createState, Pointer, tokens } = require('./lex');
const { expr, createParseTree, resolveParseTree } = require('./parse');
function createStateN(text, curr_char, curr_pos = 0, curr_token) {
    return { text, curr_char, curr_pos, curr_token };
}
;
const interpreter = (initialState) => {
    let context = initialState;
    let ast = expr(context);
    let tree = createParseTree(ast);
    let result = resolveParseTree(tree);
    return result;
};
const main = () => {
    while (true) {
        const text = input("λ: ");
        if (text === 'exit')
            break;
        const firstChar = text[0] ? text[0] : "\0";
        const initialState = createStateN(text, firstChar, 0, tokens.I);
        let result = interpreter(initialState);
        console.log(result);
    }
};
main();
