  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAyxOJMINkn8yAuGNVDp_y6VoqqnD9PLQk",
    authDomain: "train-f6106.firebaseapp.com",
    databaseURL: "https://train-f6106.firebaseio.com",
    projectId: "train-f6106",
    storageBucket: "train-f6106.appspot.com",
    messagingSenderId: "978389312256"
  };
  firebase.initializeApp(config);
  
  var database = firebase.database();
  
  // 2. Button for adding train 
  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    // Grabs user input
    var train = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var start = $("#start-input").val().trim();
    var frequency = $("#frequency-input").val().trim();
  
    // Creates local "temporary" object for holding train data
    var newTrain = {
      train: train,
      destination: destination,
      start: start,
      frequency: frequency,
    };
  
    // Uploads train data to the database
    database.ref().push(newTrain);
  
    alert("Train successfully added");
  
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#frequency-input").val("");
  });
  
  // 3. Create Firebase event for adding train to the database and a row in the html
  database.ref().on("child_added", function(childSnapshot) {
  
    // Store everything into a variable.
    var newTrain = childSnapshot.val().train;
    var newDest = childSnapshot.val().destination;
    var newStart = childSnapshot.val().start;
    var newFreq = childSnapshot.val().frequency;
  
  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstConvert = moment(newStart, "HH:mm").subtract(1, "years");

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstConvert), "minutes");

  // Time apart (remainder)
  var remainder = diffTime % newFreq;

  // Minute Until Train
  var minTillTrain = newFreq - remainder;

  // Next Train
  var nextTrain = moment().add(minTillTrain, "minutes");

    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(newTrain),
      $("<td>").text(newDest),
      $("<td>").text(newFreq),
      $("<td>").text(moment(nextTrain).format("HH:mm")),
      $("<td>").text(minTillTrain),
    );
  
    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
  });
  
  