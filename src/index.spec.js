const { Site, Board, Article, Comment } = require('.');

describe('Site 요구사항 테스트', () => {
    test('Site는 n개 이상 생성 할 수 있다.', () => {
        expect(() => {
            const _site1 = new Site();
            const _site2 = new Site();
        }).not.toThrow();
    });

    test('Site에는 Board를 추가하고 추가된 Board를 조회할 수 있다.', () => {
        const mySite = new Site();
        const noticeBoard = new Board('공지사항');
        
        mySite.addBoard(noticeBoard);
        expect(mySite.findBoardByName('공지사항')).toEqual(noticeBoard);
    });

    test('하나의 Site에 동일한 이름의 Board를 추가할 수 없다.', () => {
        const mySite = new Site();
        const noticeBoard1 = new Board('공지사항');
        const noticeBoard2 = new Board('공지사항');

        mySite.addBoard(noticeBoard1);

        expect(() => {
            mySite.addBoard(noticeBoard2);
        }).toThrow();
    });

    test('Board는 n개 이상 추가 할 수 있다.', () => {
        const mySite = new Site();
        const noticeBoard = new Board('공지사항');
        const faqBoard = new Board('FAQ');

        expect(() => {
            mySite.addBoard(noticeBoard);
            mySite.addBoard(faqBoard);
        }).not.toThrow();

        expect(mySite.boards).toEqual([noticeBoard, faqBoard]);
    });
});

describe('Board 요구사항 테스트', () => {
    /**
     * @type {Site}
     */
    let mySite;

    beforeEach(() => {
        // NOTE: Reset `mySite`
        mySite = new Site();
    });

    test('Board는 name 데이터를 포함해야 하며 null 또는 빈 문자열("")은 허용하지 않는다.', () => {
        expect(() => {
            const _board = new Board('공지사항');
        }).not.toThrow();

        expect(() => {
            const _board = new Board('');
        }).toThrow();

        expect(() => {
            const _board = new Board(null);
        }).toThrow();
    });

    test('Site 에 추가된 Board만 사용 가능한 것으로 간주하며 사용 불가능한 Board에는 Article을 추가할 수 없다.', () => {
        const addedBoard = new Board('사이트에 추가된 게시판');
        const notAddedBoard = new Board('사이트에 추가되지 않은 게시판');

        mySite.addBoard(addedBoard);

        expect(() => {
            const article = new Article({
                subject: '글 제목',
                content: '내용',
                author: '작성자',
            });
            addedBoard.publish(article);
        }).not.toThrow();

        expect(() => {
            const article = new Article({
                subject: '글 제목2',
                content: '내용',
                author: '작성자',
            });
            notAddedBoard.publish(article);
        }).toThrow();
    });

    test('Board에 Article을 추가할 때 Article에 ID를 자동 생성해서 부여해야 한다.', () => {
        const noticeBoard = new Board('공지사항');
        mySite.addBoard(noticeBoard);

        const article = new Article({
            subject: '첫번째 공지사항입니다.',
            content: '테스트 코드는 수정하면 안됩니다.',
            author: '강승현',
        });
        noticeBoard.publish(article);

        // 규칙은 ${board.name}-${랜덤 값} 를 따른다.
        expect(article.id.startsWith('공지사항-')).toBe(true);
    });

    test('Board에 Article을 추가할 때 Article에 작성 일자가 들어가야 한다.', () => {
        const noticeBoard = new Board('공지사항');
        mySite.addBoard(noticeBoard);

        const article = new Article({
            subject: '첫번째 공지사항입니다.',
            content: '테스트 코드는 수정하면 안됩니다.',
            author: '강승현',
        });
        noticeBoard.publish(article);

        // createdDate가 저장되는 형식은 ISO 8601을 따른다.
        expect(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(article.createdDate)).toBe(true);
    });

    test('Article 은 n개 이상 추가 할 수 있다.', () => {
        const noticeBoard = new Board('공지사항');
        mySite.addBoard(noticeBoard);

        const article = new Article({
            subject: '첫번째 공지사항입니다.',
            content: '테스트 코드는 수정하면 안됩니다.',
            author: '강승현',
        });
        const article2 = new Article({
            subject: '두번째 공지사항입니다.',
            content: 'DB나 웹서버를 이용할 필요는 없습니다.',
            author: '강승현',
        });

        noticeBoard.publish(article);

        expect(() => {
            noticeBoard.publish(article2);
        }).not.toThrow();
    });

    test('작성된 Article 목록을 조회 할 수 있어야 한다.', () => {
        const noticeBoard = new Board('공지사항');
        mySite.addBoard(noticeBoard);

        const article = new Article({
            subject: '첫번째 공지사항입니다.',
            content: '테스트 코드는 수정하면 안됩니다.',
            author: '강승현',
        });
        noticeBoard.publish(article);

        const article2 = new Article({
            subject: '두번째 공지사항입니다.',
            content: 'DB나 웹서버를 이용할 필요는 없습니다.',
            author: '강승현',
        });
        noticeBoard.publish(article2);

        expect(noticeBoard.getAllArticles()).toEqual([article, article2]);
    });
});

