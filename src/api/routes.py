"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Users, Products, Categories, SubCategories, Suppliers, SuppliersProducts, ContactsData, Branches, Orders, ProductsOrders
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

import requests

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt

api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


@api.route("/login", methods=["POST"])
def login():
    response_body = {}
    data = request.json
    username = data.get("username", None)
    password = data.get("password", None)  
    row = db.session.execute(db.select(Users).where(Users.username == username, Users.password == password, Users.is_active)).scalar()
    if not row:
        response_body['message'] = "Bad username or password"
        return response_body, 401
    user = row.serialize()
    claims = {'user_id': user['id'],
              'role': user['role']}
    
    access_token = create_access_token(identity=username, additional_claims=claims )
    response_body['message'] = f'User {user["username"]} logged'
    response_body['access_token'] = access_token
    response_body['results'] = user
    return response_body, 200


@api.route('/users', methods=['GET', 'POST'])
def users():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Users)).scalars()
        results = [row.serialize() for row in rows]
        response_body['message'] = "Listado de todos los usuarios"
        response_body['results'] = results
        return response_body, 200

    if request.method == 'POST':
        data = request.json
        row = Users(username= data.get('username', ''), password=data.get('password', 1234))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = "Este es el post de users"
        response_body['results'] = row.serialize()
        return response_body, 200
    

@api.route('/users/<int:users_id>', methods=['GET', 'PUT', 'DELETE'])
def user(users_id):
    response_body = {}
    if request.method == 'GET':
        row = Users.query.get(users_id)
        response_body['message'] = "Datos del usuario"
        response_body['results'] = row.serialize()
        return response_body, 200

    if request.method == 'PUT':
        data = request.json
        row = Users.query.get(users_id)
        row.role= data.get('role', row.role)
        row.username= data.get('username', row.username)
        row.password= data.get('password', row.password)
        row.is_active= data.get('is_active', row.is_active)
        db.session.commit()
        response_body['message'] = "Profile editado correctamente"
        response_body['results'] = row.serialize()
        return response_body, 200
    
    if request.method == 'DELETE':
        row = db.session.execute(db.select(Users).where(Users.id == users_id)).scalar()
        if row:
            db.session.delete(row)
            db.session.commit()
            response_body['message'] = f"El user con id {users_id} ha sido eliminado con exito"
            return response_body, 200
        
        response_body['message'] = f"El user con id {users_id} no se encuentra en la base de datos"
        return response_body, 200
    

@api.route('/contacts-data', methods=['GET', 'POST'])
def contacts_data():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(ContactsData)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = "Datos de contacto"
        response_body['results'] = result
        return response_body, 200
    
    if request.method == 'POST':
        data = request.json
        row = ContactsData(order_method=data.get('order_method', 'whatsapp'), supplier_id=data.get('supplier_id', None), phone_number=data.get('phone_number', None),
                            address=data.get('address', None), mail=data.get('mail', None), whatsapp=data.get('whatsapp', None), first_name=data.get('first_name', None), last_name=data.get('last_name', None))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = "Datos de contacto creados."
        response_body['results'] = row.serialize()
        return response_body, 200

@api.route('/contacts-data/<int:contacts_data_id>', methods=['GET', 'PUT', 'DELETE'])
def contact(contacts_data_id):
    response_body = {}
    if request.method == 'GET':
        row = ContactsData.query.get(contacts_data_id)
        response_body['message'] = "Datos de contacto"
        response_body['results'] = row.serialize()
        return response_body, 200
    
    if request.method == 'PUT':
        response_body['message'] = f"Este es el put de contact {contacts_data_id}"
        return response_body, 200
    
    if request.method == 'DELETE':
        row = db.session.execute(db.select(ContactsData).where(ContactsData.id == contacts_data_id)).scalar()
        if row:
            db.session.delete(row)
            db.session.commit()
            response_body['message'] = f"Los datos de contacto con id {contacts_data_id} han sido eliminados con éxito."
            return response_body, 200
    
        response_body['message'] = f"Los datos de contacto con id {contacts_data_id} no se encuentran en la base de datos."
        return response_body, 200


@api.route('/suppliers', methods=['POST', 'GET'])
def suppliers():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Suppliers)).scalars()
        results = [row.serialize() for row in rows]
        response_body['message'] = "Listado de proveedores"
        response_body['results'] = results
        return response_body, 200
    
    if request.method == 'POST':
        data = request.json
        row = Suppliers(name=data.get('name', ''), address=data.get('address', ''), cuit=data.get('cuit', ''))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = "Proveedor creado correctamente"
        response_body['results'] = row.serialize()
        return response_body, 200
    
    
