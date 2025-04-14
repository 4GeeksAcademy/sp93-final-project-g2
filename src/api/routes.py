"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Users, Products, Categories, SubCategories, Suppliers, SuppliersProducts, ContactsData, Branches, Orders, ProductsOrders
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy.orm import joinedload

import requests

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt

from datetime import timedelta

api = Blueprint('api', __name__)
CORS(api) 


@api.route("/login", methods=["POST"])
def login():
    response_body = {}
    data = request.json
    username = data.get("username", None)
    password = data.get("password", None)  
    row = Users.query.filter((Users.username == username) & (Users.password == password) & (Users.is_active)).first()
    if not row:
        response_body['message'] = "Bad username or password"
        return response_body, 401
    user = row.serialize()
    claims = {'user_id': user['id'],
              'role': user['role']}
    
    access_token = create_access_token(identity=username, additional_claims=claims, expires_delta=timedelta(hours=12) )
    response_body['message'] = f'User {user["username"]} logged'
    response_body['access_token'] = access_token
    response_body['results'] = user
    return response_body, 200


@api.route('/users', methods=['GET', 'POST'])
@jwt_required()
def users():
    response_body = {}
    claims = get_jwt()
    if request.method == 'GET':
        rows = Users.query.filter_by(is_active=True).all()
        response_body['message'] = "Usuarios"
        response_body['results'] = [row.serialize() for row in rows]
        return response_body, 200

    if request.method == 'POST' and claims['role'] == 'Administrador':
        data = request.json
        row = Users(username= data.get('username', ''), password=data.get('password', 1234), role=data.get('role', 1234) )
        db.session.add(row)
        db.session.commit()
        response_body['message'] = "Usuario cargado correctamente"
        response_body['results'] = row.serialize()
        return response_body, 200
    

