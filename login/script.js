document.getElementById('passwordshow').style.display = "none";
var user = "21asharma"
var password = "testuser@21"

function show() {
    var x = document.getElementById("pd");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

function validate() {
    var x = document.getElementById('username');
    var y = document.getElementById('pd');
    //Is username field filled out?
    if (x.value == "") {
        x.style.borderColor = "red";
        alert("Username must be filled out");
        return false;
        //Is password field filled out?
    } else if (y.value == "") {
        y.style.borderColor = "red";
        alert("Password must be filled out");
        return false;
    } else {
        x.style.borderColor = "black";
        y.style.borderColor = "black";
        //Is the username wrong?
        if (x.value != user) {
            document.getElementById('passwordshow').style.display = "block";


        }
        //Is the password wrong?
        if (y.value != password) {
            document.getElementById('passwordshow').style.display = "block";

            //If everything is right, submit the form (go to catalogue.html)

        }
        else if (y.value == password && x.value == user) {
            location.replace("https://yourlostitems.github.io/dashboard/");
        }

    }
}