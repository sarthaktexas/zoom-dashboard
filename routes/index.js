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
    maxRecords: 1,
    filterByFormula: '{Username} = "' + lowerCaseUserName + '"'
  }).eachPage(function page(records, fetchNextPage) {
    records.forEach(function (record) {
      userInfo.push({
        name: name,
        p1: {
          name: record.get('Period 1 Name'),
          link: record.get('Period 1 Link')
        },
        p2: {
          name: record.get('Period 2 Name'),
          link: record.get('Period 2 Link')
        },
        p3: {
          name: record.get('Period 3 Name'),
          link: record.get('Period 3 Link')
        },
        p4: {
          name: record.get('Period 4 Name'),
          link: record.get('Period 4 Link')
        },
        p5: {
          name: record.get('Period 5 Name'),
          link: record.get('Period 5 Link')
        },
        p6: {
          name: record.get('Period 6 Name'),
          link: record.get('Period 6 Link')
        },
        p7: {
          name: record.get('Period 7 Name'),
          link: record.get('Period 7 Link')
        },
        p8: {
          name: record.get('Period 8 Name'),
          link: record.get('Period 8 Link')
        }
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
    res.render('schedule', {
    title: 'Zoom Dashboard',
    user: userInfo[0]
  });
  });
});

module.exports = router;