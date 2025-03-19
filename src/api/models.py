from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


class Suppliers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    cuit = db.Column(db.Integer, unique=True, nullable=False)

class SuppliersProducts(db.Model):
    __tablename__ = "suppliers_products"

    id = db.Column(db.Integer, primary_key=True)
    suppliers_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=False)
    products_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    nickname = db.Column(db.String(50))
    price = db.Column(db.Integer, nullable=False)

class Products(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(500))
    subCategories_id = db.Column(db.Integer, db.ForeignKey('subCategories.id'), nullable=False)
    image = db.Column(db.string(500))

class SubCategories(db.Model):
    __tablename__ = "sub_categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(500))
    categories_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)

class Categories(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(500))

class ProductsOrders(db.Model):
    __tablename__ = "product_order"

    id = db.Column(db.Integer, primary_key=True)
    suppliers_products_id = db.Column(db.Integer, db.ForeignKey('suppliers_products.id'), nullable=False)
    orders_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    unit = db.Column(db.Integer, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Integer, nullable=False)

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    contacts_data_id = db.Column(db.Integer, db.ForeignKey('contacts_data.id'))
    username = db.Column(db.String(50), unique=True nullable=False)
    password = db.Column(db.String(50), nullable=False)
    role = db.Column(db.Enum(), nullable=False)

class Branches(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    contacts_data_id = db.Column(db.Integer, db.ForeignKey('contacts_data.id'))
                    