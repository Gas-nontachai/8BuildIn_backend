// const { PurchaseRequestController } = require('@/controllers');

module.exports = {
  AuthService: require('./auth.service'),
  CustomerService: require('./customer.service'),
  EmployeeService: require('./employee.service'),
  LicenseService: require('./license.service'),
  MaterialCategoryService: require('./material-category.service'),
  MaterialService: require('./material.service'),
  MenuService: require('./menu.service'),
  ProductCategoryService: require('./product-category.service'),
  ProductService: require('./product.service'),
  StockInService: require('./stock-in.service'),
  StockOutService: require('./stock-out.service'),
  SupplierService: require('./supplier.service'),
  UnitService: require('./unit.service'),
  CartService: require('./cart.service'),
  PurchaseRequestService: require('./purchase-request.service'),
  PurchaseOrderService: require('./purchase-order.service')
}
