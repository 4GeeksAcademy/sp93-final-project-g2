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
from api.models import db, Users, Products, Categories, SubCategories

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

        users = [
            Users(username="admin", password=1234, role="Administrador"),
            Users(username="user1", password=1234)
        ]
        categories = [
            Categories(name="Carniceria", description="Productos Carnicos"), #0
            Categories(name="Verduleria", description="Productos de verduleria"), #1
            Categories(name="Bebidas CON alcohol", description="Bebidas CON alcohol"), #2
            Categories(name="Bebidas SIN alcohol", description="Bebidas SIN alcohol") #3
        ]
        db.session.add_all(users + categories)
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
            Products(name="Hamburguesa", description='medallon de carne de novillo', sub_categories_id=subCategories[0].id),
            Products(name="Salchichas", sub_categories_id=subCategories[0].id),
            Products(name="Vacio", sub_categories_id=subCategories[1].id),
            Products(name="Matambre", sub_categories_id=subCategories[2].id),
            Products(name="Pechuga", sub_categories_id=subCategories[3].id),
            # Verduleria
            Products(name="Manzana", description='Manzana x bolsa de 10 kg', sub_categories_id=subCategories[4].id),
            Products(name="Pera", description='Pera x bolsa de 10 kg', sub_categories_id=subCategories[4].id),
            Products(name="Tomate", description='tomate por kg', sub_categories_id=subCategories[5].id),
            Products(name="Lechuga", description='Lechuga por paquete', sub_categories_id=subCategories[5].id),
            # Bebidas CON alcohol
            Products(name="Estrella", description='Cerveza española', sub_categories_id=subCategories[6].id),
            Products(name="San Felipe", description='vino sanjuanino', sub_categories_id=subCategories[7].id),
            # Bebidas CON alcohol
            Products(name="Coca Cola", sub_categories_id=subCategories[8].id),
            Products(name="Jugo de Naranja", description='jugo diluido', sub_categories_id=subCategories[9].id),
        ]

        db.session.add_all(products)
        db.session.commit()

        print("Seed cargado")


# This only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
