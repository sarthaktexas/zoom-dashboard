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
  let sorting;
  base('Users').select({
    filterByFormula: '{Username} = "' + lowerCaseUserName + '"'
  }).eachPage(function page(records, fetchNextPage) {
    records.forEach(function (record) {
      userInfo.push({
        label: record.get('Label')[0],
        name: record.get('Name'),
        link: record.get('Link')
      });
      sorting = record.get('Sorting')
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
    let result = [];
    const sortingArray = sorting.split(" ");
    sortingArray.forEach(function (key) {
      console.log(key);
      var found = false;
      userInfo = userInfo.filter(function (item) {
        if (!found && item.label == key) {
          result.push(item);
          found = true;
          return false;
        } else
          return true;
      });
    });
    res.render('schedule', {
      title: 'Zoom Dashboard',
      name: name,
      user: result
    });
  });
});

module.exports = router;