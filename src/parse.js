"use strict";
/*******************************************
*                                          *
*   PARSER                                 *
*                                          *
********************************************/
Object.defineProperty(exports, "__esModule", { value: true });
const { modifyState, tokens, skipWhitespace, advance_char, advance_pos, token, checkToken, integer, getNextToken, Pointer, Token } = require('./lex');
const numberLiteral = (value, token) => ({
    type: "NumberLiteral",
    token,
    value
});
const binaryExpression = (operator, left, right) => ({
    type: "BinaryExpression",
    children: [left, right],
    value: operator
});
const term = (textState) => {
    let context = textState;
    let node = factor(context);
    while (context.curr_char !== undefined) {
        let token = getNextToken(context);
        if (token.type === tokens.MULT) {
            checkToken(token.type, context);
        }
        else if (token.type === tokens.DIV) {
            checkToken(token.type, context);
        }
        node = binaryExpression(parseToken(token.type), node, factor(context));
    }
    return node;
};
const factor = (textState) => {
    let context = textState;
    let token = getNextToken(context);
    if (token.type === tokens.INTEGER) {
        checkToken(token.type, context);
        return numberLiteral(token.value, tokens.INTEGER);
    }
    if (token.type === tokens.LPAREN) {
        checkToken(token.type, context);
        let node = expr(context);
        checkToken(tokens.RPAREN, context);
        return node;
    }
    return { type: tokens.I.toString() };
};
const parseToken = (token) => {
    switch (token) {
        case 3:
            return tokens[tokens.PLUS].toString();
        case 4:
            return tokens[tokens.MINUS].toString();
        case 5:
            return tokens[tokens.MULT].toString();
        case 6:
            return tokens[tokens.DIV].toString();
        default:
            return tokens[tokens.I].toString();
    }
};
const expr = (textState) => {
    let context = textState;
    let node = term(context);
    let leftToken;
    let rightToken;
    [{ token: leftToken }, { token: rightToken }] = node.children;
    while (((leftToken in tokens) || (rightToken in tokens)) && (context.curr_char !== undefined)) {
        let token = getNextToken(context);
        if (token.type === tokens.PLUS) {
            checkToken(token.type, context);
        }
        if (token.type === tokens.MINUS) {
            checkToken(token.type, context);
        }
        node = binaryExpression(parseToken(token.type), node, term(context));
    }
    return node;
};
const createParseTree = (node) => {
    var _a;
    if (node.type === "BinaryExpression") {
        const left = createParseTree(node.children[0]);
        const right = createParseTree(node.children[1]);
        return {
            type: node.value || "",
            children: [left, right],
        };
    }
    else if (node.type === "NumberLiteral") {
        return {
            type: "Number",
            value: ((_a = node.value) === null || _a === void 0 ? void 0 : _a.toString()) || "",
        };
    }
    else {
        return {
            type: "Erro",
        };
    }
};
const resolveParseTree = (parseTree) => {
    if (parseTree.type === "Number") {
        return parseInt(parseTree.value || "0");
    }
    else if (parseTree.type === "PLUS") {
        const left = resolveParseTree(parseTree.children[0]);
        const right = resolveParseTree(parseTree.children[1]);
        return left + right;
    }
    else if (parseTree.type === "MINUS") {
        const left = resolveParseTree(parseTree.children[0]);
        const right = resolveParseTree(parseTree.children[1]);
        return left - right;
    }
    else if (parseTree.type === "MULT") {
        const left = resolveParseTree(parseTree.children[0]);
        const right = resolveParseTree(parseTree.children[1]);
        return left * right;
    }
    else if (parseTree.type === "DIV") {
        const left = resolveParseTree(parseTree.children[0]);
        const right = resolveParseTree(parseTree.children[1]);
        return left / right;
    }
    else if (parseTree.type === "PAREN") {
        return resolveParseTree(parseTree.children[0]);
    }
    else if (parseTree.type === "BinaryExpression") {
        const left = resolveParseTree(parseTree.children[0]);
        const operator = parseTree.value;
        const right = resolveParseTree(parseTree.children[1]);
        if (operator === "+") {
            return left + right;
        }
        else if (operator === "-") {
            return left - right;
        }
        else if (operator === "*") {
            return left * right;
        }
        else if (operator === "/") {
            return left / right;
        }
        else {
            throw new Error(`Unknown operator: ${operator}`);
        }
    }
    else {
        throw new Error(`Unknown parse tree node type: ${parseTree.type}`);
    }
};
exports.default = {
    expr,
    createParseTree,
    resolveParseTree
};
