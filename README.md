<div align="center">

# 🏢 Co-working Space Reservation API

**A RESTful Backend API for Co-working Space Management & Booking**

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

</div>

---

## 📖 Overview

ระบบ Backend API สถาปัตยกรรม RESTful สำหรับบริหารจัดการสถานที่ทำงานร่วม (Co-working Space) และการจองพื้นที่ พัฒนาขึ้นสำหรับ **CEDT68 Software Development Practice Project** โดยรองรับระบบสมาชิก การแบ่งสิทธิ์ผู้ใช้งาน (Role-Based Access Control) และมีระบบรักษาความปลอดภัยอย่างครบถ้วน

---

## ✨ Features

### 🔐 Authentication & Authorization
- ระบบ Register / Login ด้วย Email & Password
- ยืนยันตัวตนผ่าน **JSON Web Tokens (JWT)** พร้อม **HTTP-only Cookies**
- ระบบ Logout เพื่อล้าง Cookie อย่างปลอดภัย
- Middleware `protect` & `authorize` สำหรับควบคุมสิทธิ์การเข้าถึง

### 👥 Role-Based Access Control (RBAC)

| Feature | Guest | User | Admin |
|:--------|:-----:|:----:|:-----:|
| View Coworking Spaces | ✅ | ✅ | ✅ |
| Register / Login | ✅ | — | — |
| View Own Bookings | — | ✅ | ✅ |
| Create Booking (max 3) | — | ✅ | ✅ (no limit) |
| Update / Delete Own Booking | — | ✅ | ✅ |
| Manage All Bookings | — | ❌ | ✅ |
| CRUD Coworking Spaces | — | ❌ | ✅ |

### 🗄️ Advanced Database
- **Mongoose Virtual Populate** เชื่อมโยง CoworkingSpace ↔ Booking
- **Cascade Delete** — ลบสถานที่ → ลบการจองที่เกี่ยวข้องทั้งหมดอัตโนมัติ
- Password hashing ด้วย **bcrypt** (pre-save middleware)

### 🛡️ Security
| Layer | Package |
|:------|:--------|
| Security Headers | `helmet` |
| NoSQL Injection Prevention | `express-mongo-sanitize` |
| XSS Protection | `express-xss-sanitizer` |
| Rate Limiting | `express-rate-limit` (50 req / 10 min) |
| HTTP Parameter Pollution | `hpp` |
| Cross-Origin Resource Sharing | `cors` |

---

## 📊 System Diagrams

### 1. Use Case Diagram
> *แสดงสิทธิ์การใช้งานของระบบระหว่าง Guest, User และ Admin*

<img src="./images/usecase.jpg" alt="Use Case Diagram" width="600">

### 2. Class Diagram (UML Profile)
> *แสดงโครงสร้างฐานข้อมูลและความสัมพันธ์ระหว่าง User, CoworkingSpace และ Booking*

<img src="./images/class-diagram.png" alt="Class Diagram" width="600">

### 3. Sequence Diagram
> *แสดงลำดับการทำงาน: Register, Login, Create Booking, Delete CoworkingSpace (Cascade)*

<img src="./images/sequence-diagram.png" alt="Sequence Diagram" width="600">

---

## 🛠️ Tech Stack

| Category | Technology |
|:---------|:-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB Atlas + Mongoose ODM |
| Authentication | bcryptjs, jsonwebtoken, cookie-parser |
| Security | helmet, express-mongo-sanitize, express-xss-sanitizer, express-rate-limit, hpp, cors |
| Documentation | swagger-jsdoc, swagger-ui-express |
| Testing | Newman (Postman CLI) |
| Dev Tools | nodemon |

---

## � Project Structure

```
be-project-68-cucode/
├── config/
│   ├── config.env          # Environment variables
│   └── db.js               # MongoDB connection
├── controllers/
│   ├── auth.js             # Register, Login, GetMe, Logout
│   ├── Bookings.js         # CRUD Bookings
│   └── coworkingspaces.js  # CRUD Coworking Spaces
├── middleware/
│   └── auth.js             # protect & authorize middleware
├── models/
│   ├── User.js             # User schema + JWT + bcrypt
│   ├── CoworkingSpace.js   # CoworkingSpace schema + virtuals
│   └── Booking.js          # Booking schema
├── routes/
│   ├── auth.js             # /api/v1/auth
│   ├── bookings.js         # /api/v1/bookings
│   └── coworkingspaces.js  # /api/v1/coworkingspaces
├── postman/                # Postman collection & environment
├── docs/                   # PlantUML diagram sources
├── images/                 # Diagram images for README
├── server.js               # Entry point
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB)

### 1. Clone & Install

```bash
git clone https://github.com/2110503-CEDT68/be-project-68-cucode.git
cd be-project-68-cucode
npm install
```

### 2. Configure Environment Variables

สร้างไฟล์ `config/config.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
```

### 3. Run the Server

```bash
# Development (with hot-reload)
npm run dev

# Production
node server.js
```

Server จะรันที่ `http://localhost:5000`

---

## � API Endpoints

### Auth (`/api/v1/auth`)

| Method | Endpoint | Access | Description |
|:-------|:---------|:-------|:------------|
| `POST` | `/register` | Public | สมัครสมาชิก |
| `POST` | `/login` | Public | เข้าสู่ระบบ |
| `GET` | `/me` | Private | ดูข้อมูลตัวเอง |
| `GET` | `/logout` | Private | ออกจากระบบ |

### Coworking Spaces (`/api/v1/coworkingspaces`)

| Method | Endpoint | Access | Description |
|:-------|:---------|:-------|:------------|
| `GET` | `/` | Public | ดูรายการทั้งหมด |
| `GET` | `/:id` | Public | ดูรายละเอียด |
| `POST` | `/` | Admin | เพิ่มสถานที่ |
| `PUT` | `/:id` | Admin | แก้ไขสถานที่ |
| `DELETE` | `/:id` | Admin | ลบสถานที่ (cascade) |

### Bookings (`/api/v1/bookings`)

| Method | Endpoint | Access | Description |
|:-------|:---------|:-------|:------------|
| `GET` | `/` | Private | ดูการจอง (user=own, admin=all) |
| `GET` | `/:id` | Private | ดูรายละเอียดการจอง |
| `POST` | `/coworkingspaces/:id/bookings` | Private | สร้างการจอง (max 3/user) |
| `PUT` | `/:id` | Private | แก้ไขการจอง (owner/admin) |
| `DELETE` | `/:id` | Private | ลบการจอง (owner/admin) |

---

## 📚 API Documentation (Swagger)

หลังจากรัน server ให้เปิดเบราว์เซอร์ไปที่:

```
http://localhost:5000/api-docs
```

Interactive API documentation powered by **Swagger UI** — สามารถทดสอบยิง API ได้ทันที

---

## 🧪 Testing with Newman

```bash
newman run postman/Demo_CEDT68_Project.postman_collection.json \
  -e postman/Coworking\ Space\ Env.postman_environment.json \
  -r htmlextra
```

---

## 👥 Contributors

| Name | Student ID |
|:-----|:-----------|
| นรินธร ยางงาม | 6833136121 |
| ปณิชา กีรติบุญญากร | 6833149321 |
| ปวงศ์ถวัตน์ วิจิตพจน์ | 6833157321 |

---

<div align="center">

**CEDT68 — Software Development Practice**

*Chulalongkorn University · Faculty of Engineering*

</div>
