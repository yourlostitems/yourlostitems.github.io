from flask import Flask
from flask import render_template as rt

app = Flask(__name__)

@app.route("/")
def index():
    return rt("index.html")

@app.route("/about")
def iabout():
    return rt("about.html")

@app.route("/catalogue")
def icatalogue():
    return rt("catalogue.html")

@app.route("/dashboard")
def dashboard():
    return rt("dashboard.html")

@app.route("/login/")
def login():
    return rt("login.html")

@app.errorhandler(404)
def error_404(e):
    return rt("404.html")
