from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


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
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
    role = db.Column(db.Enum('Administrador', 'Gestor_de_pedidos', 'Receptor_de_pedidos', 'visitante', name='user_role'), nullable=False, default='visitante')


class Branches(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    contacts_data_id = db.Column(db.Integer, db.ForeignKey('contacts_data.id'))


class Orders(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    contacts_data_id = db.Column(db.Integer, db.ForeignKey('contacts_data.id'))
    order_number = db.Column(db.Integer, nullable=False, unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    start_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    end_date = db.Column(db.DateTime)
    delivery_date = db.Column(db.DateTime)
    active = db.Column(db.Boolean, default=True)
    status = db.Column(db.Enum('pendiente', 'cancelado', 'recibido', 'borrador', 'reprogramado', name='order_status'), nullable=False, default='borrador')
    payment_method = db.Column(db.Enum('transferencia', 'efectivo', 'debito', 'credito', 'cheque', name='payment_method'))
    amount = db.Column(db.Float)
    branch_id = db.Column(db.Integer, db.ForeignKey('branches.id'))


class ContactsData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_method = db.Column(db.Enum("whatsapp", "mail", "telefono", name='order_method'))
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'))
    phone_number = db.Column(db.Integer)
    address = db.Column(db.String(255))
    mail = db.Column(db.String(255))
    whatsapp = db.Column(db.Integer)
    first_name = db.Column(db.String(63))
    last_name = db.Column(db.String(63))                                    