from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from bson.json_util import dumps
from db import mongo
import json
from marshmallow import Schema, fields
transactions_bp = Blueprint("transactions", __name__)
from datetime import datetime

class TransactionSchema(Schema):
    amount = fields.Float(required=True)
    customerId=fields.Str(required=True)
    cardDetails = fields.Dict(required=True)
    deliveryAddress = fields.Dict(required=True)

transaction_schema = TransactionSchema()

@transactions_bp.route("/<id>")
def get_transaction(id):
    try:
        print({'_id': ObjectId(id)})
        transaction_data = mongo.db.Transactions.find_one({'_id': ObjectId(id)})
        if transaction_data:
            transaction_data['_id'] = str(transaction_data['_id'])
            transaction_data['restaurantId'] = str(transaction_data.get('restaurantId', ""))
            transaction_data['paymentId'] = str(transaction_data['paymentId'])
            transaction_data['orderId'] = str(transaction_data['orderId'])

            return ({"status":"Success","data":transaction_data}),200
        else:
            return jsonify({'error': 'Transaction not found'}), 404
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500   


@transactions_bp.route("/", methods=["POST"])
def create_transaction():
    try:
        postData = request.json
        print(postData)
        errors = transaction_schema.validate(postData)
        if errors:
            return jsonify({'error': errors}), 400
        print(postData)
        customer_id = ObjectId(postData['customerId'])
        transaction_amount = postData['amount']
        card_details = postData['cardDetails']
        delivery_address_details = postData['deliveryAddress']
        card_details['customer_id'] = customer_id
        customerCart = list(mongo.db.CartDb.find({'customerId':customer_id}))
        global restaurantId
        product_cart = []
        if len(customerCart):
            product_cart = []
            for key in customerCart:
                product = {}
                productData = list(mongo.db.Menu.find({'_id': key["productId"]}))
                product["count"] = key["count"]
                # restaurantId = ObjectId(key["restaurantId"])
                product['_id'] = productData[0]['_id']
                product["name"] = productData[0]["name"]
                product["price"] = productData[0]["price"]
                product_cart.append(product)

        payment_details_result = mongo.db.Payment_Details.insert_one(card_details)
        result = mongo.db.Transactions.insert_one(
            { 'customerId': customer_id,'amount':transaction_amount, "paymentId":ObjectId(payment_details_result.inserted_id) })

        if result:
            processOrder = mongo.db.Orders.insert_one({
               'transactionId': ObjectId(result.inserted_id),
            #    'addressId':ObjectId(address_id),
            #    'restaurantId':restaurantId,
               'product':product_cart,
               'customerId':customer_id,
               'orderStatus':'Approved',
               'orderDate': datetime.now(),
               'deliveryAddress': delivery_address_details
            })
            if processOrder:
                removeCustomerCart = mongo.db.CartDb.delete_many({'customerId':customer_id})
                if removeCustomerCart:
                    return jsonify({"status":"Success",'message':'Payment Successful'})
        return jsonify({"status":"Error", 'message':'Cart Empty'}) 
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500  