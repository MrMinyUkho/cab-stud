from flask import Flask, render_template, request
import os, random

# Create a Flask web application
app = Flask(__name__)

# Set configuration options for Flask
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config["STATIC_AUTO_RELOAD"] = True
app.config['JSON_AS_ASCII'] = False

# List of pages in the application
pages = [
    "General",
    "Gradebook",
    "Rating",
    "Debts",
    # "Schedule",
    # "Sports_schedule",
    "Curriculum",
    "Tuition_fees"
]

# Function to render the main page
def renderPage():
    pgs = ""
    style = ""
    jquery = ""
    preload = ""
    mainjs = ""

    # Read jQuery, preload, and main.js files
    with open("static/js/jquery.js", mode="r", encoding="utf-8") as f:
        jquery = f.read()
    with open("static/js/preload.js", mode="r", encoding="utf-8") as f:
        preload = f.read()
    with open("static/js/main.js", mode="r", encoding="utf-8") as f:
        mainjs = f.read()

    # Read stylesheets from the static/css/ directory
    files = os.listdir("static/css/")
    for i in files:
        if i == "light.css":
            continue
        with open("static/css/"+i, mode="r", encoding="utf-8") as f:
            style += f.read()

    # Render HTML templates for each page and concatenate them
    for i in pages:
        pgs += render_template(i + '.html')

    # Return the main HTML template with required components
    return render_template('main.html', 
                           styles=style, 
                           pages=pgs,
                           main=mainjs,
                           preload=preload,
                           jquery=jquery), 200, {'Content-Type': 'text/html; charset=utf-8'}

# Function to render the mobile version of the main page
def renderPageMobile():
    pgs = ""
    style = ""
    jquery = ""
    preload = ""
    mainjs = ""

    # Similar to renderPage(), read jQuery, preload, and main.js files
    with open("static/js/jquery.js", mode="r", encoding="utf-8") as f:
        jquery = f.read()
    with open("static/js/preload.js", mode="r", encoding="utf-8") as f:
        preload = f.read()
    with open("static/js/main.js", mode="r", encoding="utf-8") as f:
        mainjs = f.read()

    # Read stylesheets from the static/css/ directory
    files = os.listdir("static/css/")
    for i in files:
        if i == "light.css":
            continue
        with open("static/css/"+i, mode="r", encoding="utf-8") as f:
            style += f.read()

    # Render HTML templates for each page and concatenate them
    for i in pages:
        pgs += render_template(i + '.html')

    # Return the main_mobile HTML template with required components
    return render_template('main_mobile.html', 
                           styles=style, 
                           pages=pgs,
                           main=mainjs,
                           preload=preload,
                           jquery=jquery), 200, {'Content-Type': 'text/html; charset=utf-8'}

# Global variable to store pre-rendered main page
preRenderedPage = ""
# Global variable to store pre-rendered mobile main page
preRenderedPageMobile = ""

# Route for the main page
@app.route('/', methods=['GET'])
def main():
    client = request.user_agent

    # Check if the user is using an iPhone or Android device for mobile detection
    if "iPhone" in request.user_agent.string or "Android":
        global preRenderedPageMobile

        # If the mobile page is not pre-rendered, render it
        if preRenderedPageMobile == "":
            preRenderedPageMobile = renderPageMobile()

        # Return the pre-rendered mobile page
        return preRenderedPageMobile
    else:
        global preRenderedPage

        # If the main page is not pre-rendered, render it
        if preRenderedPage == "":
            preRenderedPage = renderPage()

        # Return the pre-rendered main page
        return preRenderedPage

# Run the Flask application if this script is executed
if __name__ == '__main__':
    with app.app_context():
        # Generate or retrieve a secret key for the Flask application
        key = os.environ.get("SECRET_KEY")
        if key is None:
            key = "".join([chr(random.randint(0, 255)) for _ in range(30)])
        app.secret_key = key

        # Run the Flask application on localhost with a specified port
        app.run(port=61124, host='127.0.0.1')
