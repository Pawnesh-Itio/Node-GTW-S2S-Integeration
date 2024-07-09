require("dotenv").config();
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/view/checkout.html");
});

app.post("/payment-page", async (req, res) => {
  console.log(req.ip);
  const { bill_amt, product_name, fullname, bill_email, bill_address, bill_city, bill_state, bill_country, bill_phone } =req.body;
  const public_key=process.env.GTW_PUBLIC_KEY;
  const terNo=process.env.GTW_TER_NO;
  const retrycount=5;
  const source_url="http://localhost:3000/payment-page";
  const return_url="http://localhost:3000/return_url";
  const apiEndpoint ="https://gtw.online-epayment.com/directapi";
  const mop ="CC";
  const ccno ="4242424242424242";
  const ccvv = "123";
  const month = "12";
  const year = "30";
  const unique_reference="Y";
  const bill_ip = req.ip;
  const bill_zip ="123456";
  const bill_currency ="USD";
  const date = new Date();
  const timestamp = date.getTime();
  const reference =timestamp;

  const config ={
    method:'post',
    maxBodyLength:'infinity',
    url:apiEndpoint,
    headers:{
      'Accept-Charset': 'UTF-8',
      'Content-Type': 'application/json'
    },
    params: {
      fullname: fullname,
      bill_address: bill_address,
      bill_city: bill_city,
      bill_country: bill_country,
      bill_state: bill_state,
      bill_phone: bill_phone,
      bill_email: bill_email,
      bill_amt: bill_amt,
      bill_currency: bill_currency,
      bill_zip: bill_zip,
      product_name: product_name,
      retrycount: retrycount,
      return_url: return_url,
      public_key: public_key,
      terNo: terNo,
      unique_reference: unique_reference,
      bill_ip: bill_ip,
      'integration-type': 's2s',
      source: 'Curl-Direct-Card-Payment',
      mop: 'CC',
      ccno: ccno,
      ccvv: ccvv,
      month: month,
      year: year,
      reference: reference
    }
  }
  try{
    const response = await axios.request(config);
    if(response.data.Error){
      return res.status(402).json({
        status:"402",
        message:"Error",
        data:response.data
      })
    }else{
      return res.status(200).json({
        status:200,
        message:"success",
        data:response.data
      })
    }

  }catch (error){
    console.log(error);
    return res.status(500).json({
      status:500,
      messsage:"Internal Server Error",
      error:error.messsage
    });
  }

});
app.all("/return_url", (req,res)=>{
  res.json(req.query);
});
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
