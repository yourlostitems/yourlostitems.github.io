document.addEventListener('DOMContentLoaded', () => {
    const uploadItemForm = document.getElementById('upload-item-form');
    const pendingClaimsList = document.getElementById('pending-claims-list');
    const API_BASE_URL = 'http://localhost:3000/api'; // Example, align with catalogue script

    // Function to fetch pending claims from the backend
    async function fetchPendingClaims() {
        try {
            // const response = await fetch(`${API_BASE_URL}/admin/claims`); // Uncomment when backend is ready
            // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            // const claims = await response.json(); // Uncomment when backend is ready

            // Dummy data until backend is ready
            const claims = [
                { id: 1, itemName: 'Lost Wallet', userName: 'John Doe', userId: 'user123' },
                { id: 2, itemName: 'Keys', userName: 'Jane Smith', userId: 'user456' },
            ];
            displayPendingClaims(claims);
        } catch (error) {
            console.error("Failed to fetch pending claims:", error);
            pendingClaimsList.innerHTML = '<li class="list-group-item">Failed to load claims.</li>';
        }
    }

    function displayPendingClaims(claims) {
        pendingClaimsList.innerHTML = ''; // Clear existing list
        if (claims.length === 0) {
            pendingClaimsList.innerHTML = '<li class="list-group-item">No pending claims.</li>';
            return;
        }
        claims.forEach(claim => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            listItem.innerHTML = `
                <span>${claim.itemName} - Claimed by ${claim.userName} (User ID: ${claim.userId})</span>
                <div>
                    <button class="btn btn-success btn-sm me-2" onclick="handleClaim('${claim.id}', 'approve')">Approve</button>
                    <button class="btn btn-danger btn-sm" onclick="handleClaim('${claim.id}', 'reject')">Reject</button>
                </div>
            `;
            pendingClaimsList.appendChild(listItem);
        });
    }

    uploadItemForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const itemName = document.getElementById('itemName').value;
        const itemDescription = document.getElementById('itemDescription').value;
        const itemImageInput = document.getElementById('itemImage');
        const itemImage = itemImageInput.files[0];

        if (!itemName || !itemDescription) {
            alert('Please fill in item name and description.');
            return;
        }

        const formData = new FormData();
        formData.append('itemName', itemName);
        formData.append('itemDescription', itemDescription);
        if (itemImage) {
            formData.append('itemImage', itemImage);
        }

        try {
            // const response = await fetch(`${API_BASE_URL}/admin/items`, { // Uncomment when backend is ready
            //     method: 'POST',
            //     body: formData, // FormData handles multipart/form-data for file uploads
            //     // Add admin auth headers if needed
            // });
            // if (!response.ok) {
            //     const errorData = await response.json();
            //     throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            // }
            // const newItem = await response.json(); // Uncomment when backend is ready
            // console.log('New Item Uploaded:', newItem); // Uncomment when backend is ready
            alert('Item uploaded successfully! (Simulated)');
            uploadItemForm.reset();
            // Optionally, refresh a list of items on the admin page or redirect
        } catch (error) {
            console.error('Failed to upload item:', error);
            alert('Failed to upload item: ' + error.message);
        }
    });

    window.handleClaim = async (claimId, action) => {
        try {
            // const response = await fetch(`${API_BASE_URL}/admin/claims/${claimId}`, { // Uncomment when backend is ready
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' /*, Admin Auth */ },
            //     body: JSON.stringify({ action: action }) // 'approve' or 'reject'
            // });
            // if (!response.ok) {
            //     const errorData = await response.json();
            //     throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            // }
            // const result = await response.json(); // Uncomment when backend is ready
            // console.log(`Claim ${claimId} ${action}d:`, result); // Uncomment when backend is ready
            alert(`Claim ${claimId} ${action}d successfully! (Simulated)`);
            fetchPendingClaims(); // Refresh the list of claims
        } catch (error) {
            console.error(`Failed to ${action} claim:`, error);
            alert(`Failed to ${action} claim: ` + error.message);
        }
    };

    fetchPendingClaims();
});
