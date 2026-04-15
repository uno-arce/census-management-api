An API that features a collection of barangay inhabitant information. Admins can update and add new inhabitants using the prescribed census form format. Additional features such as searching, filtering, and sorting is added for accessibilty of data. Lastly, a history feature to audit logs. Uses Prisma for object data modeling and Supabase as SQL database.

## Functionalities
**Key Functionalities**
- User Authentication
- Relational Database Management
- Rest API
- CRUD

## What's Inside
**Folder Structure**  
```
-- src  
├── controllers  
├── lib
    ├── prisma.js    ## Prisma database configuration
├── prisma
    ├── migrations   ## Object relational models
├── routes
```

**Dependencies**  
| Package | Purpose |
| --- | --- |
| `@prisma/client` | Type-safe database ORM and query builder |
| `bcryptjs` | Password hashing and security |
| `cors` | Enabling Cross-Origin Resource Sharing |
| `dotenv` | Managing environment variables from .env files |
| `cors` | Enabling Cross-Origin Resource Sharing |
| `express` | Web application framework for Node.js |
| `jsonwebtoken` | Securely transmitting information as a JSON object |
