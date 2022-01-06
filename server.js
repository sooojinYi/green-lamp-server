const express = require("express");
const cors = require("cors");
const app = express();
const port = 8080;
const models = require('./models');
app.use(cors());
//해당파일을 보여줄때 입력한 경도대로 보여주기 위해 세팅
app.use("models/upload", express.static("upload"));

//업로드 이미지를 관리하는 스토리지 서버를연결 멀터를 쓰겠다.
const multer = require('multer');
const { urlencoded } = require("express");


const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
           //어디에 저장할거야? upload/
            cb(null, 'models/upload')
        },
        filename: function (req, file, cb) {
           //어떤이름으로 저장할거야? 파일안에 있는 오리지널이름으로 저장하겠다.
            cb(null, file.originalname)
        }
    })
})






//json 형식의 데이터를 처리할 수 있게 설정하는 코드
app.use(express.json());
//브라우저의 cors이슈를 막기위해 사용하는 코드
app.use(cors());

//get 방식 응답지정
app.get('/products',async(req,res)=>{
    console.log('제품');
    //get 방식 쿼리 데이터 전송
    const queryString = req.query;
    // console.log(queryString.id);
    // console.log(queryString.name);
    // 데이터 베이스 조회하기
    // findAll 전체항목조회 
    // findOne 하나만조회
    // 조건지정
    // limit로 항목갯수 지정
    // order 정렬변경
    // attributes 원하는 컬럼만 선택
    models.Product.findAll({
        limit: 8,
        order: [
            ["createdAt","DESC"]
        ],
        attributes: [
            "id",
            "name",
            "seller",
            "createdAt",
            "imageUrl",
            "price"
        ]
    })
    .then((result)=>{
        res.send({
            product: result
        })
    })
    .catch((error)=>{
        console.log(error);
        res.send('데이터를 가져오지 못했습니다.');
    })
})
//post 방식 응답 지정
app.post('/products', async(req,res)=>{
    
    const body = req.body;
    const {name, description, price, seller, imageUrl} = body;
    //product 테이블에 데이터를 삽입
    //구문 > models.테이블이름.create
    models.Product.create({
        name,
        description,
        price,
        seller,
        imageUrl
    }).then((result)=>{
        console.log("상품생성결과 : ",result);
        res.send({
            result,
        })
    })
    .catch((error)=>{
        console.error(error);
        res.send("상품 업로드에 문제가 발생했습니다.");
    })
})

//get 방식 경로 파라미터 관리하기
app.get('/products/:id',async(req,res)=>{
    const params = req.params;
    console.log(params);
    //하나만 찾을때는 (select할때는) findOne
    models.Product.findOne({
        //조건절
        where: {
            id: params.id
        }
    })
    .then((result)=>{
        res.send({
            product: result,
        })
    })
    .catch((error)=>{
        console.log(error);
        res.send('상품조회에 문제가 생겼습니다.')
    })
})

// 이미지파일을 post 요청했을때 업로드 폴더에 이미지를 저장
app.post('/image', upload.single('image'), (req,res)=>{
    console.log('image');
    const file = req.file;
    console.log(file);
    res.send({
        imageUrl: file.destination + "/" + file.filename
    })
})

//설정한 app을 실행 시키기
app.listen(port, ()=>{
    console.log('그린램프 서버가 돌아가고 있습니다.');
    models.sequelize
    .sync()
    .then(()=>{
        console.log("db 연결성공");
    })
    .catch(function(err){
        console.error(err);
        console.log("db 연결에러");
        process.exit();
    })
})