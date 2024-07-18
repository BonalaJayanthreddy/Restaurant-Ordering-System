from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from bson.json_util import dumps
from db import mongo
import json
from marshmallow import Schema, fields
products_bp = Blueprint("products", __name__)

class ProductSchema(Schema):
    name = fields.Str(required=True)
    price = fields.Float(required=True)
    veg=fields.Bool(required=True)
    restaurantId=fields.Str(required=True)

class ProductUpdateSchema(Schema):
    _id = fields.Str(required=True)
    name = fields.Str()
    price = fields.Float()
    veg = fields.Bool()
    restaurantId = fields.Str(required=True)

product_schema = ProductSchema()
product_update_schema = ProductUpdateSchema()


@products_bp.route("/<id>")
def get_product(id):
    try:
        print({'_id': ObjectId(id)})
        product_data = mongo.db.Menu.find_one({'_id': ObjectId(id)})
        if product_data:
            product_data['_id'] = str(product_data['_id'])
            product_data['restaurantId'] = str(1)

            return ({"status":"Success","data":product_data}),200
        else:
            return jsonify({"status":"Error",'error': 'Product not found'}), 404
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500   


@products_bp.route("/", methods=["POST"])
def create_product():
    try:
        postData = request.json
        errors = product_schema.validate(postData)
        if errors:
            return jsonify({'error': errors,"message":"Missing fields"}), 400

        postData.pop('restaurantId', None)
        result = mongo.db.Menu.insert_one(
            {**postData}
        )

        if result:
            productId = str(result.inserted_id)
            inserted_product = mongo.db.Menu.find_one({'_id':ObjectId(productId)})
            inserted_product['_id'] = str(inserted_product['_id'])
            inserted_product['restaurantId'] = str(1)
            return jsonify({"status":"Success", "message":"Product created successfully","data":json.loads(dumps(inserted_product))})
        
        return jsonify({"status":"Error","message": "Product not Created"}), 200
    
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500  

@products_bp.route("/", methods=["PATCH"])
def update_product():
    try:
        updateData = request.json
        errors = product_update_schema.validate(updateData)
        if errors:
            return jsonify({'error': errors,"message":"Missing fields"}), 400
        
        # restaurant_id = ObjectId(updateData['restaurantId'])
        updateData.pop('restaurantId', None)
        productId = updateData['_id']
        updateData.pop('_id', None)
        result = mongo.db.Menu.find_one_and_update({'_id':ObjectId(productId)},{'$set': updateData})
        if result:
            result['_id'] = str(result['_id'])
            result['restaurantId'] = str(1)
            return jsonify({"status":"Success",'message': 'Product Updated Successfully',"data":json.loads(dumps(result))}), 200
        else:
            return jsonify({"status":"Success","message": 'Product not found'}), 404

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500  
      
@products_bp.route("/<id>", methods=["DELETE"])
def delete_product(id):
    try:
        result = mongo.db.Menu.delete_one({'_id':ObjectId(id)})
        if result:
            return jsonify({"status":"Success",'message': 'Product Deleted Successfully'}), 200
        else:
            return jsonify({"status":"Error",'message': 'Product not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500  

