const express = require('express');
const path = require('path');
var http = require('http');
var fs = require('fs');
var url = require('url');
var mysql = require('mysql');
var qs = require('querystring');
var ejs = require('ejs');

const app = express();

app.use(express.static(path.join(__dirname, 'html')));

// app.get('/', (req, res) => {
//   console.log("IN");
//   fs.readFile('html/index.html', 'utf-8', function(error, datas){
//     if(error)
//       console.log('Readfile error');
//     else{
//       res.send(ejs.render(datas, {contactsList:NULL}));
//
//     }
//   });
// });

app.get('/all', (req, res) => {
  //res.sendFile(path.join(__dirname, 'html', 'index.html'));
  default_op(req, res);
});

app.post('/list', (req, res) => {
  //res.sendFile(path.join(__dirname, 'html', 'index.html'));
  default_op(req, res);
});

app.post('/insert', (request, response) => {
  insert_op(request, response);
  //response.sendFile(path.join(__dirname, 'html', 'list.html'));
});

app.post('/search', (request, response) => {
  search_op(request, response);
});

app.post('/delete', (request, response) => {
  delete_op(request, response);
});

app.post('/update', (request, response) => {
  update_op(request, response);
});

app.listen(3000, () => {
  console.log('Express App on port 3000!');
});


function mysql_load()
{
  var connection = mysql.createConnection({
    host    :'localhost',
    port : 3306,
    user : 'contact',
    password : '1111',
    database:'contact',
    insecureAuth : true
  });
  connection.connect(function(err)
  {
    if(err)
    {
      console.error('mysql connection failed.');
      console.error(err);
      throw err;
    }
  });
  return connection;
}

function insert_op(request, response)
{
  var body = '';
  const chunks = [];
  request.on('data', chunk => chunks.push(chunk));
  request.on('end', () =>
  {
    data = qs.parse(Buffer.concat(chunks).toString());
    console.log('Data : ', data);
    console.log('name : ', data.name);

    var connection = mysql_load();
    if(data.name == "" || data.phone == ""){}
    else{
      data.email = (data.email == "")? "-" : data.email;
      data.group = (data.group == "")? "-" : data.group;
      data.birth = (data.birth == "")? "-" : data.birth;
    connection.query('INSERT INTO contacts(Name, Phone, Email, Members, Birth) VALUES(?, ?, ?, ?, ?)',
     [data.name, data.phone, data.email, data.group, data.birth]
     //, data.email, data.group, data.birth]
     , function(err, results){
        if(err)
        console.log(err);
    });
    }

    connection.query('SELECT * FROM contacts', function(err, results)
    {
      if(err)
        console.log(err);
      else{
      console.log(results);
      fs.readFile('html/list.html', 'utf-8', function(error, datas){
        if(error)
          console.log('Readfile error');
        else{
          response.send(ejs.render(datas, {contactsList:results}));
        }
      });
      }
    });
  });

}

function search_op(request, response)
{
  var body = '';
  const chunks = [];
  var _data;
  request.on('data', chunk => chunks.push(chunk));
  request.on('end', () =>
  {
    data = qs.parse(Buffer.concat(chunks).toString());
    console.log('Data : ', data);
    var connection = mysql_load();
    connection.query('SELECT * FROM contacts where Name=? OR Phone=? OR Email=? OR Members=? OR BIRTH=?', [data.name, data.phone, data.email, data.group, data.birth], function(err, results)
    {
      if(err)
        console.log(err);
      else{
      fs.readFile('html/list.html', 'utf-8', function(error, datas){
        if(error)
          console.log('Readfile error');
        else{
          response.send(ejs.render(datas, {contactsList:results}));
        }
      });
      }
    });
  });

}

function default_op(request, response)
{
  var connection = mysql_load();
  connection.query('SELECT * FROM contacts', function(err, results)
  {
    if(err)
      console.log(err);
    else{
    fs.readFile('html/list.html', 'utf-8', function(error, datas){
      if(error)
        console.log('Readfile error');
      else{
        response.send(ejs.render(datas, {contactsList:results}));
      }
    });
    }
  });
}

function delete_op(request, response)
{
  var body = '';
  const chunks = [];
  request.on('data', chunk => chunks.push(chunk));
  request.on('end', () =>
  {
    data = qs.parse(Buffer.concat(chunks).toString());
    console.log('Data : ', data);
    var connection = mysql_load();
    connection.query('DELETE FROM contacts WHERE Id=?', [data.id] ,function(err, rows, fields)
    {
      if(err)
      console.log(err);
    });

    connection.query('SELECT * FROM contacts', function(err, results)
    {
      if(err)
        console.log(err);
      else{
      fs.readFile('html/list.html', 'utf-8', function(error, datas){
        if(error)
          console.log('Readfile error');
        else{
          response.send(ejs.render(datas, {contactsList:results}));
        }
      });
      }
    });
  });
}

function update_op(request, response)
{
  var body = '';
  const chunks = [];
  request.on('data', chunk => chunks.push(chunk));
  request.on('end', () =>
  {
    data = qs.parse(Buffer.concat(chunks).toString());
    console.log('Data : ', data);
    var connection = mysql_load();
    console.log('data :', data.id)
    connection.query('UPDATE contacts SET Name=?, Phone=?, Email=?, Members=?, Birth=? WHERE Id=?', [data.name, data.phone, data.email, data.group, data.birth, data.id] ,function(err, rows, fields)
    {
      if(err)
      console.log(err);
    });

    connection.query('SELECT * FROM contacts', function(err, results)
    {
      if(err)
        console.log(err);
      else{
      fs.readFile('html/list.html', 'utf-8', function(error, datas){
        if(error)
          console.log('Readfile error');
        else{
          response.send(ejs.render(datas, {contactsList:results}));
        }
      });
      }
    });
  });
}
