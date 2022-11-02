# nodeAssign
## Seller APIs 
### POST /register
- Create a seller document from request body. Request body must contain image.
- Upload image to S3 bucket and save it's public url in seller document.
- Save password in encrypted format. (use bcrypt)

### POST /login
- Allow an seller to login with their email and password.
- On a successful login attempt return the sellerId and a JWT token contatining the sellerId, exp, iat.
> **_NOTE:_** There is a slight change in response body. You should also return sellerId in addition to the JWT token.

## Products API (_No authentication required_)
### POST /products
- Create a product document from request body.
- Upload product image to S3 bucket and save image public url in document.

### GET /products
- Returns all products in the collection that aren't deleted.
  - __Filters__
    - Size (The key for this filter will be 'size')
    - Product name (The key for this filter will be 'name'). You should return all the products with name containing the substring recieved in this filter
    - Price : greater than or less than a specific value. The keys are 'priceGreaterThan' and 'priceLessThan'. 
    
> **_NOTE:_** For price filter request could contain both or any one of the keys. For example the query in the request could look like { priceGreaterThan: 500, priceLessThan: 2000 } or just { priceLessThan: 1000 } )
    
  - __Sort__
    - Sorted by product price in ascending or descending. The key value pair will look like {priceSort : 1} or {priceSort : -1}



### GET /products/:productId
- Returns product details by product id

### PUT /products/:productId
- Updates a product by changing at least one or all fields
- Check if the productId exists (must have isDeleted false and is present in collection). If it doesn't, return an HTTP status 404 with a response body like [this](#error-response-structure)


### DELETE /products/:productId
- Deletes a product by product id if it's not already deleted

