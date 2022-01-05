const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

//json 형식의 데이터를 처리할 수 있게 설정하는 코드
app.use(express.json());
//브라우저의 cors이슈를 막기위해 사용하는 코드
app.use(cors());

//get 방식 응답지정
app.get('/products',async(req,res)=>{
    //get 방식 쿼리 데이터 전송
    const queryString = req.query;
    // console.log(queryString.id);
    // console.log(queryString.name);
    res.send({
        "products":[
            {
                "id":1,
                "name":"아이방조명",
                "price":70000,
                "seller":"그린",
                "imageUrl":"image/products/product1.jpg"
            },
            {
                "id":2,
                "name":"거실방조명",
                "price":40000,
                "seller":"그린",
                "imageUrl":"image/products/product2.jpg"
            },
            {
                "id":3,
                "name":"부엌조명",
                "price":90000,
                "seller":"그린",
                "imageUrl":"image/products/product3.jpg"
            },
        ]
    });
})
//post 방식 응답 지정
app.post('/products', async(req,res)=>{
    const body = req.body;
    console.log(body);
    res.send('상품이 잘 등록되었습니다.');
})
//get 방식 경로 파라미터 관리하기
app.get('/products/:id',async(req,res)=>{
    const params = req.params;
    console.log(params);
    res.send('파라미터 관리하기');
})
//설정한 app을 실행 시키기
app.listen(port, ()=>{
    console.log('그린램프 서버가 돌아가고 있습니다.');
})