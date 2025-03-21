from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


db = SQLAlchemy()


class Suppliers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    cuit = db.Column(db.Integer, unique=True, nullable=False)

#db.relationship('Posts', foreign_keys=[post_id], backref=db.backref('medias_to', lazy='select'))

class SuppliersProducts(db.Model):
    __tablename__ = "suppliers_products"
    id = db.Column(db.Integer, primary_key=True)
    suppliers_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=False)
    suppliers_to = db.relationship('Suppliers', foreign_keys=[suppliers_id], backref=db.backref('suppliers_product_to', lazy='select'))
    products_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    products_to = db.relationship('Products', foreign_keys=[products_id], backref=db.backref('products_supplier_to', lazy='select'))
    nickname = db.Column(db.String(50))
    price = db.Column(db.Integer, nullable=False)


class Products(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(500))
    sub_categories_id = db.Column(db.Integer, db.ForeignKey('sub_categories.id'), nullable=False)
    sub_categories_to = db.relationship('SubCategories', foreign_keys=[sub_categories_id], backref=db.backref('sub_categories_to', lazy='select'))
    image = db.Column(db.String(500))


class SubCategories(db.Model):
    __tablename__ = "sub_categories"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(500))
    categories_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    categories_to = db.relationship('Categories', foreign_keys=[categories_id], backref=db.backref('categories_to', lazy='select'))


class Categories(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(500))


class ProductsOrders(db.Model):
    __tablename__ = "product_order"
    id = db.Column(db.Integer, primary_key=True)
    suppliers_products_id = db.Column(db.Integer, db.ForeignKey('suppliers_products.id'), nullable=False)
    suppliers_products_to = db.relationship('SuppliersProducts', foreign_keys=[suppliers_products_id], backref=db.backref('suppliers_product_order_to', lazy='select'))
    orders_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    orders_to = db.relationship('Orders', foreign_keys=[orders_id], backref=db.backref('orders_products_to', lazy='select'))
    unit = db.Column(db.Integer, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Integer, nullable=False)


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    contacts_data_id = db.Column(db.Integer, db.ForeignKey('contacts_data.id'))
    contacts_data_to = db.relationship('ContactsData', foreign_keys=[contacts_data_id], backref=db.backref('contact_data_users_to', lazy='select'))
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
    role = db.Column(db.Enum('Administrador', 'Gestor_de_pedidos', 'Receptor_de_pedidos', 'visitante', name='user_role'), nullable=False, default='visitante')


class Branches(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    contacts_data_id = db.Column(db.Integer, db.ForeignKey('contacts_data.id'))
    contacts_data_to = db.relationship('ContactsData', foreign_keys=[contacts_data_id], backref=db.backref('contact_data_branches_to', lazy='select'))


class Orders(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    contacts_data_id = db.Column(db.Integer, db.ForeignKey('contacts_data.id'))
    contacts_data_to = db.relationship('ContactsData', foreign_keys=[contacts_data_id], backref=db.backref('contact_data_orders_to', lazy='select'))
    order_number = db.Column(db.Integer, nullable=False, unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user_to = db.relationship('Users', foreign_keys=[user_id], backref=db.backref('users_orders_to', lazy='select'))
    start_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    end_date = db.Column(db.DateTime)
    delivery_date = db.Column(db.DateTime)
    active = db.Column(db.Boolean, default=True)
    status = db.Column(db.Enum('pendiente', 'cancelado', 'recibido', 'borrador', 'reprogramado', name='order_status'), nullable=False, default='borrador')
    payment_method = db.Column(db.Enum('transferencia', 'efectivo', 'debito', 'credito', 'cheque', name='payment_method'))
    amount = db.Column(db.Float)
    branch_id = db.Column(db.Integer, db.ForeignKey('branches.id'))
    branch_to = db.relationship('Branches', foreign_keys=[branch_id], backref=db.backref('branch_orders_to', lazy='select'))


class ContactsData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_method = db.Column(db.Enum("whatsapp", "mail", "telefono", name='order_method'))
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'))
    supplier_to = db.relationship('Suppliers', foreign_keys=[supplier_id], backref=db.backref('suplier_contact_data_to', lazy='select'))
    phone_number = db.Column(db.Integer)
    address = db.Column(db.String(255))
    mail = db.Column(db.String(255))
    whatsapp = db.Column(db.Integer)
    first_name = db.Column(db.String(63))
    last_name = db.Column(db.String(63))   
                                 