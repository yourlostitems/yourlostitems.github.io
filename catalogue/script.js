
var el_up = document.getElementById("GFG_UP");
var el_down = document.getElementById("GFG_DOWN");
var claimed = 0;

function GFG_click(clicked,delid) {
    var x = document.getElementById(clicked)
    var table = document.getElementById("myTable");
    table1 = document.getElementById('items');
    table.deleteRow(delid.rowIndex);
    var row = table1.insertRow(1);
    var cell1 = row.insertCell(0);
    cell1.innerHTML = clicked;
    claimed = claimed + 1;
    // alert("hello " + claimed);
    setCookie('akshaj-bookcount', claimed, 1);
}

function searchbar() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}