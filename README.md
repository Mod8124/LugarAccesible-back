## Initialize Project
**Step 1**: Install dependencies.
```$ npm install```

**Step 2**: Run docker-compose for Postgresql and pgadmin4.

```$ docker-compose up -d```

**Step 3**: Migrate prisma models.

```$ npx prisma migrate dev --name init```

**Step 4**: Run Node scripts.
```$ npm start``` &nbsp; &nbsp; &nbsp; &nbsp; → Run in production.

```$ npm run dev``` &nbsp; &nbsp; → Run in mode development.

```$ npm run build``` → Build the project before deployment.

**Step 5**: Check if everything has gone well. In your browser type the following urls. 
> http://localhost:4000 → expected → `{"message": "Welcome to our api"}`
> http://localhost:4000/users → expected → `[]`