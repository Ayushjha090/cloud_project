const express = require('express');
const path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk');
const port = 8000;

const ID = 'AKIARC2L3XKK5JGWOVEV';
const SECRET = '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';
const BUCKET_NAME = 'employeedetailstorage';
var key;

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

const db = require('./config/mongoose');
const Detail = require('./models/detail');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded());
app.use(express.static('assets'));


app.get('/', function(req, res){
    return res.render('home');
});

app.post('/add-employee', function(req, res){
    
    fs.writeFileSync('temp.txt', "name: " + req.body.empFirstName + " " + req.body.empLastName + "\nemail: " + req.body.empEmail + "\ncontact: " + req.body.empPhone + "\naddress: " + req.body.empAdd + "\npincode: " + req.body.empPinCode, function(err){
        if(err){
            console.log('error');
        }
    });

    key = req.body.empFirstName;
    
    uploadfile();

    Detail.create({
        name: req.body.empFirstName + " " + req.body.empLastName,
        email: req.body.empEmail,
        contact: req.body.empPhone,
        address: req.body.empAdd,
        pincode: req.body.empPinCode
    },function(err, newDetail){
        if(err)
        {
            console.log("error in add details");
            return;
        }

        console.log("********", newDetail);
        return res.redirect('/');
    });
});

const uploadfile = function(){
    const fileContent = fs.readFileSync('temp.txt');
    const params = {
        Bucket: BUCKET_NAME,
        Key: key + '.txt',
        Body: fileContent
    };

    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};

app.listen(port, function(err){
    if(err)
    {
        console.log("There is some error!!!", err);
        return;
    }

    console.log("Server is running on port ", port);
});