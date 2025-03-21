import os
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from .models import db, Suppliers, SuppliersProducts, Products, Categories, SubCategories, ProductsOrders, Users, Branches, Orders, ContactsData


def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'darkly'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(Users, db.session))  # You can duplicate that line to add mew models
    admin.add_view(ModelView(Suppliers, db.session))
    admin.add_view(ModelView(SuppliersProducts, db.session))
    admin.add_view(ModelView(Products, db.session))
    admin.add_view(ModelView(Categories, db.session))
    admin.add_view(ModelView(SubCategories, db.session))
    admin.add_view(ModelView(ProductsOrders, db.session))
    admin.add_view(ModelView(Branches, db.session))
    admin.add_view(ModelView(Orders, db.session))
    admin.add_view(ModelView(ContactsData, db.session))
    