@api.route('/users/<int:users_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def user(users_id):
    response_body = {}
    claims = get_jwt()
    if claims['role'] == 'Administrador' or claims['user_id'] == users_id:
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
        
        if request.method == 'DELETE' and claims['role'] == 'Administrador':
            row = Users.query.filter_by(id=users_id).delete()
            if row != 0:
                db.session.commit()
                response_body['message'] = f"El user con id {users_id} ha sido eliminado con exito"
                return response_body, 200
            
            response_body['message'] = f"El user con id {users_id} no se encuentra en la base de datos"
            return response_body, 200

    response_body['message'] = "El usuario no esta autorizado a realizar esta accion"
    return response_body, 200 


@api.route('/contacts-data', methods=['GET', 'POST'])
@jwt_required()
def contacts_data():
    response_body = {}
    claims = get_jwt()
    if claims['role'] != 'visitante':
        if request.method == 'GET':
            rows = ContactsData.query.filter_by(is_active=True).all()
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
    response_body['message'] = "El usuario no esta autorizado a realizar esta accion"
    return response_body, 200 

@api.route('/contacts-data/<int:contacts_data_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def contact(contacts_data_id):
    response_body = {}
    claims = get_jwt()
    if claims['role'] == 'Administrador' or claims['user_id'] == contacts_data_id:
        if request.method == 'GET':
            row = ContactsData.query.get(contacts_data_id)
            response_body['message'] = "Datos de contacto"
            response_body['results'] = row.serialize()
            return response_body, 200
        
        if request.method == 'PUT':
            data = request.json
            row = ContactsData.query.get(contacts_data_id)
            row.phone_number = data.get('phone_number', row.phone_number)
            row.address = data.get('address', row.address)
            row.mail = data.get('mail', row.mail)
            row.whatsapp = data.get('whatsapp', row.whatsapp)
            row.first_name = data.get('first_name', row.first_name)
            row.last_name = data.get('last_name', row.last_name)
            row.is_active = data.get('is_active', row.is_active)
            db.session.commit()
            db.session.refresh(row)
            response_body['message'] = f"Datos del contacto {contacts_data_id} actualizados correctamente"
            return response_body, 200
        
        if request.method == 'DELETE' and claims['role'] == 'Administrador':
            row = ContactsData.query.get(contacts_data_id)
            if row:
                db.session.delete(row)
                db.session.commit()
                response_body['message'] = f"Los datos de contacto con id {contacts_data_id} han sido eliminados con éxito."
                return response_body, 200
        
            response_body['message'] = f"Los datos de contacto con id {contacts_data_id} no se encuentran en la base de datos."
            return response_body, 200
    
    response_body['message'] = "El usuario no esta autorizado a realizar esta accion"
    return response_body, 200

@api.route('/suppliers', methods=['GET', 'POST'])
@jwt_required()
def suppliers():
    response_body = {}
    if request.method == 'GET':
        rows = Suppliers.query.options(joinedload(Suppliers.supplier_contact_data_to))
        results = []
        for row in rows:
            data = row.serialize()
            data['supplier_contact_data'] = [contact.serialize() for contact in row.supplier_contact_data_to]
            results.append(data)
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
        rows = Products.query.filter_by(is_active=True).all()
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
@jwt_required()
def product(product_id):
    response_body = {}
    claims = get_jwt()
    if claims['role'] == 'Administrador' or claims['product_id'] == product_id:
        if request.method == 'GET':
            row = Products.query.get(product_id)
            result = row.serialize()
            response_body['message'] = f"Características del producto: {product_id}"
            response_body['results'] = result
            return response_body, 200
        if request.method == 'PUT':
            data = request.json
            row = Products.query.get(product_id)
            row.name = data.get('name', row.name)
            row.description = data.get('description', row.description)
            row.is_active = data.get('is_active', row.is_active)
            response_body['message'] = f"Este es el put de products del productID: {product_id}"
            return response_body, 200
        if request.method == 'DELETE' and claims['role'] == 'Administrador':
            row = Products.query.get(product_id)

            if row and row.is_active:
                row.is_active = False
                db.session.commit()
                response_body['message'] = f"El producto con id {product_id} ha sido eliminado correctamente."
                return response_body, 200
        
            response_body['message'] = f"El producto con id {product_id} no se encuentra en la base de datos."
            return response_body, 200

@api.route('/products/<int:products_id>/suppliers-products', methods=['GET'])
@jwt_required()
def product_suppliers(products_id):
    response_body = {}
    claims = get_jwt()
    if claims['role'] == 'Administrador' or claims['products_id'] == products_id:
        if request.method == 'GET':
            rows = db.session.execute(db.select(SuppliersProducts).filter_by(products_id=products_id, is_active=True)).scalars()
            suppliers_products = [row.serialize() for row in rows]
            row = Products.query.get(products_id)
            product = row.serialize()
            response_body['message'] = f"Productos de proveedor del producto {product['name']}"
            response_body['results'] = {"product": product, "list": suppliers_products}
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
        rows = Categories.query.filter_by(is_active=True).all()
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
@jwt_required()
def category(categories_id):
    response_body = {}
    claims = get_jwt()
    if claims['role'] == 'Administrador' or claims['categories_id'] == categories_id:
        if request.method == 'GET':
            row = Categories.query.get(categories_id)
            response_body['message'] = f"Este es el get de categories_id {categories_id}"
            response_body['result'] = row.serialize()
            return response_body, 200
        
        if request.method == 'PUT':
            data = request.json
            row = Categories.query.get(categories_id)
            row.name = data.get('name', row.name)
            row.description = data.get('description', row.description)
            row.is_active = data.get('is_active', row.is_active)
            response_body['message'] = f"La categoría {categories_id} ha sido actualizada correctamente"
            return response_body, 200
        
        if request.method == 'DELETE' and claims['role'] == 'Administrador':
            row = Categories.query.get(categories_id)

            if row and row.is_active:
                row.is_active = False
                db.session.commit()
                response_body['message'] = f"La categoría con id {categories_id} ha sido eliminada correctamente."
                return response_body, 200
        
            response_body['message'] = f"La categoría con id {categories_id} no se encuentra en la base de datos."
            return response_body, 200
        

@api.route('/categories/<int:categories_id>/sub-categories', methods=['GET'])
@jwt_required()
def category_subcategory(categories_id):
    response_body = {}
    claims = get_jwt()
    if claims['role'] == 'Administrador' or claims['categories_id'] == categories_id:
        if request.method == 'GET':
            rows = db.session.execute(db.select(SubCategories).filter_by(categories_id=categories_id, is_active=True)).scalars()
            subcategories = [row.serialize() for row in rows]
            row = Categories.query.get(categories_id)
            category = row.serialize()
            response_body['message'] = f"Subcategorías de la categoría {category['name']}"
            response_body['results'] = {"category": category, "list": subcategories}
            return response_body, 200


@api.route('/sub-categories', methods=['GET', 'POST'])
def subcategories():
    response_body = {}
    if request.method == 'GET':
        rows = SubCategories.query.filter_by(is_active=True).all()
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
    

@api.route('/sub-categories/<int:subcategories_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def subcategory(subcategories_id):
    response_body = {}
    claims = get_jwt()
    if claims['role'] == 'Administrador' or claims['categories_id'] == subcategories_id:
        if request.method == 'GET':
            row = SubCategories.query.get(subcategories_id)
            response_body['message'] = f"Subcategoría {subcategories_id}"
            response_body['results'] = row.serialize()
            return response_body, 200
        
        if request.method == 'PUT':
            data = request.json
            row = SubCategories.query.get(subcategories_id)
            row.name = data.get('name', row.name)
            row.description = data.get('description', row.description)
            row.is_active = data.get('is_active', row.is_active)
            response_body['message'] = f"Subcategoría {subcategories_id} actualizada correctamente"
            return response_body, 200
        
        if request.method == 'DELETE' and claims['role'] == 'Administrador':
            row = SubCategories.query.get(subcategories_id)

            if row and row.is_active:
                row.is_active = False
                db.session.commit()
                response_body['message'] = f"La subcategoría con id {subcategories_id} ha sido eliminada correctamente."
                return response_body, 200
        
            response_body['message'] = f"La subcategoría con id {subcategories_id} no se encuentra en la base de datos."
            return response_body, 200
    

@api.route('sub-categories/<int:subcategories_id>/products', methods=['GET'])
@jwt_required()
def subcategory_products(subcategories_id):
    response_body = {}
    claims = get_jwt()
    if claims['role'] == 'Administrador' or claims['subcategories_id'] == subcategories_id:
        if request.method == 'GET':
            rows = db.session.execute(db.select(Products).filter_by(sub_categories_id=subcategories_id, is_active=True)).scalars()
            products = [row.serialize() for row in rows]
            row = SubCategories.query.get(subcategories_id)
            subcategory = row.serialize()
            response_body['message'] = f"Productos de la subcategoría {subcategory['name']}"
            response_body['results'] = {"subcategory": subcategory, "list": products}
            return response_body, 200


@api.route('/branches', methods=['GET', 'POST'])
@jwt_required()
def branches():
    response_body = {}
    if request.method == 'GET':
        rows = Branches.query.filter_by(is_active=True).all()
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
    claims = get_jwt()
    if claims['role'] == 'Administrador' or claims['branches_id'] == branches_id:
        if request.method == 'GET':
            row = Branches.query.get(branches_id)
            response_body['message'] = "Sucursal."
            response_body['results'] = row.serialize()
            return response_body, 200
        
        if request.method == 'PUT':
            data = request.json
            row = Branches.query.get(branches_id)
            row.is_active = data.get('is_active', row.is_active)
            response_body['message'] = f"Este es el put de branch {branches_id}"
            return response_body, 200
        
        if request.method == 'DELETE' and claims['role'] == 'Administrador':
            row = Branches.query.get(branches_id)

            if row and row.is_active:
                row.is_active = False
                db.session.commit()
                response_body['message'] = f"La sucursal con id {branches_id} ha sido eliminada correctamente."
                return response_body, 200
        
            response_body['message'] = f"La sucursal con id {branches_id} no se encuentra en la base de datos."
            return response_body, 200


@api.route('/orders', methods=['GET', 'POST'])
@jwt_required()
def orders():
    response_body = {}
    current_user = get_jwt()
    user_id = current_user['user_id']
    if request.method == 'GET':
        rows = Orders.query.filter_by(is_active=True).all()
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
    claims = get_jwt()
    if claims['role'] == 'Administrador' or claims['orders_id'] == orders_id:
        if request.method == 'GET':
            row = Orders.query.options(joinedload(Orders.orders_products_to)
                                        .joinedload(ProductsOrders.suppliers_products_to)
                                        .joinedload(SuppliersProducts.suppliers_to),
                                        joinedload(Orders.contacts_data_to),
                                        joinedload(Orders.user_to),
                                        joinedload(Orders.branch_to)
                                    ).get(orders_id)
            if not row:
                return {"message": "Orden no encontrada"}, 404

            order = row.serialize()
            order['products'] = [product.serialize() for product in row.orders_products_to]
            order["supplier_name"] = row.orders_products_to[0].suppliers_products_to.suppliers_to.name
            order["contact_data"] = row.contacts_data_to.serialize()
            order["user"] = row.user_to.serialize()
            order["branch"] = row.branch_to.serialize()
            # OPCION QUE NO ME GUSTA PORQUE HACE DOS CONSULTAS A LA BASE
            # row = Orders.query.get(orders_id)
            # order = row.serialize()
            # order_products = db.session.execute(db.select(ProductsOrders).where(ProductsOrders.orders_id == orders_id)).scalars()
            # order['products'] = [order_product.serialize() for order_product in order_products ]
            response_body['message'] = "Pedido"
            response_body['results'] = order
            return response_body, 200
        
        if request.method == 'PUT':
            data = request.json
            row = Orders.query.get(orders_id)
            row.order_number = data.get('order_number', row.order_number)
            row.user_id = data.get('user_id', row.user_id)
            row.user_to = data.get('user_to', row.user_to)
            row.start_date = data.get('start_date', row.start_date)
            row.end_date = data.get('end_date', row.end_date)
            row.delivery_date = data.get('delivery_date', row.delivery_date)
            row.is_active = data.get('is_active', row.is_active)
            row.status = data.get('status', row.status)
            row.payment_method = data.get('payment_method', row.payment_method)
            row.amount = data.get('amount', row.amount)
            row.branch_id = data.get('branch_id', row.branch_id)
            row.branch_to = data.get('branch_to', row.branch_to)
            row.is_active = data.get('is_active', row.is_active)
            response_body['message'] = f"Orden {orders_id} actualizada correctamente"
            return response_body, 200
        
        if request.method == 'DELETE' and claims['role'] == 'Administrador':
            row = Orders.query.get(orders_id)

            if row and row.is_active:
                row.is_active = False
                db.session.commit()
                response_body['message'] = f"El pedido con id {orders_id} ha sido eliminado correctamente."
                return response_body, 200
        
            response_body['message'] = f"El pedido con id {orders_id} no se encuentra en la base de datos."
            return response_body, 200


@api.route('/orders/filters', methods=['POST'])
@jwt_required()
def order_filters():
    response_body = {}
    response_body['message'] = f"Este es el post de order_filter"
    return response_body, 200


@api.route('/orders/<int:orders_id>/send', methods=['POST'])
@jwt_required()
def order_send(orders_id):
    response_body = {}
    claims = get_jwt()
    if claims['role'] == 'Administrador' or claims['orders_id'] == orders_id:
        response_body['message'] = f"Orden {orders_id} enviada correctamente"
        return response_body, 200


@api.route('/products-orders', methods=['GET', 'POST'])
@jwt_required()
def product_orders():
    response_body = {}
    if request.method == 'GET':
        rows = ProductsOrders.query.filter_by(is_active=True).all()
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
        response_body['message'] = "Producto agregado correctamente."
        response_body['results'] = row.serialize()
        return response_body, 200
    

@api.route('/products-orders/<int:products_orders_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def product_order(products_orders_id):
    response_body = {}
    claims = get_jwt()
    if claims['role'] == 'Administrador' or claims['products_orders_id'] == products_orders_id:
        if request.method == 'GET':
            row = ProductsOrders.query.get(products_orders_id)
            response_body['message'] = "Producto"
            response_body['result'] = row.serialize()
            return response_body, 200
        
        if request.method == 'PUT':
            data = request.json
            row = ProductsOrders.query.get(products_orders_id)
            row.presentation =  data.get('presentation', row.presentation)
            row.quantity =  data.get('quantity', row.quantity)
            row.unit_price =  data.get('unit_price', row.unit_price)
            row.is_active = data.get('is_active', row.is_active)
            response_body['message'] = f"Este es el put del products_orders_id {products_orders_id}"
            return response_body, 200
        
        if request.method == 'DELETE' and claims['role'] == 'Administrador':
            row = ProductsOrders.query.get(products_orders_id)

            if row and row.is_active:
                row.is_active = False
                db.session.commit()
                response_body['message'] = f"El pedido de producto con id {products_orders_id} ha sido eliminado correctamente."
                return response_body, 200
        
            response_body['message'] = f"El pedido de producto con id {products_orders_id} no se encuentra en la base de datos."
            return response_body, 200


@api.route('/init-admin-data', methods=['GET'])
@jwt_required()
def init_admin_data():
    response_body={}
    suppliers_bdd = Suppliers.query.filter_by(is_active=True).all()
    categories_bdd = Categories.query.filter_by(is_active=True).all()
    sub_categories_bdd = SubCategories.query.filter_by(is_active=True).all()
    users_bdd = Users.query.filter_by(is_active=True).all()
    products_bdd = Products.query.filter_by(is_active=True).all()

    result = {
        "suppliers": [row.basic_data() for row in suppliers_bdd] ,
        "categories": [row.basic_data() for row in categories_bdd ],
        "sub_categories": [row.basic_data() for row in sub_categories_bdd ],
        "users": [row.serialize() for row in users_bdd ],
        "products": [row.serialize() for row in products_bdd ]
    }
    response_body['message'] = 'Informacion Inicial'
    response_body['results'] = result
    return response_body, 200
    

@api.route('/seed', methods=['GET'])
def toSeed():
    db.drop_all()
    db.create_all()
        
    suppliers = [
        Suppliers(name='Fuentes de Naturaleza', address='Avenida de sonrisas 24', cuit='302412267280'),
        Suppliers(name='MoJa i me', address='Calle cortada 10', cuit='272412567240'),
        Suppliers(name='Las Carnes de Juancito', address='Pasillo 34', cuit='40390239029'),
        Suppliers(name='Las Verduras', address='Pasillo 347', cuit='41390239029'),
        Suppliers(name='Carnitas', address='Avenida 2 3472', cuit='5637289190')
    ]
    categories = [
        Categories(name="Carniceria", description="Productos Carnicos"), #0
        Categories(name="Verduleria", description="Productos de verduleria"), #1
        Categories(name="Bebidas CON alcohol", description="Bebidas CON alcohol"), #2
        Categories(name="Bebidas SIN alcohol", description="Bebidas SIN alcohol") #3
    ]
    db.session.add_all( categories + suppliers)
    db.session.commit()

    subCategories = [
        SubCategories(name="Procesados", categories_id=categories[0].id), #0
        SubCategories(name="Vacuno", categories_id=categories[0].id), #1
        SubCategories(name="Porcino", categories_id=categories[0].id), #2
        SubCategories(name="Pollo", categories_id=categories[0].id), #3
        SubCategories(name="Frutas", categories_id=categories[1].id), #4
        SubCategories(name="Verduras", categories_id=categories[1].id), #5
        SubCategories(name="Cervezas", categories_id=categories[2].id), #6
        SubCategories(name="Vinos", categories_id=categories[2].id), #7
        SubCategories(name="Gaseosas", categories_id=categories[3].id), #8
        SubCategories(name="Aguas Saborizadas", categories_id=categories[3].id), #9
    ]
    db.session.add_all(subCategories)
    db.session.commit()

    products = [
        # Carniceria
        Products(name="Hamburguesa", description='medallon de carne de novillo', sub_categories_id=subCategories[0].id), #0
        Products(name="Salchichas", sub_categories_id=subCategories[0].id), #1
        Products(name="Vacio", sub_categories_id=subCategories[1].id), #2
        Products(name="Matambre", sub_categories_id=subCategories[2].id), #3
        Products(name="Pechuga", sub_categories_id=subCategories[3].id), #4
        # Verduleria
        Products(name="Manzana", description='Manzana x bolsa de 10 kg', sub_categories_id=subCategories[4].id), #5
        Products(name="Pera", description='Pera x bolsa de 10 kg', sub_categories_id=subCategories[4].id), #6
        Products(name="Tomate", description='tomate por kg', sub_categories_id=subCategories[5].id), #7
        Products(name="Lechuga", description='Lechuga por paquete', sub_categories_id=subCategories[5].id), #8
        # Bebidas CON alcohol
        Products(name="Estrella", description='Cerveza española', sub_categories_id=subCategories[6].id), #9
        Products(name="San Felipe", description='vino sanjuanino', sub_categories_id=subCategories[7].id), #10
        # Bebidas CON alcohol
        Products(name="Coca Cola", sub_categories_id=subCategories[8].id), #11
        Products(name="Jugo de Naranja", description='jugo diluido', sub_categories_id=subCategories[9].id), #12
    ]

    db.session.add_all(products)
    db.session.commit()

    supliersProducts = [
        SuppliersProducts(suppliers_id=1, products_id=7, nickname='Tomate redondo', price=0.5, presentation='por kg'), #0
        SuppliersProducts(suppliers_id=1, products_id=7, nickname='Tomate perita', price=0.7, presentation='por paquete'), #1
        SuppliersProducts(suppliers_id=4, products_id=7, nickname='Tomate Rojo', price=0.65, presentation='por unidad'), #2
        SuppliersProducts(suppliers_id=2, products_id=9, nickname='Cerveza Estrella', price=1, presentation='por docena'), #3
        SuppliersProducts(suppliers_id=3, products_id=1, nickname='Medallon x10', price=5, presentation='por pack de 10'), #4
        SuppliersProducts(suppliers_id=5, products_id=1, nickname='Carne circular por unidad', price=1, presentation='por radio del circulo de la carne') #5
    ]
    db.session.add_all(supliersProducts)
    db.session.commit()
    contactsData = [
        ContactsData(order_method='whatsapp', supplier_id=1, phone_number='234802343', address='calle 1', mail='mail@mail.com', whatsapp='31894279', first_name='Juan', last_name='Proveedor 1', ), #0
        ContactsData(order_method='mail', supplier_id=2, phone_number='234802343', address='calle 1', mail='mail@mail.com', whatsapp='31894279', first_name='Pedro', last_name='Proveedor 2', ), #1
        ContactsData(order_method='telefono', supplier_id=3, phone_number='234802343', address='calle 1', mail='mail@mail.com', whatsapp='31894279', first_name='Pablo', last_name='Proveedor 3', ), #2
        ContactsData(order_method='whatsapp', supplier_id=4, phone_number='234802343', address='calle 1', mail='mail@mail.com', whatsapp='31894279', first_name='Margarita', last_name='Proveedor 4', ), #3
        ContactsData(order_method='mail', supplier_id=5, phone_number='234802343', address='calle 1', mail='mail@mail.com', whatsapp='31894279', first_name='Juan', last_name='Proveedor 5', ), #4
        ContactsData(order_method='none', phone_number='234802343', address='calle 1', mail='mail@mail.com', whatsapp='31894279', first_name='Javi', last_name='ElAdmin', ), #5
        ContactsData(order_method='none', phone_number='234802343', address='calle 1', mail='mail@mail.com', whatsapp='31894279', first_name='Jaime', last_name='ElUser', ), #6
        ContactsData(order_method='none', phone_number='234802343', address='calle 10', mail='mail@mail.com', whatsapp='31894279', first_name='Sucursal 1', last_name='Palermo', ), #7
        ContactsData(order_method='none', phone_number='234802343', address='calle 12', mail='mail@mail.com', whatsapp='31894279', first_name='Sucursal 2', last_name='La Boca', ), #8
        ContactsData(order_method='none', phone_number='234802343', address='calle 16', mail='mail@mail.com', whatsapp='31894279', first_name='Sucursal 3', last_name='Recoleta', ), #9
        ContactsData(order_method='none', phone_number='234802343', address='calle 1', mail='mail@mail.com', whatsapp='31894279', first_name='Juan', last_name='ElGestor', ), #10
        ContactsData(order_method='none', phone_number='234802343', address='calle 1', mail='mail@mail.com', whatsapp='31894279', first_name='Pedro', last_name='ElReceptor', ) #11
    ]
    db.session.add_all(contactsData)
    db.session.commit()

    users = [
        Users(username="admin", password=1234, role="Administrador", contacts_data_id=contactsData[5].id),
        Users(username="Gestor", password=1234, role="Gestor_de_pedidos", contacts_data_id=contactsData[10].id),
        Users(username="Receptor", password=1234, role="Receptor_de_pedidos", contacts_data_id=contactsData[11].id),
        Users(username="user1", password=1234, contacts_data_id=contactsData[6].id)
    ]
    db.session.add_all(users)
    db.session.commit()

    branches = [
        Branches(contacts_data_id=contactsData[7].id),
        Branches(contacts_data_id=contactsData[8].id),
        Branches(contacts_data_id=contactsData[9].id)
    ]

    db.session.add_all(branches)
    db.session.commit()
    
    orders = [
        Orders(contacts_data_id=contactsData[0].id,order_number='123',user_id=users[0].id, payment_method='credito', amount=10, branch_id=branches[0].id),
        Orders(contacts_data_id=contactsData[1].id,order_number='124',user_id=users[0].id, payment_method='efectivo', amount=20, branch_id=branches[1].id),
        Orders(contacts_data_id=contactsData[2].id,order_number='125',user_id=users[1].id, payment_method='transferencia', amount=30.5, branch_id=branches[0].id),
        Orders(contacts_data_id=contactsData[2].id,order_number='126',user_id=users[0].id, payment_method='efectivo', amount=200, branch_id=branches[2].id),
    ]

    db.session.add_all(orders)
    db.session.commit()

    productOrders = [
        ProductsOrders(suppliers_products_id=supliersProducts[0].id, orders_id=orders[0].id, quantity=1, unit_price=1 ),
        ProductsOrders(suppliers_products_id=supliersProducts[3].id, orders_id=orders[1].id, quantity=1, unit_price=1 ),
        ProductsOrders(suppliers_products_id=supliersProducts[5].id, orders_id=orders[2].id, quantity=1, unit_price=1 )
    ]
    db.session.add_all(productOrders)
    db.session.commit()
    return {}, 200