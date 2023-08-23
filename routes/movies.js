var express = require("express");
var router = express.Router();
const cheerio = require("cheerio");
const rs = require("request");
const { uuid } = require("uuidv4");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/api/movies", function (req, res, next) {
  let page = req.query.page || 1;
  let category = req.query.category;
  let finalResults = [];
  
  let url;
  let url1 = `https://moviesflixer.lat/category/${category}/page/${page}`;
  let url2 = `https://moviesflixer.lat`;
  
  if (category) {
    url = url1;
  } else {
    url = url2;
  }
  console.log(url);
  rs(url, (err, result, html) => {
    if (!err) {
      let $ = cheerio.load(html);
      $("#content")
        .find(".content")
        .each((index, element) => {
          let item = {
            id: uuid(),
            title: $(element).find(".entry-title").find("a").text(),
            downloadLink: $(element).find(".entry-title").find("a").attr("href"),
            img_url: $(element).find("img").attr("src"),
          };
          finalResults.push(item);
        });
      $(".sub-menu")
        .children()
        .each((index, element) => {
          let item1 = {
            category: $(element).find("a").text(),
            categoryLink: $(element).find("a").attr("href"),
          };
          finalResults.push(item1);
        });
      res.send(finalResults);
    }
  });
  });


  // rs(url, (err, result, html) => {
  //   if (!err) {
  //     let $ = cheerio.load(html);
  //     $("#content_box")
  //       .find(".latestPost")
  //       .each((index, element) => {
  //         let item = {
  //           id: uuid(),
  //           downloadLink: $(element).find(".title").find("a").attr("href"),
  //           img_url: $(element).find(".featured-thumbnail").find("img").attr("src"),
  //           title: $(element).find(".title").find("a").text(),
  //         };
  //         finalResults.push(item);
  //       });
  //     $(".sub-menu")
  //       .children()
  //       .each((index, element) => {
  //         let item1 = {
  //           category: $(element).find("a").text(),
  //           categoryLink: $(element).find("a").attr("href"),
  //         };
  //         finalResults.push(item1);
  //       });
  //     res.send(finalResults);
  //   }
  // });

module.exports = router;
