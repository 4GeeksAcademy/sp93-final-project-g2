from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


db = SQLAlchemy()

 
class Suppliers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    cuit = db.Column(db.String(63), unique=True, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    
    def __repr__(self):
            return f'{self.name}'

    def serialize(self):
        return {"id": self.id,
                "name": self.name,
                "address": self.address,
                "cuit": self.cuit,
                "is_active": self.is_active,
                "contacts": [row.serialize() for row in self.supplier_contact_data_to]}

    def get_supplier(self):
        return {"id": self.id,
                "name": self.name,
                "address": self.address,
                "cuit": self.cuit,
                "is_active": self.is_active}
    
    def basic_data(self):
        return{"id": self.id,
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
    price = db.Column(db.Float, nullable=False)
    presentation = db.Column(db.String())
    is_active = db.Column(db.Boolean, default=True)


    def __repr__(self):
            return f'<SuppliersProducts {self.nickname}>'

    def serialize(self):
        return {"id": self.id,
                "suppliers": self.suppliers_to.basic_data(),
                "suppliers_id": self.suppliers_id,
                "products_id": self.products_id,
                "nickname": self.nickname,
                "price": self.price,
                "presentation": self.presentation,
                "is_active": self.is_active}
    
    def nicknameFn(self): 
        return self.nickname

class Products(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(500))
    sub_categories_id = db.Column(db.Integer, db.ForeignKey('sub_categories.id'), nullable=False)
    sub_categories_to = db.relationship('SubCategories', foreign_keys=[sub_categories_id], backref=db.backref('sub_categories_to', lazy='select'))
    image = db.Column(db.String(500))
    is_active = db.Column(db.Boolean, default=True)

    def __repr__(self):
            return f'{self.name}'

    def serialize(self):
        return {"id": self.id,
                "name": self.name,
                "description": self.description,
                "sub_categories_id": self.sub_categories_id,
                "image": self.image,
                "is_active": self.is_active}
    

class SubCategories(db.Model):
    __tablename__ = "sub_categories"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(500))
    categories_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    categories_to = db.relationship('Categories', foreign_keys=[categories_id], backref=db.backref('categories_to', lazy='select'))
    is_active = db.Column(db.Boolean, default=True)

    def __repr__(self):
            return f'{self.name}'

    def serialize(self):
        return {"id": self.id,
                "name": self.name,
                "description": self.description,
                "categories_id": self.categories_id}
    
    def basic_data(self):
        return{"id": self.id,
               "name": self.name,
               "description": self.description,
               "categories_id": self.categories_id}

class Categories(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(500))
    is_active = db.Column(db.Boolean, default=True)

    def __repr__(self):
            return f'{self.name}'

    def serialize(self):
        return {"id": self.id,
                "name": self.name,
                "description": self.description,
                "is_active": self.is_active}
    
    def basic_data(self):
        return{"id": self.id,
               "name": self.name,
               "description": self.description}

class ProductsOrders(db.Model):
    __tablename__ = "product_order"
    id = db.Column(db.Integer, primary_key=True)
    suppliers_products_id = db.Column(db.Integer, db.ForeignKey('suppliers_products.id'), nullable=False)
    suppliers_products_to = db.relationship('SuppliersProducts', foreign_keys=[suppliers_products_id], backref=db.backref('suppliers_product_order_to', lazy='select'))
    orders_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    orders_to = db.relationship('Orders', foreign_keys=[orders_id], backref=db.backref('orders_products_to', lazy='select'))
    quantity = db.Column(db.Float, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    is_active = db.Column(db.Boolean, default=True)

    def __repr__(self):
            return f'<ProductsOrders {self.id}>'

    def serialize(self):
        return {"id": self.id,
                "suppliers_products_id": self.suppliers_products_id,
                "nickname": self.suppliers_products_to.nicknameFn(),
                "orders_id": self.orders_id,
                "quantity": self.quantity,
                "unit_price": self.unit_price,
                "is_active": self.is_active}
    

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
        return {"id": self.id,
                "contacts_data_id": self.contacts_data_id,
                "contacts_data": self.contacts_data_to.serialize() if self.contacts_data_id else 'Sin datos de contacto',
                "username": self.username,
                "role": self.role}
        

class Branches(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    contacts_data_id = db.Column(db.Integer, db.ForeignKey('contacts_data.id'))
    contacts_data_to = db.relationship('ContactsData', foreign_keys=[contacts_data_id], backref=db.backref('contact_data_branches_to', lazy='select'))
    is_active = db.Column(db.Boolean, default=True)

    def __repr__(self):
            return f'<Branches {self.id}>'

    def serialize(self):
        return {"id": self.id,
                "name": self.name,
                "contacts_data_id": self.contacts_data_id,
                "contacts_data": self.contacts_data_to.serialize(),
                }


class Orders(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    contacts_data_id = db.Column(db.Integer, db.ForeignKey('contacts_data.id'))
    contacts_data_to = db.relationship('ContactsData', foreign_keys=[contacts_data_id], backref=db.backref('contact_data_orders_to', lazy='select'))
    order_number = db.Column(db.String(63), nullable=True, unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user_to = db.relationship('Users', foreign_keys=[user_id], backref=db.backref('users_orders_to', lazy='select'))
    start_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    end_date = db.Column(db.DateTime)
    delivery_date = db.Column(db.DateTime)
    status = db.Column(db.Enum('pendiente', 'cancelado', 'recibido', 'borrador', 'reprogramado', name='order_status'), nullable=False, default='borrador')
    payment_method = db.Column(db.Enum('transferencia', 'efectivo', 'debito', 'credito', 'cheque', name='payment_method'))
    amount = db.Column(db.Float)
    branch_id = db.Column(db.Integer, db.ForeignKey('branches.id'))
    branch_to = db.relationship('Branches', foreign_keys=[branch_id], backref=db.backref('branch_orders_to', lazy='select'))
    is_active = db.Column(db.Boolean, default=True)

    def __repr__(self):
            return f'<Orders {self.id}>'

    def serialize(self):
        return {"id": self.id,
                "contacts_data_id": self.contacts_data_id,
                "contacts_data": self.contacts_data_to.serialize(),
                "order_number": self.order_number,
                "user_id": self.user_id,
                "start_date": self.start_date,
                "end_date": self.end_date,
                "delivery_date": self.delivery_date,
                "is_active": self.is_active,
                "status": self.status,
                "payment_method": self.payment_method,
                "amount": self.amount,
                "branch_id": self.branch_id,
                "branch": self.branch_to.serialize(),
                "is_active": self.is_active}
    

class ContactsData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_method = db.Column(db.Enum("whatsapp", "mail", "telefono", "none", name='order_method'))
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'))
    supplier_to = db.relationship('Suppliers', foreign_keys=[supplier_id], backref=db.backref('supplier_contact_data_to', lazy='select'))
    phone_number = db.Column(db.String(63))
    address = db.Column(db.String(255))
    mail = db.Column(db.String(255))
    whatsapp = db.Column(db.String(63))
    first_name = db.Column(db.String(63))
    last_name = db.Column(db.String(63))
    is_active = db.Column(db.Boolean, default=True) 

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
                "is_active": self.is_active,
                "supplier": self.supplier_to.get_supplier() if self.supplier_id else {}} 
 