@api.route('/suppliers/<int:supplier_id>', methods=['PUT', 'GET', 'DELETE'])
def supplier(supplier_id):
    response_body = {}
    if request.method == 'GET':
        row = Suppliers.query.get(supplier_id)
        response_body['message'] = f"Este es el get de supplier_id {supplier_id}"
        response_body['results'] = row.serialize()
        return response_body, 200
    
    if request.method == 'PUT':
        response_body['message'] = f"Este es el put de supplier_id {supplier_id}"
        return response_body, 200
    
    if request.method == 'DELETE':
        row = db.session.execute(db.select(Suppliers).where(Suppliers.id == supplier_id)).scalar()
        if row and row.is_active:
            row.is_active = False
            db.session.commit()
            response_body['message'] = f"El proveedor con id {supplier_id} ha sido eliminado correctamente."
            return response_body, 200
    
        response_body['message'] = f"El proveedor con id {supplier_id} no se encuentra en la base de datos."
        return response_body, 200
    

@api.route('/suppliers-products', methods=['GET', 'POST'])
def suppliers_products():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(SuppliersProducts)).scalars()
        results = [row.serialize() for row in rows]
        response_body['message'] = "Listado de productos de los proveedores"
        response_body['results'] = results
        return response_body, 200
    
    if request.method == 'POST':
        data = request.json
        row = SuppliersProducts(suppliers_id=data["suppliers_id"], products_id=data["products_id"], nickname=data["nickname"], price=data["price"])
        db.session.add(row)
        db.session.commit()
        response_body['message'] = f"Producto añadido correctamente al proveedor"
        response_body['results'] = row.serialize()
        return response_body, 200


@api.route('/suppliers-products/<int:suppliers_products_id>', methods=['GET', 'PUT', 'DELETE'])
def suppliers_product(suppliers_products_id):
    response_body = {}
    if request.method == 'GET':
        row = SuppliersProducts.query.get(suppliers_products_id)
        print("row", row)
        response_body['message'] = f"Este es el get de suppliers-product {suppliers_products_id}"
        response_body['results'] = row.serialize()
        return response_body, 200
    
    if request.method == 'PUT':
        response_body['message'] = f"Este es el put de suppliers-product {suppliers_products_id}"
        return response_body, 200
    
    if request.method == 'DELETE':
        row = SuppliersProducts.query.get(suppliers_products_id)

        if row and row.is_active:
            row.is_active = False
            db.session.commit()
            response_body['message'] = f"El producto con id {suppliers_products_id} ha sido eliminado correctamente."
            return response_body, 200
    
        response_body['message'] = f"El producto con id {suppliers_products_id} no se encuentra en la base de datos."
        return response_body, 200

     

@api.route('/products', methods=['POST', 'GET'])
def products():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Products)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = "Este es el get de products"
        response_body ['results'] = result
        return response_body, 200
    
    if request.method == 'POST':
        data = request.json
        row = Products(name=data.get('name', ''), description=data.get('description', ''), sub_categories_id=data.get('sub_categories_id', None))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = "Este es el post de products"
        response_body['results'] = data
        return response_body, 200


@api.route('/products/<int:product_id>', methods=['PUT', 'GET', 'DELETE'])
def product(product_id):
    response_body = {}
    if request.method == 'GET':
        row = db.session.execute(db.select(Products).where(Products.id == product_id)).scalar()
        result = row.serialize()
        response_body['message'] = f"Este es el get de products del productID: {product_id}"
        response_body['results'] = result
        return response_body, 200
    if request.method == 'PUT':
        response_body['message'] = f"Este es el put de products del productID: {product_id}"
        return response_body, 200
    if request.method == 'DELETE':
        row = Products.query.get(product_id)

        if row and row.is_active:
            row.is_active = False
            db.session.commit()
            response_body['message'] = f"El producto con id {product_id} ha sido eliminado correctamente."
            return response_body, 200
    
        response_body['message'] = f"El producto con id {product_id} no se encuentra en la base de datos."
        return response_body, 200


@api.route('/products/search', methods=['POST'])
def search_products():
    response_body = {}
    response_body['message'] = "Este es el post de search_products"
    return response_body, 200


