/*******************************************
*                                          *
*   LEXER                                  *
*                                          *
********************************************/


enum tokens {
    I = 1,
    INTEGER = 2,
    PLUS = 3,
    MINUS = 4,
    MULT = 5,
    DIV = 6,
    LPAREN = 7,
    RPAREN = 8,
    EOF = 9
};


interface Token {
    type: tokens;
    value: any
};


interface Pointer {
    text: string,
    curr_char: string,
    curr_pos: number,
    curr_token: tokens
};


const createState = (
    text: string,
    curr_char: string,
    curr_pos: number = 0,
    curr_token: tokens
): Pointer => {
    return { text, curr_char, curr_pos, curr_token };
};


const modifyState = (oldState: Pointer, newState: Pointer): Pointer => {
    oldState.text = newState.text;
    oldState.curr_char = newState.curr_char;
    oldState.curr_pos = newState.curr_pos;
    oldState.curr_token = newState.curr_token;

    return oldState;
};


const skipWhitespace = (textState: Pointer): Pointer => {
    while (textState.curr_char !== undefined && textState.curr_char === ' ') {
        textState = advance_char(textState);
    }
    return textState;
};


const advance_char = (textState: Pointer): Pointer => {
  textState = advance_pos(textState);
  if (!(textState.text[textState.curr_pos] === '\0')) {
    let state = createState(
    textState.text,
    textState.text[textState.curr_pos],
    textState.curr_pos,
    textState.curr_token
    );
    return modifyState(textState, state);
  }
  let state = createState(
    textState.text,
    '\0',
    textState.curr_pos,
    tokens.EOF
  );
  return modifyState(textState, state);
};


const advance_pos = (textState: Pointer) => {
  let state = createState(
    textState.text,
    textState.text[textState.curr_pos],
    textState.curr_pos + 1,
    textState.curr_token
  );
  return modifyState(textState, state);
};


const token = (type: tokens, value: any): Token => {
  return { type, value };
};


const checkToken = (token: tokens, state: Pointer): void => {
  if (state.curr_token === token) {
    state.curr_token = token;
  }
};


const integer = (textState: Pointer): number => {
  let result = '';
  while (
    textState.curr_char !== undefined &&
    !isNaN(parseInt(textState.curr_char))
  ) {
    result += textState.curr_char;
    textState = advance_char(textState);
  }
  return parseInt(result);
};


const getNextToken = (textState: Pointer): Token => {
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
}