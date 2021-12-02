const mongodb = require("mongodb").MongoClient;
const csvtojson = require("csvtojson");


let url = "mongodb://localhost:27017/";

csvtojson()
  .fromFile("src/p1.csv")
  .then(csvData => {
    console.log(csvData);

    mongodb.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, client) => {
        if (err) throw err;

        client
          .db("TiendaAlem")
          .collection("productos")
          .insertMany(csvData, (err, res) => {
            if (err) throw err;

            console.log(`Inserte: ${res.insertedCount} rows`);
            client.close();
          });
      }
    );
  });