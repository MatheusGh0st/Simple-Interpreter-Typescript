/*******************************************
*                                          *
*   INTERPRETER                            *
*                                          *
********************************************/

import PromptSync from "prompt-sync";
const input = PromptSync();
import { expr, createParseTree, resolveParseTree } from './parse';
import { createState, Pointer, tokens } from './lex';

const interpreter = (initialState: Pointer): number => {
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

        const initialState: Pointer = createState(text, firstChar, 0, tokens.I);
        let result = interpreter(initialState);

        console.log(result);
    }
}


main();