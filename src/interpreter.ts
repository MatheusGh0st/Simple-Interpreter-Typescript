/*******************************************
*                                          *
*   INTERPRETER                            *
*                                          *
********************************************/

const promptSync = require('prompt-sync');
const input = promptSync();
const { createState, Pointer, tokens } = require('./lex');
const { expr, createParseTree, resolveParseTree } = require('./parse');

function createStateN(text: string, 
    curr_char: string, 
    curr_pos: number = 0, 
    curr_token: typeof tokens): typeof Pointer {
    return { text, curr_char, curr_pos, curr_token };
};

const interpreter = (initialState: typeof Pointer): number => {
    let context = initialState;

    let ast = expr(context);

    let tree = createParseTree(ast);
    let result = resolveParseTree(tree);
    return result;
};


const main = () => {
    while (true) {
        const text: string = input("λ: ");

        if (text === 'exit')
            break;

        const firstChar = text[0] ? text[0] : "\0";

        const initialState: typeof Pointer = createStateN(text, firstChar, 0, tokens.I);
        let result = interpreter(initialState);

        console.log(result);
    }
}


main();