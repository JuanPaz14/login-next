## correr en dev

1. Clonar el repositorio
2. crear una copia de ```.env.template``` y renombrarlo a ```.env``` 
3. instalar dependencias ```npm install``` 
4. levantar la base de datos ```docker compose up -d```
5. correr las migraciones de prisma ```npx prisma migrate dev```