"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Users
from api.utils import generate_sitemap, APIException
from flask_cors import CORS


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {}
    response_body['message'] = "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    return response_body, 200


@api.route('/products', methods=['POST', 'GET'])
def products():
    response_body = {}
    if request.method == 'GET':
        response_body['message'] = "Este es el get de products"
        return response_body, 200
    
    if request.method == 'POST':
        response_body['message'] = "Este es el post de products"
        return response_body, 200


@api.route('/products/<int:product_id>', methods=['PUT', 'GET', 'DELETE'])
def product(product_id):
    response_body = {}
    if request.method == 'GET':
        response_body['message'] = f"Este es el get de products del productID: {product_id}"
        return response_body, 200
    if request.method == 'PUT':
        response_body['message'] = f"Este es el put de products del productID: {product_id}"
        return response_body, 200
    if request.method == 'DELETE':
        response_body['message'] = f"Este es el delete de products del productID: {product_id}"
        return response_body, 200


@api.route('/products/search', methods=['POST'])
def search_products():
    response_body = {}
    response_body['message'] = "Este es el post de search_products"
    return response_body, 200


@api.route('/suppliers', methods=['POST', 'GET'])
def suppliers():
    response_body = {}
    if request.method == 'GET':
        response_body['message'] = "Este es el get de suppliers"
        return response_body, 200
    
    if request.method == 'POST':
        response_body['message'] = "Este es el post de suppliers"
        return response_body, 200
    
    
@api.route('/suppliers/<int:supplier_id>', methods=['PUT', 'GET', 'DELETE'])
def supplier(supplier_id):
    response_body = {}
    if request.method == 'GET':
        response_body['message'] = f"Este es el get de supplier_id {supplier_id}"
        return response_body, 200
    
    if request.method == 'PUT':
        response_body['message'] = f"Este es el put de supplier_id {supplier_id}"
        return response_body, 200
    
    if request.method == 'DELETE':
        response_body['message'] = f"Este es el delete de supplier_id {supplier_id}"
        return response_body, 200
    

@api.route('/suppliers-products', methods=['GET', 'POST'])
def suppliers_products():
    response_body = {}
    if request.method == 'GET':
        response_body['message'] = "Este es el get de suppliers-products"
        return response_body, 200
    
    if request.method == 'POST':
        response_body['message'] = "Este es el post de suppliers-products"
        return response_body, 200


@api.route('/suppliers-products/<int:suppliers_products_id>', methods=['GET', 'PUT', 'DELETE'])
def suppliers_product(suppliers_products_id):
    response_body = {}
    if request.method == 'GET':
        response_body['message'] = f"Este es el get de suppliers-product {suppliers_products_id}"
        return response_body, 200
    
    if request.method == 'PUT':
        response_body['message'] = f"Este es el put de suppliers-product {suppliers_products_id}"
        return response_body, 200
    
    if request.method == 'DELETE':
        response_body['message'] = f"Este es el delete de suppliers-product {suppliers_products_id}"
        return response_body, 200
     

@api.route('/categories', methods=['GET', 'POST'])
def categories():
    response_body = {}
    if request.method == 'GET':
        response_body['message'] = "Este es el get de categories"
        return response_body, 200
    
    if request.method == 'POST':
        response_body['message'] = "Este es el post de categories"
        return response_body, 200
    

@api.route('/categories/<int:categories_id>', methods=['GET', 'PUT', 'DELETE'])
def category(categories_id):
    response_body = {}
    if request.method == 'GET':
        response_body['message'] = f"Este es el get de categories_id {categories_id}"
        return response_body, 200
    
    if request.method == 'PUT':
        response_body['message'] = f"Este es el put de categories_id {categories_id}"
        return response_body, 200
    
    if request.method == 'DELETE':
        response_body['message'] = f"Este es el delete de categories_id {categories_id}"
        return response_body, 200
    

@api.route('/categories/<int:categories_id>/subcategories', methods=['GET'])
def category_subcategory(categories_id):
    response_body = {}
    response_body['message'] = f"Este es el get de category_subcategory {categories_id}"
    return response_body, 200


@api.route('/subcategories', methods=['GET', 'POST'])
def subcategories():
    response_body = {}
    if request.method == 'GET':
        response_body['message'] = "Este es el get de subcategories"
        return response_body, 200
    
    if request.method == 'POST':
        response_body['message'] = "Este es el post de subcategories"
        return response_body, 200
    

@api.route('/subcategories/<int:subcategories_id>', methods=['GET', 'PUT', 'DELETE'])
def subcategory(subcategories_id):
    response_body = {}
    if request.method == 'GET':
        response_body['message'] = f"Este es el get de subcategories_id {subcategories_id}"
        return response_body, 200
    
    if request.method == 'PUT':
        response_body['message'] = f"Este es el put de subcategories_id {subcategories_id}"
        return response_body, 200
    
    if request.method == 'DELETE':
        response_body['message'] = f"Este es el delete de subcategories_id {subcategories_id}"
        return response_body, 200
    

