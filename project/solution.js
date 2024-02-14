const express = require("express");
const app = express();
const port = 3001;

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

var serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

app.set("view engine", "ejs");
app.get("/signup.ejs", (req, res) => {
  res.render("signup");
});
app.get("/login.ejs", (req, res) => {
  res.render("login");
});
app.get("/index", (req, res) => {
  res.render("index");
});
app.get("/home", (req, res) => {
  res.render("home");
});
app.get("/error", (req, res) => {
  res.render("error");
});

app.get("/loginsubmit", (req, res) => {
  const email = req.query.mail;
  const password = req.query.password;

  // Query the Firestore database to check if the credentials are correct
  db.collection("users")
    .where("email", "==", email)
    .where("password", "==", password)
    .get()
    .then((docs) => {
      if (docs.size > 0) {
        // Credentials are correct, redirect to index.ejs
        res.render("index");
      } else {
        // Credentials are incorrect, redirect to error.ejs
        res.redirect("/error");
      }
    })
    .catch((error) => {
      // Handle any errors that occur during the database query
      console.error("Error checking credentials:", error);
      res.redirect("/error");
    });
});

app.get("/signupsubmit", (req, res) => {
  const first_name = req.query.first_name;
  const last_name = req.query.last_name;
  const email = req.query.email;
  const password = req.query.password;

  // Adding new data to the Firestore collection
  db.collection("users")
    .add({
      name: first_name + " " + last_name,
      email: email,
      password: password,
    })
    .then(() => {
      res.render("index");
    })
    .catch((error) => {
      // Handle any errors that occur when adding new data
      console.error("Error adding new user:", error);
      res.redirect("/error");
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

