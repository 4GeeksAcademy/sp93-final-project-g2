from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


db = SQLAlchemy()

 
class Suppliers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    cuit = db.Column(db.String(63), unique=True, nullable=False)
    
    def __repr__(self):
            return f'{self.name}'

    def serialize(self):
        return {"id": self.id,
                "name": self.name,
                "address": self.address,
                "cuit": self.cuit}


class SuppliersProducts(db.Model):
    __tablename__ = "suppliers_products"
    id = db.Column(db.Integer, primary_key=True)
    suppliers_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=False)
    suppliers_to = db.relationship('Suppliers', foreign_keys=[suppliers_id], backref=db.backref('suppliers_product_to', lazy='select'))
    products_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    products_to = db.relationship('Products', foreign_keys=[products_id], backref=db.backref('products_supplier_to', lazy='select'))
    nickname = db.Column(db.String(50))
    price = db.Column(db.Integer, nullable=False)

    def __repr__(self):
            return f'<SuppliersProducts {self.nickname}>'

    def serialize(self):
        return {"id": self.id,
                "suppliers_id": self.suppliers_id,
                "products_id": self.products_id,
                "nickname": self.nickname,
                "price": self.price}


class Products(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(500))
    sub_categories_id = db.Column(db.Integer, db.ForeignKey('sub_categories.id'), nullable=False)
    sub_categories_to = db.relationship('SubCategories', foreign_keys=[sub_categories_id], backref=db.backref('sub_categories_to', lazy='select'))
    image = db.Column(db.String(500))

    def __repr__(self):
            return f'{self.name}'

    def serialize(self):
        return {"id": self.id,
                "name": self.name,
                "description": self.description,
                "sub_categories_id": self.sub_categories_id,
                "image": self.image}
    

class SubCategories(db.Model):
    __tablename__ = "sub_categories"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(500))
    categories_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    categories_to = db.relationship('Categories', foreign_keys=[categories_id], backref=db.backref('categories_to', lazy='select'))

    def __repr__(self):
            return f'{self.name}'

    def serialize(self):
        return {"id": self.id,
                "name": self.name,
                "description": self.description,
                "categories_id": self.categories_id}
    

class Categories(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(500))

    def __repr__(self):
            return f'{self.name}'

    def serialize(self):
        return {"id": self.id,
                "name": self.name,
                "description": self.description}
    

class ProductsOrders(db.Model):
    __tablename__ = "product_order"
    id = db.Column(db.Integer, primary_key=True)
    suppliers_products_id = db.Column(db.Integer, db.ForeignKey('suppliers_products.id'), nullable=False)
    suppliers_products_to = db.relationship('SuppliersProducts', foreign_keys=[suppliers_products_id], backref=db.backref('suppliers_product_order_to', lazy='select'))
    orders_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    orders_to = db.relationship('Orders', foreign_keys=[orders_id], backref=db.backref('orders_products_to', lazy='select'))
    presentation = db.Column(db.Integer, nullable=False) #Evaluar si lo hacemos enum o tabla, es para especificar por ej kilogramos, gramos, bultos, paquete, unidad etc
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Integer, nullable=False)

    def __repr__(self):
            return f'<ProductsOrders {self.id}>'

    def serialize(self):
        return {"id": self.id,
                "suppliers_products_id": self.suppliers_products_id,
                "orders_id": self.orders_id,
                "presentation": self.presentation,
                "quantity": self.quantity,
                "orders_id": self.orders_id,
                "unit_price": self.unit_price}
    

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    contacts_data_id = db.Column(db.Integer, db.ForeignKey('contacts_data.id'))
    contacts_data_to = db.relationship('ContactsData', foreign_keys=[contacts_data_id], backref=db.backref('contact_data_users_to', lazy='select'))
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
    role = db.Column(db.Enum('Administrador', 'Gestor_de_pedidos', 'Receptor_de_pedidos', 'visitante', name='user_role'), nullable=False, default='visitante')
    is_active = db.Column(db.Boolean, default=True)   
     
    def __repr__(self):
            return f'<Users {self.username}>'

    def serialize(self):
        if self.role != 'visitante':
                return {"id": self.id,
                        "contacts_data_id": self.contacts_data_id,
                        "username": self.username,
                        "role": self.role,
                        "is_active": self.is_active}
        return {"id": self.id,
                "username": self.username,
                "role": self.role}
    

class Branches(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    contacts_data_id = db.Column(db.Integer, db.ForeignKey('contacts_data.id'))
    contacts_data_to = db.relationship('ContactsData', foreign_keys=[contacts_data_id], backref=db.backref('contact_data_branches_to', lazy='select'))

    def __repr__(self):
            return f'<Branches {self.id}>'

    def serialize(self):
        return {"id": self.id,
                "contacts_data_id": self.contacts_data_id}


class Orders(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    contacts_data_id = db.Column(db.Integer, db.ForeignKey('contacts_data.id'))
    contacts_data_to = db.relationship('ContactsData', foreign_keys=[contacts_data_id], backref=db.backref('contact_data_orders_to', lazy='select'))
    order_number = db.Column(db.Integer, nullable=True, unique=True)
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

    def __repr__(self):
            return f'<Orders {self.id}>'

    def serialize(self):
        return {"id": self.id,
                "contacts_data_id": self.contacts_data_id,
                "order_number": self.order_number,
                "user_id": self.user_id,
                "start_date": self.start_date,
                "end_date": self.end_date,
                "delivery_date": self.delivery_date,
                "active": self.active,
                "status": self.status,
                "payment_method": self.payment_method,
                "amount": self.amount,
                "branch_id": self.branch_id}
    

class ContactsData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_method = db.Column(db.Enum("whatsapp", "mail", "telefono", name='order_method'))
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'))
    supplier_to = db.relationship('Suppliers', foreign_keys=[supplier_id], backref=db.backref('suplier_contact_data_to', lazy='select'))
    phone_number = db.Column(db.String(63))
    address = db.Column(db.String(255))
    mail = db.Column(db.String(255))
    whatsapp = db.Column(db.String(63))
    first_name = db.Column(db.String(63))
    last_name = db.Column(db.String(63))
    active = db.Column(db.Boolean, default=True) 

    def __repr__(self):
            return f'<ContactsData {self.id}>'

    def serialize(self):
        return {"id": self.id,
                "order_method": self.order_method,
                "supplier_id": self.supplier_id,
                "phone_number": self.phone_number,
                "address": self.address,
                "mail": self.mail,
                "whatsapp": self.whatsapp,
                "first_name": self.first_name,
                "last_name": self.last_name,
                "active": self.active}
    