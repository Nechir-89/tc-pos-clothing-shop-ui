# POS for Single Point of Sale - Client 
#### Version less than 2

### Notes
#### In this version, the following will not be editable
- Item name
- Item category
- Pieces per unit
- Unit name
- Unit name of piece
- Inputing date

#### Setting/Updating Stock Expire Date
- Admin users can set/update expire date of stock.
- Expire date is optional but higly recomended.
- API URI: /api/stocks/update/expire_date

#### Setting/Updating Stock Production Date
- In version 1, users can not input item stock production date.
- It also can not be updated or deleted.

#### Setting/Updating Quantity of Expired Items in a Stock
- It will be inapproparate for admin users to set a fraction of a stock as expired items.
- Only all left in stock can be set as expired items.
- Before setting stock to expire, the expire date must be set or provided.
- Stocks can not be expired if no items left in stock.
- Stocks can not be set expired if expired date has not met yet.
- Next version must automaticaly set all left items in stock expired if stock met its expire date.
- Cashiers should not be able to sell expired items.
- Expired units and pcs do not cut off anything from total cost of stock.
- Expired items are different than damaged items
- API URI: /api/states/stocks/update/expire_stock

### Updating barcodes (barcode and pc barcode)
- barcodes can be null in db but version 1 sets empty string for items with no barcode/s
- Editing barcodes requires at least one non empty barcode (i.e barcode or pc barcode or both of them must be provided)
- When editing barcodes they should not be same as the old barcodes (i.e at least one of barcodes must be different)
- API URI: /api/stocks/update/barcodes

### Add/Update damaged quantity
- This will update version from 1.1.5 to 1.1.6
- solid_units and solid_pcs are still unused fields
- Adding quantity of damaged items should not exced current number of available units plus previously damaged items
  (Max Units = Current Units + Proviously Damaged Units)
  (Max Pcs = Current Pcs + Proviously Damaged Pcs)
- When editing damaged items they should not be same as the old quantity of damaged items
- To prevent errors there is only pieces input for damaged quantity
- API URI: /api/states/stocks/update/damaged_items


### Starting from version 1.1.6
- Decimal point precision **bug** can raise any time in following components
  - stock page (addNewStock)
  - new item page (addNewItem)
  - setting damaged items from setDamagedItemsModel component (setDamagedItems)
  - setting returned pcs to wholesaler in ReturnToWholesaler compnent

### Returning to Wholesaler/supplier
- This will update version from 1.1.6 to 1.1.7
- API URI: /api/states/stocks/update/returned_to_wholesaler

### Deleting stock
- This will set app version to 1.2.7
- condition for deleting stock to meet
  - it should not be solid 
  - it should have no expired pcs
  - it should have no returned pcs
  - it should have no damaged pcs
- API URI: /api/stocks/delete

### Updating stock quantity
- This will set version to 1.2.8
- **New inputed quantity** must be greater than the used quantity (New >= Used)
- **Used quantity** is sum of solid quantity, expired quantity, damaged quantity, gifted quantity, and returned quantity to wholesaler
- To find used quantity:
  used_quantity = amount_in_units - current_units
- New quantity must not be equals to previous quantity
- API URI: /api/stocks/update/amount_in_units

### Updating stock cost and price
- This will set version to 1.2.9
- The new cost and price must be different than prevously inputed
- This update can be used also for offering discounts
- Pc cost must not be in fractions

### Payment method feature
- This will set version to 1.3.9
- API URI: 
    - Get all payment methods (get): /api/payment_methods
    - Get active payment methods (get): /api/payment_methods/active
    - Add payment method (post): /api/payment_methods/add
    - Set (toggle) payment method active/inactive (put): /api/payment_methods/toggle
    - Set payment method default (put): /api/payment_methods/default
    - Change payment method name (put): /api/payment_methods/change_name
- Not all methods can be disabled/inactive
- New added method can be set to default
- Payment method can not be deleted but it can be inactive
- Inactive payment method can not be set to default method

### Printing Invoice
- This will set client app version to 1.4.9
- Printing invoice before saving it will not have invoice id
- printed time and date are pointing to current time and date of system, next versions must fix this problem.

### Fixing bug: displaying zero stock for non scan items
- This will set client version to 2.4.10
- When clicking non-scan items button, the application displays all stocks even those that are no longer left anything in the stock


### Features and Ideas
- It would be greate if cashier gets a message for selling expired items
- Add dollar currancy
- have a button to make all left in stock damaged
- It would be better to have a model with calculator when cashier clicks on pay button,
  we could also add payment method to the model
- 
