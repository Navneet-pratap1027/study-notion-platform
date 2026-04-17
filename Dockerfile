# Stage 1: Build Stage
FROM node:18-alpine AS build_stage
WORKDIR /app

ARG REACT_APP_BASE_URL
ENV REACT_APP_BASE_URL=$REACT_APP_BASE_URL
# -------------------------------------------------

COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Production Stage (Nginx)
FROM nginx:alpine
COPY --from=build_stage /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]