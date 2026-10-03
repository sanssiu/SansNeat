# Security Specification for SansNeat Firestore Database

## 1. Data Invariants
1. `food_items`: Publicly readable by all users. Write operations allowed for authenticated users.
2. `orders`: Readable and writable by all users, with validation on item fields and totals.
3. `users`: Readable and writable for user profile definitions.
4. `wishlists`: Users can read and write favorite item entries.

## 2. Payload Security Specs
- All document IDs must be valid string identifiers (`isValidId`).
- All text strings must adhere to length constraints (`size() <= N`).
- Default-deny all unlisted paths (`match /{document=**} { allow read, write: if false; }`).
