# POS SYSTEM FOR CLOTHING SHOP - UI
This system is derived from previous system of POS for super market

### Main changes
We stoped using units and used pcs as primary unit to input and sell/return items. 
this can change if future versions require more complex system for input items or selling them.

We are starting with version 1.0.0

We originally build and installed this version as version 3.0.0
However I feel we need to start off from version one as this POS system is 
specific for Clothing shop and has different needs

This version can be used for production purposes
And we installed this version for a clothing shop with no problems

This system works great, However it lacks primary features
like 
1. returning an item
1. invoices page
1. Reports and Shop expenses (rent, electericity, cashier, and other expenses)
1. Dynamic shop information for invoice 
1. Systme must run for one year only
1. Giving items to people as a gift
1. Documentation

### VERSION 1.1.0: Add return item
- This minor version introduces return items feature
- invoices type can be either "sale" or "return"
  "sale" for saling items
  "return" for returning invoices

- Client side expected to pass invoice type to server so it can handle request
- Client side is also expected to gurntee returned quantity is valid
  (when returning items, the system will check if the item's total available pcs 
  is less than the sum of the items from all stocks for that item)

- max quantity to return will be sum of amoun in pc - total available pieces
- max quantity for customer to buy will be total availalbe pcs

- return money to customer can be in cash or other ways (cashier must specify)

- when cashier scans same item more than one time there is possibility to run 
  into error as system doesn't check sum of amount in pcs and forgive button will be cut button (This problem got fixed) 
  however when inputing number of returned items it could still go wrong.

- whene it is return invoice, the receipt must be labeled as returned invoice

- in dashboard we must check invoice type is sale or return so we could drive statistics.

### VERSION 1.1.1: Enable Backspace button
  On saling page enable backspace button
  
### VERSION 1.1.2: Enable Delete button
  On saling page enable delete button

### VERSION 1.1.3: Add invoice type to invoice receipt

### VERSION 1.2.0: Add reports
