class Site {
    constructor() {
        this.boards = [];
    }
    addBoard(board) {
        //게시글 제목이 같으면 error를 던짐
        if (this.boards.find((b) => b.name === board.name)) {
            throw new Error();
        }
        board.useBySite = true;
        this.boards.push(board);
    }
    findBoardByName(name) {
        return this.boards.find((board) => board.name === name);
    }
}

class Board {
    constructor(name) {
        if (name === null || name === '') {
            throw new Error();
        }
        this.name = name;
        this.useBySite = false;
        this.articles = [];
    }
    publish(article) {
        if (this.useBySite === true) {
            article.id = this.name + '-' + Date.now().toString();
            article.createdDate = new Date().toISOString();
            article.useByBoard = true;
            this.articles.push(article);
        } else {
            throw new Error();
        }
    }
    getAllArticles() {
        return this.articles;
    }
}
class Article {
    constructor(article) {
        const { subject, content, author } = article;

        if (subject === '' || subject === null) {
            throw new Error();
        } else if (content === '' || content === null) {
            throw new Error();
        } else if (author === '' || author === null) {
            throw new Error();
        }
        this.subject = subject;
        this.content = content;
        this.author = author;
        this.replys = [];
        this.useByBoard = false;
    }
    reply(reply) {
        if (this.useByBoard) {
            reply.createdDate = new Date().toISOString();
            this.replys.push(reply);
        } else {
            throw new Error();
        }
    }
    getAllComments() {
        return this.replys;
    }
}

class Comment {
    constructor(comment) {
        const { content, author } = comment;

        if (content === '' || content === null) {
            throw new Error();
        } else if (author === '' || author === null) {
            throw new Error();
        }
    }
}

module.exports = {
    Site,
    Board,
    Article,
    Comment,
};
