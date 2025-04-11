FROM node:20 as build
RUN mkdir /app
COPY . /app
WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json   
RUN npm install
COPY . /app
ENV PORT=5173
CMD [ "npm", "run", "dev" ]
RUN npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf 
RUN rm -rf ./*
COPY --from=build /app/dist .

EXPOSE 80/tcp

ENTRYPOINT ["nginx", "-g", "daemon off;"]