FROM node:20

WORKDIR /app

# copy project
COPY backend ./backend
COPY frontend ./frontend

# install backend
WORKDIR /app/backend
RUN npm install

# install frontend
WORKDIR /app/frontend
RUN npm install

# copy frontend env (IMPORTANT)
COPY frontend/.env /app/frontend/.env

# build frontend
RUN npm run build

# move frontend build to backend public
RUN mkdir -p /app/backend/public
RUN cp -r /app/frontend/dist/* /app/backend/public/

# run backend
WORKDIR /app/backend

EXPOSE 5000

CMD ["node","index.js"]
