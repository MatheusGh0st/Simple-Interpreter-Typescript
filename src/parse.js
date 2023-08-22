"use strict";
/*******************************************
*                                          *
*   PARSER                                 *
*                                          *
********************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveParseTree = exports.createParseTree = exports.expr = void 0;
const lex_1 = require("./lex");
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
        let token = (0, lex_1.getNextToken)(context);
        if (token.type === lex_1.tokens.MULT) {
            (0, lex_1.checkToken)(token.type, context);
        }
        else if (token.type === lex_1.tokens.DIV) {
            (0, lex_1.checkToken)(token.type, context);
        }
        node = binaryExpression(parseToken(token.type), node, factor(context));
    }
    return node;
};
const factor = (textState) => {
    let context = textState;
    let token = (0, lex_1.getNextToken)(context);
    if (token.type === lex_1.tokens.INTEGER) {
        (0, lex_1.checkToken)(token.type, context);
        return numberLiteral(token.value, lex_1.tokens.INTEGER);
    }
    if (token.type === lex_1.tokens.LPAREN) {
        (0, lex_1.checkToken)(token.type, context);
        let node = expr(context);
        (0, lex_1.checkToken)(lex_1.tokens.RPAREN, context);
        return node;
    }
    return { type: lex_1.tokens.I.toString() };
};
const parseToken = (token) => {
    switch (token) {
        case 3:
            return lex_1.tokens[lex_1.tokens.PLUS].toString();
        case 4:
            return lex_1.tokens[lex_1.tokens.MINUS].toString();
        case 5:
            return lex_1.tokens[lex_1.tokens.MULT].toString();
        case 6:
            return lex_1.tokens[lex_1.tokens.DIV].toString();
        default:
            return lex_1.tokens[lex_1.tokens.I].toString();
    }
};
let expr = (textState) => {
    let context = textState;
    let node = term(context);
    let leftToken;
    let rightToken;
    [{ token: leftToken }, { token: rightToken }] = node.children;
    while (((leftToken in lex_1.tokens) || (rightToken in lex_1.tokens)) && (context.curr_char !== undefined)) {
        let token = (0, lex_1.getNextToken)(context);
        if (token.type === lex_1.tokens.PLUS) {
            (0, lex_1.checkToken)(token.type, context);
        }
        if (token.type === lex_1.tokens.MINUS) {
            (0, lex_1.checkToken)(token.type, context);
        }
        node = binaryExpression(parseToken(token.type), node, term(context));
    }
    return node;
};
exports.expr = expr;
let createParseTree = (node) => {
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
exports.createParseTree = createParseTree;
let resolveParseTree = (parseTree) => {
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
exports.resolveParseTree = resolveParseTree;
