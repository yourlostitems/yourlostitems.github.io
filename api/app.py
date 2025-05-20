from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes, allowing frontend to call API

# --- Configuration ---
# In a real app, use environment variables or a config file
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}

# --- In-memory Data Storage (Replace with a database in a real application) ---
items_db = {
    "1": {"id": "1", "name": "Lord of the Rings", "description": "A book by J.R.R. Tolkien", "imageUrl": "../imgs/lordoftherings.jpg", "claimedBy": None},
    "2": {"id": "2", "name": "Size 7 leather shoes", "description": "Brown leather shoes, size 7", "imageUrl": "../imgs/size7leathershoes.jpg", "claimedBy": None},
    "3": {"id": "3", "name": "Grey pencil case", "description": "A grey pencil case with various pens", "imageUrl": "../imgs/greypencilcase.jpg", "claimedBy": None},
    "4": {"id": "4", "name": "Rugby Jersey", "description": "A blue and white rugby jersey", "imageUrl": "../imgs/rugbyjersey.jpg", "claimedBy": None},
    "5": {"id": "5", "name": "White longsleeved shirt", "description": "A plain white longsleeved shirt", "imageUrl": "../imgs/whitelongsleevedshirt.jpg", "claimedBy": None}
}

claims_db = {}
# Example claim: {"claim_id_1": {"itemId": "1", "userId": "user123", "status": "pending"}}

# --- Helper Functions ---
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# --- API Routes ---

# GET /api/items - Get all available (unclaimed) items
@app.route('/api/items', methods=['GET'])
def get_items():
    available_items = [item for item in items_db.values() if not item.get("claimedBy")]
    return jsonify(available_items)

# POST /api/items/<itemId>/claim - Claim an item
@app.route('/api/items/<string:itemId>/claim', methods=['POST'])
def claim_item(itemId):
    data = request.get_json()
    userId = data.get('userId')

    if not userId:
        return jsonify({"message": "User ID is required"}), 400

    item = items_db.get(itemId)
    if not item:
        return jsonify({"message": "Item not found"}), 404
    if item.get("claimedBy"):
        return jsonify({"message": "Item already claimed"}), 400

    # Create a claim (simplified)
    claim_id = str(uuid.uuid4())
    claims_db[claim_id] = {"id": claim_id, "itemId": itemId, "itemName": item["name"], "userId": userId, "status": "pending"}
    
    # In a real app, you might not mark as claimed until admin approves.
    # For now, let's assume direct claim for simplicity of frontend, or mark as pending claim.
    # item["claimedBy"] = userId # Or, better, manage through claims_db status

    return jsonify({"message": f"Item {item['name']} claim submitted by {userId}. Claim ID: {claim_id}"}), 200

# --- Admin API Routes ---

# GET /api/admin/claims - Get all pending claims
@app.route('/api/admin/claims', methods=['GET'])
def get_admin_claims():
    pending_claims = [claim for claim in claims_db.values() if claim['status'] == 'pending']
    return jsonify(pending_claims)

# POST /api/admin/claims/<claimId> - Approve or reject a claim
@app.route('/api/admin/claims/<string:claimId>', methods=['POST'])
def handle_admin_claim(claimId):
    data = request.get_json()
    action = data.get('action') # 'approve' or 'reject'

    claim = claims_db.get(claimId)
    if not claim:
        return jsonify({"message": "Claim not found"}), 404

    if action == 'approve':
        item = items_db.get(claim['itemId'])
        if item:
            if item.get("claimedBy"):
                 return jsonify({"message": f"Item {item['name']} was already claimed by someone else."}), 409 # Conflict
            item["claimedBy"] = claim['userId'] # Mark item as claimed
            claim['status'] = 'approved'
            return jsonify({"message": f"Claim {claimId} approved. Item {item['name']} awarded to {claim['userId']}."}), 200
        else:
            claim['status'] = 'error_item_not_found' # Should not happen if data is consistent
            return jsonify({"message": "Claimed item no longer exists."}), 404
    elif action == 'reject':
        claim['status'] = 'rejected'
        return jsonify({"message": f"Claim {claimId} rejected."}), 200
    else:
        return jsonify({"message": "Invalid action specified"}), 400

# POST /api/admin/items - Upload a new item
@app.route('/api/admin/items', methods=['POST'])
def add_admin_item():
    if 'itemImage' not in request.files:
        # Handle case where image is optional
        pass # continue if image is not mandatory
    
    itemName = request.form.get('itemName')
    itemDescription = request.form.get('itemDescription')

    if not itemName or not itemDescription:
        return jsonify({"message": "Item name and description are required"}), 400

    new_item_id = str(uuid.uuid4())
    image_filename = None
    image_url = None

    if 'itemImage' in request.files:
        file = request.files['itemImage']
        if file and file.filename != '' and allowed_file(file.filename):
            image_filename = str(uuid.uuid4()) + "_" + file.filename # secure_filename(file.filename) would be better
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], image_filename)
            file.save(file_path)
            # In a real app, serve uploaded files from a dedicated static route or CDN
            # For simplicity, we'll store a relative path that the frontend might need to adjust
            image_url = f'/uploads/{image_filename}' # This path needs to be servable by Flask or a webserver
        elif file.filename != '':
             return jsonify({"message": "File type not allowed"}), 400

    new_item = {
        "id": new_item_id,
        "name": itemName,
        "description": itemDescription,
        "imageUrl": image_url, # This will be None if no image or if not saved
        "claimedBy": None
    }
    items_db[new_item_id] = new_item
    return jsonify(new_item), 201

# Route to serve uploaded images (basic implementation)
# In production, use a proper web server (Nginx, Apache) to serve static files.
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return app.send_static_file(os.path.join('..\', app.config['UPLOAD_FOLDER'], filename)) # This needs careful path construction

if __name__ == '__main__':
    # Make sure to create an 'uploads' directory in the same directory as app.py
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(debug=True, port=3000)
