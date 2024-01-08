from flask import Flask, render_template, request
import os

app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config["STATIC_AUTO_RELOAD"] = True
app.config['JSON_AS_ASCII'] = False

pages = [
    "General",
    "Gradebook",
    "Rating",
    "Debts",
    "Schedule",
    "Sports_schedule",
    "Curriculum",
    "Tuition_fees"
]

def renderPage():
    pgs = ""
    style = ""
    jquery = ""
    preload = ""
    mainjs = ""
    with open("static/js/jquery.js", mode="r", encoding="utf-8") as f:
        jquery = f.read()
    with open("static/js/preload.js", mode="r", encoding="utf-8") as f:
        preload = f.read()
    with open("static/js/main.js", mode="r", encoding="utf-8") as f:
        mainjs = f.read()
    files = os.listdir("static/css/")
    for i in files:
        if i == "light.css":
            continue
        with open("static/css/"+i, mode="r", encoding="utf-8") as f:
            style+=f.read()
    for i in pages:
        pgs += render_template(i + '.html')
    return render_template('main.html', 
                            styles=style, 
                            pages=pgs,
                            main=mainjs,
                            preload=preload,
                            jquery=jquery), 200, {'Content-Type': 'text/html; charset=utf-8'}

preRenderedPage = ""

@app.route('/', methods = ['GET'])
def main():
    global preRenderedPage
    if preRenderedPage == "":
        preRenderedPage = renderPage()
    return preRenderedPage
   

if __name__=='__main__':
    with app.app_context():
        app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
        app.run(port=61124, debug=True, host='127.0.0.1')
