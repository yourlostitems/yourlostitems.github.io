var el_up = document.getElementById("GFG_UP");
var el_down = document.getElementById("GFG_DOWN");
var claimed = 0;

// Base URL for the API. Replace with your actual backend URL when deployed.
const API_BASE_URL = 'http://localhost:3000/api'; // Example: http://your-backend-api.com/api

// Function to fetch items from the backend
async function fetchItems() {
    try {
        // const response = await fetch(`${API_BASE_URL}/items`); // Uncomment when backend is ready
        // if (!response.ok) {
        //     throw new Error(`HTTP error! status: ${response.status}`);
        // }
        // const items = await response.json(); // Uncomment when backend is ready

        // Dummy data until backend is ready
        const items = [
            { id: "Lord of the Rings", name: "Lord of the Rings", description: "A book by J.R.R. Tolkien", imageUrl: "../imgs/lordoftherings.jpg" },
            { id: "Size 7 leather shoes", name: "Size 7 leather shoes", description: "Brown leather shoes, size 7", imageUrl: "../imgs/size7leathershoes.jpg" },
            { id: "Grey pencil case", name: "Grey pencil case", description: "A grey pencil case with various pens", imageUrl: "../imgs/greypencilcase.jpg" },
            { id: "Rugby Jersey", name: "Rugby Jersey", description: "A blue and white rugby jersey", imageUrl: "../imgs/rugbyjersey.jpg" },
            { id: "White longsleeved shirt", name: "White longsleeved shirt", description: "A plain white longsleeved shirt", imageUrl: "../imgs/whitelongsleevedshirt.jpg" }
        ];

        populateTable(items);
    } catch (error) {
        console.error("Failed to fetch items:", error);
        // Display an error message to the user on the page
        const tableBody = document.getElementById("myTable").getElementsByTagName('tbody')[0];
        tableBody.innerHTML = '<tr><td colspan="4">Failed to load items. Please try again later.</td></tr>';
    }
}

// Function to populate the items table
function populateTable(items) {
    const tableBody = document.getElementById("myTable").getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing rows

    items.forEach(item => {
        let row = tableBody.insertRow();
        row.className = "cell cell1"; // Keep existing classes if they are important for styling
        row.id = item.id; // Use a unique ID for the row, preferably from the item data

        let cellName = row.insertCell(0);
        cellName.innerHTML = item.name;

        let cellDescription = row.insertCell(1);
        cellDescription.innerHTML = item.description;

        let cellImage = row.insertCell(2);
        let img = document.createElement('img');
        img.src = item.imageUrl || '../imgs/placeholder.png'; // Use a placeholder if no image
        img.alt = item.name;
        img.style.width = "100px"; // Adjust as needed
        cellImage.appendChild(img);

        let cellAction = row.insertCell(3);
        let claimButton = document.createElement('button');
        claimButton.textContent = 'Claim';
        claimButton.className = 'btn btn-primary btn-sm';
        claimButton.onclick = function() { GFG_click(item.id, row); };
        cellAction.appendChild(claimButton);
    });
}

async function GFG_click(itemId, rowElement) {
    // const x = document.getElementById(clicked) // Not needed if itemId is passed directly
    const table = document.getElementById("myTable");
    const claimedTableBody = document.getElementById('items').getElementsByTagName('tbody')[0];

    try {
        // API call to claim an item - Uncomment and adjust when backend is ready
        /*
        const response = await fetch(`${API_BASE_URL}/items/${itemId}/claim`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Include authentication token if required
                // 'Authorization': `Bearer ${getAuthToken()}` 
            },
            body: JSON.stringify({ userId: getCookie('userId') }) // Example: send userId
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log(result.message);
        */

        // If claim is successful (simulated for now):
        table.deleteRow(rowElement.rowIndex);
        let newClaimedRow = claimedTableBody.insertRow();
        let cell1 = newClaimedRow.insertCell(0);
        cell1.innerHTML = itemId; // Or item.name if you have it

        claimed = parseInt(getCookie('akshaj-bookcount') || '0') + 1;
        setCookie('akshaj-bookcount', claimed, 1);
        updateClaimedItemsDisplay(); // Update dashboard or other UI elements if needed

        alert("Item " + itemId + " claimed successfully!");

    } catch (error) {
        console.error("Failed to claim item:", error);
        alert("Failed to claim item: " + error.message);
    }
}

function updateClaimedItemsDisplay() {
    // This function could update a list of claimed items on the page
    // or update the count on the dashboard if it's visible.
    const claimedCountElement = document.getElementById('itcl'); // Assuming this ID is on the dashboard
    if (claimedCountElement) {
        claimedCountElement.innerHTML = getCookie('akshaj-bookcount') || '0';
    }
}


function searchbar() {
    var input, filter, table, tbody, tr, td, i, txtValue;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tbody = table.getElementsByTagName("tbody")[0];
    tr = tbody.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        // Search in the first cell (item name) or more cells if needed
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

// Initial fetch of items when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchItems();
    // Initialize claimed items count display if on dashboard page
    if (document.getElementById('itcl')) {
        updateClaimedItemsDisplay();
    }
});