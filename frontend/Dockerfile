FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Application code
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]