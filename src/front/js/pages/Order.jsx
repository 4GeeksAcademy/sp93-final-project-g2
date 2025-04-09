import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/order.css";

export const Order = () => {
    const { store, actions } = useContext(Context);
    const [viewSubcategories, setViewSubcategories] = useState(false); 
    const [viewProducts, setViewProducts] = useState(false); 
    const [viewSuppliersProducts, setViewSuppliersProducts] = useState(false);  
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null); 
    const [selectedProduct, setSelectedProduct] = useState(null); 
    const [titleText, setTitleText] = useState("Selecciona una Categoría"); 
    const [loadingCategories, setLoadingCategories] = useState(true); 
    const [loadingSubcategories, setLoadingSubcategories] = useState(false); 
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [loadingSuppliersProducts, setLoadingSuppliersProducts] = useState(false); 

    useEffect(() => {
        if (store.categories.length === 0) {  
            actions.getCategories(); 
        } else {
            setLoadingCategories(false); 
        }
    }, [actions, store.categories.length]);

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId);
        setLoadingSubcategories(true); 
        actions.getSubcategories(categoryId); 
        setTitleText("Selecciona una Subcategoría"); 
        setViewSubcategories(true);  
        setViewProducts(false);  
        setViewSuppliersProducts(false);
    };

    useEffect(() => {
        if (store.subcategories.length > 0) {
            setLoadingSubcategories(false);  
        }
    }, [store.subcategories]);

    const handleSubcategoryClick = (subcategoryId) => {
        setSelectedSubcategory(subcategoryId); 
        setLoadingProducts(true); 
        actions.getProductsBySubcategory(subcategoryId); 
        setTitleText("Selecciona un Producto"); 
        setViewProducts(true);  
        setViewSuppliersProducts(false);
    };

    useEffect(() => {
        if (store.products.length > 0) {
            setLoadingProducts(false); 
        }
    }, [store.products]);

    const handleProductClick = (productId) => {
        setSelectedProduct(productId); 
        setLoadingSuppliersProducts(true); 
        actions.getSuppliersProductsByProduct(productId); 
        setTitleText("Selecciona un Producto de Proveedor"); 
        setViewSuppliersProducts(true);
    };

    useEffect(() => {
        if (store.suppliersProducts.length > 0) {
            setLoadingSuppliersProducts(false); 
        }
    }, [store.suppliersProducts]);

    const renderSubcategories = () => {
        if (loadingSubcategories) return <div className="loading-message">Cargando Subcategorías...</div>; 

        if (!store.subcategories || store.subcategories.length === 0) {
            return <div>No hay subcategorías disponibles</div>;
        }

        return (
            <div className="subcategories-list">
                <h3>Subcategorías</h3>
                {store.subcategories.map((subcategory) => (
                    <div key={subcategory.id} className="subcategory-item">
                        <button className="button-order" onClick={() => handleSubcategoryClick(subcategory.id)}>
                            {subcategory.name}
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    const renderProducts = () => {
        if (loadingProducts) return <div className="loading-message">Cargando Productos...</div>; 

        if (!store.products || store.products.length === 0) {
            return <div>No hay productos disponibles</div>;
        }

        return (
            <div className="products-list">
                <h3>Productos</h3>
                {store.products.map((product) => (
                    <div key={product.id} className="product-item">
                        <h4>{product.name}</h4>
                        <p>{product.description || "Sin descripción"}</p>
                        <button className="button-order" onClick={() => handleProductClick(product.id)}>Ver Proveedores</button>
                    </div>
                ))}
            </div>
        );
    };

    const renderSuppliersProducts = () => {
        if (!store.suppliersProducts) {
            return <div>No hay productos de proveedor disponibles</div>;
        }
    
        if (store.suppliersProducts.length === 0) {
            return <div>No hay productos de proveedor disponibles</div>;
        }
    
        return (
            <div className="suppliers-products-list">
                <h3>Productos de Proveedor</h3>
                {store.suppliersProducts.map((supplierProduct) => {
                    const supplierId = supplierProduct.suppliers_id;
                    let supplier = store.suppliers.find(supplier => supplier.id === supplierId);
    
                    if (!supplier) {
                        actions.getSupplierById(supplierId);
                    }
    
                    return (
                        <div key={supplierProduct.id} className="supplier-product-item">
                            <h4>{supplierProduct.nickname}</h4>
                            <p>{supplierProduct.presentation}</p>
                            <p>Precio: ${supplierProduct.price}</p>
                            <p>Proveedor: {supplier ? supplier.name : "Cargando proveedor..."}</p>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderCategories = () => {
        if (loadingCategories) return <div className="loading-message">Cargando Categorías...</div>; 

        return (
            <div className="categories-list">
                <h3>Categorías</h3>
                {store.categories.length > 0 ? (
                    store.categories.map((category) => (
                        <div key={category.id} className="category-item">
                            <button className="button-order" onClick={() => handleCategoryClick(category.id)}>
                                {category.name}
                            </button>
                        </div>
                    ))
                ) : (
                    <div>No hay categorías disponibles</div>
                )}
            </div>
        );
    };

    const handleBack = () => {
        if (viewSuppliersProducts) {
            setViewSuppliersProducts(false);  
            setTitleText("Selecciona un Producto");
        } else if (viewProducts) {
            setViewProducts(false);  
            setTitleText("Selecciona una Subcategoría");
        } else if (viewSubcategories) {
            setViewSubcategories(false); 
            setTitleText("Selecciona una Categoría");
        }
    };

    return (
        <div className="order-container">
            <h2>{titleText}</h2> 
            {(viewSubcategories || viewProducts || viewSuppliersProducts) && (
                <button className="back-button" onClick={handleBack}>
                    Volver
                </button>
            )}
            {viewSuppliersProducts ? renderSuppliersProducts() : viewProducts ? renderProducts() : viewSubcategories ? renderSubcategories() : renderCategories()}
        </div>
    );
};
