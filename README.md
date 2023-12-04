# Punto

TP project 
It's a little game respecting the rules of Punto, with three different databases and several options such as adding data sets or other. 

## Getting Started

These instructions will help you set up and run the project on your local machine.

### Prerequisites

Make sure you have Node.js and npm installed on your machine.

### Installing

1. Clone the repository:

    ```bash
    git clone https://github.com/Trivent21/TPPunto.git
    ```

2. Navigate to the project directory:

    ```bash
    cd TPPunto
    ```

3. Initialize a new npm project:

    ```bash
    npm init
    ```

4. Install dependencies:

    ```bash
    npm install ejs@^3.1.9
    npm install express@^4.18.2
    npm install fs@^0.0.1-security
    npm install math@^0.0.3
    npm install mongodb@6.3
    npm install mongoose@^8.0.2
    npm install mysql2@^3.6.3
    npm install path@^0.12.7
    npm install sequelize@^6.35.0
    npm install sequelize-cli@^6.6.2
    npm install sqlite3@^5.1.6
    npm install neo4j-driver@^5.15.0
    ```

### Database Setup

#### MySQL

1. Make sure your MySQL server is running.

2. Connect to MySQL:

    ```bash
    mysql -u your_username -p
    ```

3. Create a MySQL database named "punto":

    ```sql
    CREATE DATABASE punto;
    ```

4. Exit the MySQL shell:

    ```sql
    exit;
    ```
    
5. Go in repository config and Change mysql variable with your set up database (make this also for mongo if you can)

```json
{
  "sqlite": {
    "dialect": "sqlite",
    "storage": "development.db"
  },
  "mysql": { 
    "username": "your_usename",
    "password": "your_password",
    "database": "punto",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
```
#### MongoDB

1. Make sure your MongoDB and mongosh is installed and server is running.

```bash
sudo service mongod start
```

2. Connect to mongosh:

    ```bash
    mongosh
    ```

3. Create a MongoDB database named "punto":

    ```bash
    use punto
    ```

4. Exit the MongoDB shell:

    ```bash
    exit
    ```

## Running the Application
```bash
npm run start
```
#### SQLite

1. Make sure your SQLite is installed.

## Authors

- Matéo FLEJOU
