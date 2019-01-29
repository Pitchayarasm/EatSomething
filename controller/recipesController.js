var db = require("../models")
var cheerio = require("cheerio");
var axios = require("axios");
var path = require("path")

module.exports = function(app) {
    app.get("/" , function(req,res) {
        res.sendFile(path.join(__dirname,"../public/index.html"));
    });

    // scrapping data and send to front-end
    app.get("/allmenu" , function(req,res) {
        axios.get("https://www.allrecipes.com/").then(function(response) {
            var $ = cheerio.load(response.data);
            var results = [];
            $("article.fixed-recipe-card").each(function(i, element) {
                var title = $(element).find("span.fixed-recipe-card__title-link").text();
                var link = $(element).find("a").attr("href");
                var src = $(element).find("img.fixed-recipe-card__img").attr("data-original-src");
                results.push({
                    title: title,
                    link: link,
                    src: src
                });
            });
            res.send(results)
        });
    });

    // save selected recipes to database
    app.post("/saveRec", function(req,res) {
        db.Menu.create({
            title : req.body.title,
            link : req.body.link,
            src : req.body.src
        })
        .then( function(dbMenu) {
            console.log(dbMenu);
            res.send(dbMenu);
        })
        .catch( function(err) {
            console.log(err)
            res.status(500).send("Oops! You already saved this recipe..")
        });
    });

    // get all saved recipes from database and send to front-end
    app.get("/saved", function(req,res) {
        db.Menu.find()
        .then( function(dbSaved) {
            res.send(dbSaved);
        })
        .catch( function(err) {
            console.log(err);
        })
    })

    // get exist note from database related to menu id
    app.get("/addNote/:id", function(req,res) {
        db.Menu.findOne({ _id: req.params.id })
        .populate("notes")
        .then(function(dbNote) {
            res.json(dbNote);
            console.log(dbNote)
        })
        .catch(function(err) {
            res.json(err);
        });
    });

    app.post("/addNote/:id", function(req, res) {
        db.Note.create(req.body)
          .then(function(dbNote) {
            return db.Menu.findByIdAndUpdate( req.params.id , { notes: dbNote._id } , { new: true });
          })
          .then(function(dbMenu) {
            res.json(dbMenu);
          })
          .catch(function(err) {
            res.json(err);
          });
      });
}