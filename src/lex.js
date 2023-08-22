"use strict";
/*******************************************
*                                          *
*   LEXER                                  *
*                                          *
********************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextToken = exports.integer = exports.checkToken = exports.advance_pos = exports.advance_char = exports.skipWhitespace = exports.modifyState = exports.createState = exports.tokens = void 0;
var tokens;
(function (tokens) {
    tokens[tokens["I"] = 1] = "I";
    tokens[tokens["INTEGER"] = 2] = "INTEGER";
    tokens[tokens["PLUS"] = 3] = "PLUS";
    tokens[tokens["MINUS"] = 4] = "MINUS";
    tokens[tokens["MULT"] = 5] = "MULT";
    tokens[tokens["DIV"] = 6] = "DIV";
    tokens[tokens["LPAREN"] = 7] = "LPAREN";
    tokens[tokens["RPAREN"] = 8] = "RPAREN";
    tokens[tokens["EOF"] = 9] = "EOF";
})(tokens = exports.tokens || (exports.tokens = {}));
;
;
;
// let createState = function (text: string,
function createState(text, curr_char, curr_pos = 0, curr_token) {
    return { text, curr_char, curr_pos, curr_token };
}
exports.createState = createState;
;
const modifyState = (oldState, newState) => {
    oldState.text = newState.text;
    oldState.curr_char = newState.curr_char;
    oldState.curr_pos = newState.curr_pos;
    oldState.curr_token = newState.curr_token;
    return oldState;
};
exports.modifyState = modifyState;
const skipWhitespace = (textState) => {
    while (textState.curr_char !== undefined && textState.curr_char === ' ') {
        textState = advance_char(textState);
    }
    return textState;
};
exports.skipWhitespace = skipWhitespace;
const advance_char = (textState) => {
    textState = advance_pos(textState);
    if (!(textState.text[textState.curr_pos] === '\0')) {
        let state = createState(textState.text, textState.text[textState.curr_pos], textState.curr_pos, textState.curr_token);
        return modifyState(textState, state);
    }
    let state = createState(textState.text, '\0', textState.curr_pos, tokens.EOF);
    return modifyState(textState, state);
};
exports.advance_char = advance_char;
const advance_pos = (textState) => {
    let state = createState(textState.text, textState.text[textState.curr_pos], textState.curr_pos + 1, textState.curr_token);
    return modifyState(textState, state);
};
exports.advance_pos = advance_pos;
const token = (type, value) => {
    return { type, value };
};
const checkToken = (token, state) => {
    if (state.curr_token === token) {
        state.curr_token = token;
    }
};
exports.checkToken = checkToken;
const integer = (textState) => {
    let result = '';
    while (textState.curr_char !== undefined &&
        !isNaN(parseInt(textState.curr_char))) {
        result += textState.curr_char;
        textState = advance_char(textState);
    }
    return parseInt(result);
};
exports.integer = integer;
const getNextToken = (textState) => {
    while (textState.curr_char !== undefined) {
        if (textState.curr_char === ' ') {
            textState = skipWhitespace(textState);
        }
        if (!isNaN(parseInt(textState.curr_char))) {
            textState.curr_token = tokens.INTEGER;
            return token(tokens.INTEGER, integer(textState));
        }
        if (textState.curr_char === '+') {
            textState = advance_char(textState);
            textState.curr_token = tokens.PLUS;
            return token(tokens.PLUS, '+');
        }
        if (textState.curr_char === '-') {
            textState = advance_char(textState);
            textState.curr_token = tokens.MINUS;
            return token(tokens.MINUS, '-');
        }
        if (textState.curr_char === '*') {
            textState = advance_char(textState);
            textState.curr_token = tokens.MULT;
            return token(tokens.MULT, '*');
        }
        if (textState.curr_char === '/') {
            textState = advance_char(textState);
            textState.curr_token = tokens.DIV;
            return token(tokens.DIV, '/');
        }
        if (textState.curr_char === '(') {
            textState = advance_char(textState);
            textState.curr_token = tokens.LPAREN;
            return token(tokens.LPAREN, '(');
        }
        if (textState.curr_char === ')') {
            textState = advance_char(textState);
            textState.curr_token = tokens.RPAREN;
            return token(tokens.RPAREN, ')');
        }
    }
    textState.curr_token = tokens.EOF;
    return token(tokens.EOF, null);
};
exports.getNextToken = getNextToken;
