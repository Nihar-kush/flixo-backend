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

  let url = `https://themoviesflix.cx/category/${category}/page/${page}`;
  rs(url, (err, result, html) => {
    if (!err) {
      let $ = cheerio.load(html);
      $("#content_box")
        .children()
        .each((index, element) => {
          let item = {
            id: uuid(),
            downloadLink: $(element).find("a.post-image").attr("href"),
            img_url: $(element).find("img").attr("src"),
            title: $(element).find(".title").children("a").text(),
          };
          finalResults.push(item);
        });
      $("#menu-item-41")
        .find(".sub-menu")
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

module.exports = router;
