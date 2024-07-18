from flask import Flask, jsonify
from db import mongo
from flask_cors import CORS


from controllers import init_app as controller_init

app = Flask(__name__)
CORS(app)
# mongodb+srv://preethi:preethi123@cluster0.j2ysvhx.mongodb.net/food?retryWrites=true&w=majority

app.config["MONGO_URI"] = "mongodb+srv://challapreethi10:HZIS4sJ9p7Iz4nBm@food.rxvn9lw.mongodb.net/food?retryWrites=true&w=majority&appName=Food"

mongo.init_app(app)

controller_init(app)

@app.route("/createAdmin", methods=["GET"])
def test():
    try:
        user = mongo.db.users.find_one({"email":"admin@gmail.com"})
        if not user:
            mongo.db.users.insert_one({
                'firstName': "admin",
                "email":"admin@gmail.com",
                "password":"admin123",
                "role":"admin"
            })
            return jsonify({"message":"Admin created"})
        return "<h1>Working</h1>"
    except Exception as e:
        print(e)
        return jsonify({'message': "Error occured"})


# test()
app.run(debug=True)






