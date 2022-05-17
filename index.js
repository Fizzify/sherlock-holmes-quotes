const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect(process.env.DATABASE);

const quoteSchema = {
  quote: String,
  author: String,
};

const Quote = mongoose.model("Quote", quoteSchema);


app.route("/").get((req, res) => {
  res.redirect("/home");
});

app.get("/home", (req, res) => {
  Quote.find({}, (err, foundQuote) => {
    if (foundQuote) {
      const randomNumber = Math.floor(Math.random() * foundQuote.length);
      res.render("home", { randomQuote: foundQuote[randomNumber] });
    } else {
      res.redirect("/quotes");
    }
  });
});

app
  .route("/quotes")
  .get((req, res) => {
    Quote.find((err, foundQuotes) => {
      if (foundQuotes) {
        res.send(foundQuotes);
      } else {
        res.send("Error, no quotes found.");
      }
    });
  })
  .post((req, res) => {
    const newQuote = new Quote({
      quote: req.body.quote,
      author: req.body.author,
    });

    newQuote.save((err) => {
      if (!err) {
        res.send("Successfully created a new article.");
      } else {
        res.send(err);
      }
    });
  });

app.route("/quotes/random").get((req, res) => {
  Quote.find((err, foundQuotes) => {
    if (foundQuotes) {
      const randomNumber = Math.floor(Math.random() * foundQuotes.length);
      res.send(foundQuotes[randomNumber]);
    } else {
      res.send("Error, no quotes found.");
    }
  });
});

app
  .route("/quotes/:quoteContent")
  .get((req, res) => {
    Quote.findOne({ quote: req.params.quoteContent }, (err, foundQuote) => {
      if (foundQuote) {
        res.send(foundQuote);
      } else {
        res.send("No quote found with that quote.");
      }
    });
  })
  .put((req, res) => {
    Quote.updateOne(
      {
        quote: req.params.quoteContent,
      },
      {
        quote: req.body.quote,
        author: req.body.author,
      },
      (err) => {
        if (!err) {
          res.send("Successfully updated quote.");
        } else {
          res.send(err);
        }
      }
    );
  });

const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Server started on port ${port}`));
