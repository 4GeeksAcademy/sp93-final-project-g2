"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from api.models import db, Users, Products, Categories, SubCategories, Suppliers, SuppliersProducts, ContactsData, Branches, Orders, ProductsOrders

from flask_jwt_extended import JWTManager

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False
# Database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)
# Other configurations
setup_admin(app)  # Add the admin
setup_commands(app)  # Add the admin
app.register_blueprint(api, url_prefix='/api')  # Add all endpoints form the API with a "api" prefix
# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")  # Change this!
jwt = JWTManager(app)

# Handle/serialize errors like a JSON object
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code


# Generate sitemap with all your endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')


# Any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


@app.cli.command("seed")
def seed():
    with app.app_context():
        db.drop_all()
        db.create_all()

        
        suppliers = [
            Suppliers(name='Fuentes de Naturaleza', address='Avenida de sonrisas 24', cuit='302412267280'), #0
            Suppliers(name='MoJa i me', address='Calle cortada 10', cuit='272412567240'), #1
            Suppliers(name='Las Carnes de Juancito', address='Pasillo 34', cuit='40390239029'), #2
            Suppliers(name='Las Verduras', address='Pasillo 347', cuit='41390239029'), #3
            Suppliers(name='Carnitas', address='Avenida 2 3472', cuit='5637289190') #4
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
            SuppliersProducts(suppliers_id=suppliers[0].id, products_id=products[7].id, nickname='Tomate redondo', price=0.5, presentation='por kg'), #0
            SuppliersProducts(suppliers_id=suppliers[0].id, products_id=products[7].id, nickname='Tomate perita', price=0.7, presentation='por paquete'), #1
            SuppliersProducts(suppliers_id=suppliers[3].id, products_id=products[7].id, nickname='Tomate Rojo', price=0.65, presentation='por unidad'), #2
            SuppliersProducts(suppliers_id=suppliers[1].id, products_id=products[9].id, nickname='Cerveza Estrella', price=1, presentation='por docena'), #3
            SuppliersProducts(suppliers_id=suppliers[2].id, products_id=products[0].id, nickname='Medallon x10', price=5, presentation='por pack de 10'), #4
            SuppliersProducts(suppliers_id=suppliers[4].id, products_id=products[0].id, nickname='Carne circular por unidad', price=1, presentation='por radio del circulo de la carne') #5
        ]
        db.session.add_all(supliersProducts)
        db.session.commit()
        contactsData = [
            ContactsData(order_method='whatsapp', supplier_id=suppliers[0].id, phone_number='234802343', address='calle 1', mail='mail@mail.com', whatsapp='31894279', first_name='Juan', last_name='Proveedor 1'), #0
            ContactsData(order_method='mail', supplier_id=suppliers[1].id, phone_number='234802343', address='calle 1', mail='mail@mail.com', whatsapp='31894279', first_name='Pedro', last_name='Proveedor 2'), #1
            ContactsData(order_method='telefono', supplier_id=suppliers[2].id, phone_number='234802343', address='calle 1', mail='mail@mail.com', whatsapp='31894279', first_name='Pablo', last_name='Proveedor 3'), #2
            ContactsData(order_method='whatsapp', supplier_id=suppliers[3].id, phone_number='234802343', address='calle 1', mail='mail@mail.com', whatsapp='31894279', first_name='Margarita', last_name='Proveedor 4'), #3
            ContactsData(order_method='mail', supplier_id=suppliers[4].id, phone_number='234802343', address='calle 1', mail='mail@mail.com', whatsapp='31894279', first_name='Juan', last_name='Proveedor 5'), #4
            ContactsData(order_method='none', phone_number='234802343', address='calle 1', mail='mail@mail.com', whatsapp='31894279', first_name='Javi', last_name='ElAdmin'), #5
            ContactsData(order_method='none', phone_number='234802343', address='calle 1', mail='mail@mail.com', whatsapp='31894279', first_name='Jaime', last_name='ElUser'), #6
            ContactsData(order_method='none', phone_number='234802343', address='calle 10', mail='mail@mail.com', whatsapp='31894279', first_name='Sucursal 1', last_name='Palermo'), #7
            ContactsData(order_method='none', phone_number='234802343', address='calle 12', mail='mail@mail.com', whatsapp='31894279', first_name='Sucursal 2', last_name='La Boca'), #8
            ContactsData(order_method='none', phone_number='234802343', address='calle 16', mail='mail@mail.com', whatsapp='31894279', first_name='Sucursal 3', last_name='Recoleta'), #9
            ContactsData(order_method='none', phone_number='234802343', address='calle 1', mail='mail@mail.com', whatsapp='31894279', first_name='Juan', last_name='ElGestor'), #10
            ContactsData(order_method='none', phone_number='234802343', address='calle 1', mail='mail@mail.com', whatsapp='31894279', first_name='Pedro', last_name='ElReceptor'), #11
            ContactsData(order_method='mail', supplier_id=suppliers[0].id, phone_number='234802343', address='calle 1', mail='mail@mail.com', whatsapp='31894279', first_name='Margarita', last_name='Herrera'), #12
            ContactsData(order_method='telefono', supplier_id=suppliers[0].id, phone_number='234802343', address='calle 1', mail='mail@mail.com', whatsapp='31894279', first_name='Fernando', last_name='Fernandez') #13
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
            Branches(contacts_data_id=contactsData[7].id, name='Malaga'),
            Branches(contacts_data_id=contactsData[8].id, name='Madrid'),
            Branches(contacts_data_id=contactsData[9].id, name='Barcelona')
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
        print("Seed cargado")


# This only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
