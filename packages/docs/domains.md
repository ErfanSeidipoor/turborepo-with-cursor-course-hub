## List of DOMAINs

- User

---

# User DOMAIN

**DOMAIN-DESCRIPTION:**
Manages user authentication, credentials, and core user identity information. This domain handles user account creation, authentication, and serves as the foundation for user-related entities throughout the system (such as children profiles, activities, and other user-associated data).

**DOMAIN-MAIN-ENTITIES:**

- User: Represents an authenticated user in the system with unique credentials. Contains username and hashed password for authentication purposes, along with base tracking fields (id, createdAt, updatedAt).

**DOMAIN-GENERAL-ENTITIES:**

- **DOMAIN-RULES:**

1. Username must be unique across all users in the system.
2. Password must be stored in hashed format only; plain text passwords are never persisted.
3. Password field is excluded from default queries for security purposes and must be explicitly selected when needed.
4. Username must not exceed 255 characters.
5. A user account cannot be deleted if it has associated child entities (children, activities, etc.).
6. User credentials (username and password) are required fields and cannot be null.
7. User ID is automatically generated as UUID and cannot be manually assigned.
8. Timestamps (createdAt, updatedAt) are automatically managed by the system.
