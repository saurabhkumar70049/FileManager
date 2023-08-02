# Node.js File Manager

This is a simple file manager project which uses technology like nodeJs, mongodb, AWS.

## Requirements

- Node.js
- npm
- mongoDB
- AWS

## Installation

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Need AWS account.
4. Run the server with `npm start`.

## Usage

1. Open your web browser and navigate to `http://localhost:8080`.
2. Use the file manager to browse and manage files on AWS S3 bucket.

## dependencies
1. "aws-sdk": "^2.1425.0".
2. "bcrypt": "^5.1.0".
3. "cors": "^2.8.5".
4. "deep-email-validator": "^0.1.21".
5. "dotenv": "^16.3.1".
6. "express": "^4.18.2".
7. "http-status": "^1.6.2".
8. "jsonwebtoken": "^9.0.1".
9. "mongoose": "^7.4.1".
10. "multer": "^1.4.5-lts.1"
11. "nodemailer": "^6.9.4".
12. "uuid": "^9.0.0".


## devDependencies
1. "nodemon": "^3.0.1".

## User API
<ul>
  <li>register new user : http://localhost:8080/user/add</li>
  <li>login : http://localhost:8080/user/login</li>
  <li>logout : http://localhost:8080/user/logout</li>
  <li>Forget user password: http://localhost:8080/user/forgetPassword</li>
  <li>reset user password : http://localhost:8080/user/resetPassword</li>
  <li>fetch All user detail (only Admin) : http://localhost:8080/user/fetchAll</li>
  <li>fetch One User Detail : http://localhost:8080/user/fetchOne</li>
  <li>Upadate User detail : http://localhost:8080/user/update</li>
  <li>delete user account: http://localhost:8080/user/delete</li>
  <li><b>NOTE: </b>One mail varification API call from email</li>
</ul>

## File API
<ul>
  <li>Create a folder : http://localhost:8080/file/createFolder</li>
  <li>Create a subfolder : http://localhost:8080/file/createSubFolder</li>
  <li>Upload a file on destination : http://localhost:8080/file/uploadFile</li>
  <li>Delete folder or file : http://localhost:8080/file/deleteFile</li>
  <li>Fetch All File Detail assosiated with User : http://localhost:8080/file/fetchAll</li>
</ul>


## .env File demo-model
<p>

DATABASE_URL=<br>
JWT_LOGIN_SECRET_KEY=<br>
JWT_EMAIL_SECRET_KEY=<br>
EMAIL_USERID=saurabhbarej.me@gmail.com<br>
EMAIL_PASS=<br>
AWS_REGION=<br>
AWS_BUCKET_NAME=<br>
  
</p>

## Important Point
<ul>
  <li>I doesn't upload the env file due to security cconcerns </li>
  <li>All APIs are authenticated and authorized</li>
</ul>