@api.route('subcategories/<int:subcategories_id>/products', methods=['GET'])
def subcategory_products(subcategories_id):
    response_body = {}
    response_body['message'] = f"Este es el get de subcategories_id {subcategories_id}"
    return response_body, 200


@api.route('/contacts-data', methods=['GET', 'POST'])
def contacts_data():
    response_body = {}
    if request.method == 'GET':
        response_body['message'] = "Este es el get de contacts_data"
        return response_body, 200
    
    if request.method == 'POST':
        response_body['message'] = "Este es el post de contacts_data"
        return response_body, 200


@api.route('/contacts-data/<int:contacts_data_id>', methods=['GET', 'PUT', 'DELETE'])
def contact(contacts_data_id):
    response_body = {}
    if request.method == 'GET':
        response_body['message'] = f"Este es el get de contact {contacts_data_id}"
        return response_body, 200
    
    if request.method == 'PUT':
        response_body['message'] = f"Este es el put de contact {contacts_data_id}"
        return response_body, 200
    
    if request.method == 'DELETE':
        response_body['message'] = f"Este es el delete de contact {contacts_data_id}"
        return response_body, 200
 

@api.route('/users', methods=['GET', 'POST'])
def users():
    response_body = {}
    if request.method == 'GET':
        response_body['message'] = "Este es el get de users"
        return response_body, 200
    
    if request.method == 'POST':
        response_body['message'] = "Este es el post de users"
        return response_body, 200
    

@api.route('/users/<int:users_id>', methods=['GET', 'PUT', 'DELETE'])
def user(users_id):
    response_body = {}
    if request.method == 'GET':
        response_body['message'] = f"Este es el get de user {users_id}"
        return response_body, 200
    
    if request.method == 'PUT':
        response_body['message'] = f"Este es el put de user {users_id}"
        return response_body, 200
    
    if request.method == 'DELETE':
        response_body['message'] = f"Este es el delete de user {users_id}"
        return response_body, 200
    

@api.route('/branches', methods=['GET', 'POST'])
def branches():
    response_body = {}
    if request.method == 'GET':
        response_body['message'] = "Este es el get de branches"
        return response_body, 200
    
    if request.method == 'POST':
        response_body['message'] = "Este es el post de branches"
        return response_body, 200
    

@api.route('/branches/<int:branches_id>', methods=['GET', 'PUT', 'DELETE'])
def branch(branches_id):
    response_body = {}
    if request.method == 'GET':
        response_body['message'] = f"Este es el get de branch {branches_id}"
        return response_body, 200
    
    if request.method == 'PUT':
        response_body['message'] = f"Este es el put de branch {branches_id}"
        return response_body, 200
    
    if request.method == 'DELETE':
        response_body['message'] = f"Este es el delete de branch {branches_id}"
        return response_body, 200


@api.route('/orders', methods=['GET', 'POST'])
def orders():
    response_body = {}
    if request.method == 'GET':
        response_body['message'] = f"Este el get de orders"
        return response_body, 200
    
    if request.method == 'POST':
        response_body['message'] = f"Este es el post de orders"
        return response_body, 200


@api.route('/orders/<int:orders_id>', methods=['GET', 'PUT', 'DELETE'])
def order(orders_id):
    response_body = {}
    if request.method == 'GET':
        response_body['message'] = f"Este el get del order {orders_id}"
        return response_body, 200
    
    if request.method == 'PUT':
        response_body['message'] = f"Este es el put del order {orders_id}"
        return response_body, 200
    
    if request.method == 'DELETE':
        response_body['message'] = f"Este es el delete del order {orders_id}"
        return response_body, 200


@api.route('/orders/filters', methods=['POST'])
def order_filters():
    response_body = {}
    response_body['message'] = f"Este es el post de order_filter"
    return response_body, 200


@api.route('/orders/<int:orders_id>/send', methods=['POST'])
def order_send(orders_id):
    response_body = {}
    response_body['message'] = f"Este es el post de order_send {orders_id}"
    return response_body, 200


@api.route('/products-orders', methods=['GET', 'POST'])
def product_orders():
    response_body = {}
    if request.method == 'GET':
        response_body['message'] = f"Este el get de product_orders"
        return response_body, 200
    
    if request.method == 'POST':
        response_body['message'] = f"Este es el post de product_orders"
        return response_body, 200



@api.route('/products-orders/<int:products_orders_id>', methods=['GET', 'PUT', 'DELETE'])
def product_order(products_orders_id):
    response_body = {}
    if request.method == 'GET':
        response_body['message'] = f"Este el get del product_order {products_orders_id}"
        return response_body, 200
    
    if request.method == 'PUT':
        response_body['message'] = f"Este es el put del products_orders_id {products_orders_id}"
        return response_body, 200
    
    if request.method == 'DELETE':
        response_body['message'] = f"Este es el delete del products_orders_id {products_orders_id}"
        return response_body, 200