@api.route('/categories', methods=['GET', 'POST'])
def categories():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Categories)).scalars()
        results = [row.serialize() for row in rows]
        response_body['message'] = "Este es el get de categories"
        response_body['results'] = results
        return response_body, 200
    
    if request.method == 'POST':
        data = request.json
        row = Categories(name=data.get('name', ''), description=data.get('description', ''))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = "Categoría añadida correctamente"
        response_body['results'] = row.serialize()
        return response_body, 200
    

@api.route('/categories/<int:categories_id>', methods=['GET', 'PUT', 'DELETE'])
def category(categories_id):
    response_body = {}
    if request.method == 'GET':
        row = Categories.query.get(categories_id)
        response_body['message'] = f"Este es el get de categories_id {categories_id}"
        response_body['result'] = row.serialize()
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
        rows = db.session.execute(db.select(SubCategories)).scalars()
        results = [row.serialize() for row in rows]
        response_body['message'] = "Este es el get de subcategories"
        response_body['results'] = results
        return response_body, 200
    
    if request.method == 'POST':
        data = request.json
        row = SubCategories(name=data.get('name', ''), description=data.get('description', ''), categories_id=data.get('categories_id', ''))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = "Subcategoría añadida correctamente"
        response_body['results'] = row.serialize()
        return response_body, 200
    

@api.route('/subcategories/<int:subcategories_id>', methods=['GET', 'PUT', 'DELETE'])
def subcategory(subcategories_id):
    response_body = {}
    if request.method == 'GET':
        row = SubCategories.query.get(subcategories_id)
        response_body['message'] = f"Este es el get de subcategories_id {subcategories_id}"
        response_body['results'] = row.serialize()
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


@api.route('/branches', methods=['GET', 'POST'])
def branches():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Branches)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = "Sucursales"
        response_body['results'] = result
        return response_body, 200
    
    if request.method == 'POST':
        data = request.json
        row = Branches(contacts_data_id=data.get('contacts_data_id', None))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = "Sucursal creada."
        response_body['results'] = row.serialize()
        return response_body, 200
    

@api.route('/branches/<int:branches_id>', methods=['GET', 'PUT', 'DELETE'])
def branch(branches_id):
    response_body = {}
    if request.method == 'GET':
        row = Branches.query.get(branches_id)
        response_body['message'] = "Sucursal."
        response_body['results'] = row.serialize()
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
        rows = db.session.execute(db.select(Orders)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = "Pedidos"
        response_body['results'] = result
        return response_body, 200
    
    if request.method == 'POST':
        data = request.json
        row = Orders(contacts_data_id=data.get('contacts_data_id', None),order_number=data.get('order_number', None),user_id=data.get('user_id', None),
                     end_date=data.get('end_date', None),delivery_date=data.get('delivery_date', None),status=data.get('status', 'borrador'),
                     payment_method=data.get('payment_method', 'transferencia'),amount=data.get('amount', None),branch_id=data.get('branch_id', None))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = "Pedido creado."
        response_body['results'] = row.serialize()
        return response_body, 200
    

@api.route('/orders/<int:orders_id>', methods=['GET', 'PUT', 'DELETE'])
def order(orders_id):
    response_body = {}
    if request.method == 'GET':
        row = Orders.query.get(orders_id)
        response_body['message'] = "Pedido"
        response_body['results'] = row.serialize()
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
        rows = db.session.execute(db.select(ProductsOrders)).scalars()
        result = [row.serialize () for row in rows]
        response_body['message'] = "Product orders."
        response_body['results'] = result
        return response_body, 200
    
    if request.method == 'POST':
        data = request.json
        row = ProductsOrders(suppliers_products_id=data['suppliers_products_id'], orders_id=data['orders_id'],
                             presentation=data.get('presentation', 1), quantity=data.get('quantity', 1),
                             unit_price=data.get('unit_price', 1))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = "Producto agregado correctamente a la orden."
        response_body['results'] = row.serialize()
        return response_body, 200
    

@api.route('/products-orders/<int:products_orders_id>', methods=['GET', 'PUT', 'DELETE'])
def product_order(products_orders_id):
    response_body = {}
    if request.method == 'GET':
        row = ProductsOrders.query.get(products_orders_id)
        response_body['message'] = "Producto"
        response_body['result'] = row.serialize()
        return response_body, 200
    
    if request.method == 'PUT':
        response_body['message'] = f"Este es el put del products_orders_id {products_orders_id}"
        return response_body, 200
    
    if request.method == 'DELETE':
        response_body['message'] = f"Este es el delete del products_orders_id {products_orders_id}"
        return response_body, 200
