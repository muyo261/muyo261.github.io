const mysql = require('mysql2');

// DB 연결 설정
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',       
    password: 'sseungnako5371.',       
    database: 'tokyo_web'   
});

// 실제 연결
db.connect(err => {
    if (err) {
        console.error('DB 연결 오류:', err);
    } else {
        console.log('MySQL 연결 성공!');
    }
});

// 1. express 모듈 불러오기
const express = require('express');
const app = express();
const port = 3000;

// 2. POST 데이터 받기
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 3. public 폴더 정적 파일 제공
app.use(express.static('public'));

// 아이디 중복확인
app.post('/check-id', (req, res) => {
    const { username } = req.body;

    const sql = "SELECT * FROM signup WHERE username = ?";
    db.query(sql, [username], (err, results) => {
        if (err) {
            console.error(err);
            return res.json({ exists: false });
        }

        if (results.length > 0) {
            res.json({ exists: true });   // 이미 존재
        } else {
            res.json({ exists: false });  // 사용 가능
        }
    });
});

    // 회원가입
    app.post('/signup', (req, res) => {
        const { name, username, password } = req.body;
        const sql = 'INSERT INTO signup (name, username, password) VALUES (?, ?, ?)'; // <-- users → signup
        db.query(sql, [name, username, password], (err, result) => {
            if(err) {
                console.error(err);
                res.json({ success: false });
            } else {
                res.json({ success: true });
            }
        });
    });

    // 로그인
    app.post('/login', (req, res) => {
        const { username, password } = req.body;
        const sql = 'SELECT * FROM signup WHERE username = ? AND password = ?'; // <-- users → signup
        db.query(sql, [username, password], (err, results) => {
            if(err) {
                console.error(err);
                res.json({ success: false });
            } else if(results.length > 0) {
                res.json({ success: true });
            } else {
                res.json({ success: false });
            }
        });
    });


// 서버 실행
app.listen(port, () => {
    console.log(`서버 실행: http://localhost:${port}`);
});