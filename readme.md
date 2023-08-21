<!-- @format -->

# How to create postgresql instance with docker

- Create database with docker

```
    ----LINUX----

    sudo docker run -p 5432:5432 --name postgres_condor_db -v /home/condorApp/data:/var/lib/postgresql/data -d -e POSTGRES_PASSWORD=default_condor_password -d postgres

    ----WINDOWS---

    docker run --name postgres_condor2  -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=default_condor_password -e POSTGRES_DB=postgres_condor_db2 -p 5432:5432 -d postgres

    docker run --name postgres_condor3  -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=default_condor_password -e POSTGRES_DB=postgres_condor_db3 -p 5432:5432 -d postgres
```

- Connect to database instance
  --DVEABER-- utilizando las variables de entorno

- Generate schemas with api/sql/export-final.sql
  -- En el dveaber, crear un script sql con lo que esta en el exportfinal para crear todas las tablas dentro de la base de datos.

# How run the Api project locally

- Install Packages

```
    npm install
```

- Create and open the .env file and modify it with your configuration values

- Seed initial data

```
    npx sequelize-cli db:seed:all
```

- Start app

```
    npm start
```

---

# How to Deploy Api project with docker

- Create and open the .env file and modify it with your configuration values

- Create Dockerfile

```
FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY src/ ./src
COPY --chown=node:node .env .
COPY --chown=node:node .sequelizerc .
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]
```

- Build container

```
    docker build . -t condor/condor_app
```

- Then, run:

```
    sudo docker run -dp 8080:8080 --name condorApp condor/condor_app
```