describe('Article 요구사항 테스트', () => {
    /**
     * @type {Site}
     */
    let mySite;

    beforeEach(() => {
        // NOTE: Reset `mySite`
        mySite = new Site();
        const noticeBoard = new Board('공지사항');
        mySite.addBoard(noticeBoard);
    });

    test('Article은 subject, content, author 3개의 데이터를 포함해야 하며 null 또는 빈 문자열("")은 허용하지 않는다.', () => {
        const noticeBoard = mySite.findBoardByName('공지사항');

        expect(() => {
            const article = new Article({
                subject: '첫번째 공지사항입니다.',
                content: '테스트 코드는 수정하면 안됩니다.',
                author: '강승현',
            });
            noticeBoard.publish(article);
        }).not.toThrow();

        expect(() => {
            const article2 = new Article({
                subject: null,
                content: null,
                author: '',
            });
            noticeBoard.publish(article2);
        }).toThrow();
    });

    test('Board에 추가된 Article만 사용 가능한 것으로 간주하며 사용 불가능한 Article에는 Comment를 추가할 수 없다.', () => {
        const noticeBoard = mySite.findBoardByName('공지사항');

        const publishedArticle = new Article({
            subject: '첫번째 공지사항입니다.',
            content: '테스트 코드는 수정하면 안됩니다.',
            author: '강승현',
        });
        noticeBoard.publish(publishedArticle);

        const draftArticle = new Article({
            subject: '아직 게시하지 않은 공지사항입니다.',
            content: '댓글을 달 수 없어야 합니다',
            author: '강승현',
        });

        expect(() => {
            const comment = new Comment({
                content: '넵!',
                author: '댕댕이',
            });
            publishedArticle.reply(comment);
        }).not.toThrow();

        expect(() => {
            const comment = new Comment({
                content: '넵!',
                author: '댕댕이',
            });
            draftArticle.reply(comment);
        }).toThrow();
    });

    test('Article에 Comment를 추가할 때 Comment에 작성 일자가 들어가야 한다.', () => {
        const noticeBoard = mySite.findBoardByName('공지사항');

        const article = new Article({
            subject: '첫번째 공지사항입니다.',
            content: '테스트 코드는 수정하면 안됩니다.',
            author: '강승현',
        });
        noticeBoard.publish(article);

        const comment = new Comment({
            content: '넵!',
            author: '댕댕이',
        });
        article.reply(comment);

        // createdDate가 저장되는 형식은 ISO 8601을 따른다.
        expect(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(comment.createdDate)).toBe(true);
    });

    test('Comment는 n개 이상 추가 할 수 있다.', () => {
        const noticeBoard = mySite.findBoardByName('공지사항');

        const article = new Article({
            subject: '첫번째 공지사항입니다.',
            content: '테스트 코드는 수정하면 안됩니다.',
            author: '강승현',
        });
        noticeBoard.publish(article);

        const comment = new Comment({
            content: '넵!',
            author: '댕댕이',
        });
        const comment2 = new Comment({
            content: '네넵!',
            author: '냥냥이',
        });

        expect(() => {
            article.reply(comment);
            article.reply(comment2);
        }).not.toThrow();
    });

    test('작성된 Comment 목록을 조회 할 수 있어야 한다.', () => {
        const noticeBoard = mySite.findBoardByName('공지사항');

        const article = new Article({
            subject: '첫번째 공지사항입니다.',
            content: '테스트 코드는 수정하면 안됩니다.',
            author: '강승현',
        });
        noticeBoard.publish(article);

        const comment = new Comment({
            content: '넵!',
            author: '댕댕이',
        });
        const comment2 = new Comment({
            content: '네넵!',
            author: '냥냥이',
        });
        article.reply(comment);
        article.reply(comment2);

        expect(article.getAllComments()).toEqual([comment, comment2]);
    });
});

describe('Comment 요구사항 테스트', () => {
    /**
     * @type {Site}
     */
    let mySite;

    beforeEach(() => {
        // NOTE: Reset `mySite`
        mySite = new Site();
        const noticeBoard = new Board('공지사항');
        mySite.addBoard(noticeBoard);

        const article = new Article({
            subject: '첫번째 공지사항입니다.',
            content: '테스트 코드는 수정하면 안됩니다.',
            author: '강승현',
        });
        noticeBoard.publish(article);
    });

    test('Comment는 content, author 2개의 데이터를 포함해야 하며 null 또는 빈 문자열("")은 허용하지 않는다.', () => {
        const noticeBoard = mySite.findBoardByName('공지사항');
        const [article] = noticeBoard.getAllArticles();

        expect(() => {
            const comment = new Comment({
                content: '댓글1111',
                author: '강승현',
            });
            article.reply(comment);
        }).not.toThrow();

        expect(() => {
            const comment = new Comment({
                content: null,
                author: '',
            });
            article.reply(comment);
        }).toThrow();
    });
});
