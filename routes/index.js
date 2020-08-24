require('dotenv').config()
var express = require('express');
var router = express.Router();
var Airtable = require('airtable');
var base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base('app8QjouUFj52x382');

router.get('/', function (req, res, next) {
  res.render('index', {
    title: "Signup"
  });
});

/* GET schedule page. */
router.get('/:user', async function (req, res, next) {
  var lowerCaseUserName = req.params.user.toLowerCase();

  function jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  var name = jsUcfirst(req.params.user);
  var userInfo = [];
  base('Users').select({
    filterByFormula: '{Username} = "' + lowerCaseUserName + '"'
  }).eachPage(function page(records, fetchNextPage) {
    records.forEach(function (record) {
      userInfo.push({
        label: record.get('Label')[0],
        name: record.get('Name'),
        link: record.get('Link')
      });
    });
    fetchNextPage();
  }, function done(err) {
    if (err) {
      console.error(err);
      return;
    }
    if (!userInfo.length) {
      res.render('nouser', {
        title: '404'
      });
    }
    //var labelArr = [1, 2, 3, 4, 5, 6, 7, 8, 0, 'Extracurricular']
    /*
    var result = userInfo.sort(function(a, b){  
      return 10 - userInfo.label[0].splice(1, -1);
    });*/
    let sorting = ['0', '1', '2', '3', '4', '5', '6', '7', '8', 'Extracurricular'];
    let result = [];

    sorting.forEach(function (key) {
      var found = false;
      userInfo = userInfo.filter(function (item) {
        if (!found && item.label == key) {
          result.push(item);
          found = true;
          return false;
        } else
          return true;
      })
    })
    res.render('schedule', {
      title: 'Zoom Dashboard',
      name: name,
      user: result
    });
  });
});

module.exports = router;