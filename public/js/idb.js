//referenced from pizza hunt module 18 lesson 4

let db;
// create connection to indexedDb database called 'budget_tracker' and set it to version 1
const request = indexedDB.open("budget-tracker", 1);

// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function (event) {
  // save a reference to the database
  const db = event.target.result;
  // create an object store (table) called `new_pizza`, set it to have an auto incrementing primary key of sorts
  db.createObjectStore("budget_store", { autoIncrement: true });
};

// upon a successful
request.onsuccess = function (event) {
  // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
  db = event.target.result;

  // check if app is online, if yes run uploadPizza() function to send all local db data to api
  if (navigator.onLine) {
    updateDb();
  }
};

//iif error
request.onerror = function (event) {
  console.log(event.target.errorCode);
};

// If no internet, save to local db to run when there is internet
function saveRecord(record) {
  // new transaction with the database with updatable permissions
  const transaction = db.transaction(["budget_store"], "readwrite");
  const budgetObjectStore = transaction.objectStore("budget_store");
  // add to array
  budgetObjectStore.add(record);
}
//pseudo
//once the database version transactions has been compared with the online version, if they differ,
//it should trigger an update function as soon as possible so the web page shows the most recent budget content
function updateDb() {
  //open transaction
  let transaction = db.transaction(["budget_store"], "readwrite");
  // access objectstore again
  const budgetObjectStore = transaction.objectStore("budget_store");
  // gather previous unloaded transactions
  const gatherTransacts = budgetObjectStore.getAll();
  //if success,
  getAll.onsuccess = function () {
    // if data, send to server first
    if (gatherTransacts.result.length > 0) {
      fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        //call api

        .then((response) => response.json())
        .then((serverResponse) => {
          //errors
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          // open one more transaction
          const transaction = db.transaction(["budget_store"], "readwrite");
          // access the object store
          const budgetObjectStore = transaction.objectStore("budget_store");
          // clear everythin
          budgetObjectStore.clear();
          alert("Success");
        })
        .catch((err) => {
          console.log("Something went wrong : " + err);
        });
    }
  };
}
