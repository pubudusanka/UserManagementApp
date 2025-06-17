# 🔒 User Management App with Secure HTTP-Only Cookie Authentication
## 🚀 Overview
A secure user management application featuring a React frontend and Java backend that implements HTTP-Only cookies for authentication. This architecture provides enhanced security against XSS attacks while maintaining reliability through Java's robust backend services.
## 🔐 Key Security Features
### HTTP-Only Cookie Authentication (Java Implementation)
- **Servlet-based cookie management** - Secure token handling via Java EE
- **Spring Security integration** - Robust authentication workflows
- **Strict cookie policies** - Secure, HttpOnly, and SameSite attributes
- **JWT in cookies only** - Never exposed to client-side JavaScript

### Java-Specific Security Measures
- Spring Security configuration
- Password encoding with BCryptPasswordEncoder
- CSRF protection (when using session cookies)
- CORS filtering
- Input validation with Java Bean Validation

## 📦 Tech Stack
### Frontend
- React.js
- Axios (with *withCredentials: true*)
- Bootstrap for UI

### Backend (Java)
- Core: Java 17+
- Framework: Spring Boot 3.x
- Security: Spring Security 6.x
- Build: Maven/Gradle

## 🛠️ Installation
1 Clone the repository:
```bash
git clone https://github.com/pubudusanka/UserManagementApp.git
cd UserManagementApp
```
## 🌐 Java API Endpoints
| ApiEndpoint               | Method | Description                     | Security   |
|---------------------------|--------|---------------------------------|------------|
| `/auth/registernewuser`   | POST   | Register User                   | Public     |
| `/auth/login`             | POST   | Login as user or admin (set http only cookies)          | Public     |
| `/auth/regitseradminuser` | POST   | Register Admin (only can admin) | Admin Only |
| `/auth/getallusers`       | GET    | Get all users                   | Admin Only |
| `/auth/deleteuser/{id}`   | POST   | Delete specific user            | Admin Only |

## ✉️ Contact
For any inquiries or feedback, feel free to reach out:
- **Linkedin:** pubudusanka
- **Email:** pubudusanka79@gmail.com
