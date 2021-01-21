# Image microsevice REST API

set-up in ```../docker-compose.yml```

```yml
  image-service:
    restart: always
    image: darken141/microservice-images
    command: npm run start
    environment:
      - MONGO_URI=mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@mongodb:27017/${MONGO_INITDB_DATABASE}
    ports: 
      - 9000:3000 # [outside]:inside
    links: 
      - mongodb # database
    volumes: 
      - ./image-uploading/uploads:/app/uploads
      - images_modules:/app/node_modules
    networks:
      - local
    depends_on: 
      - mongodb # database
```

and at the end

```yml
    volumes:
      images_modules:
```

Default image model in ```./config.js```

```js
const imageModel = {
    name:{
        type:String
    },
    alt:{
        type:String
    },
    imagePath:{
        type:String,
        required:true
    },
    dateCreated:{
        type:Date,
        default:Date.now
    },
    size: {
        type: Number
    }
}
```

routes:
GET ```/images``` - return all images.
GET ```/images/:id``` - return single image.
POST ```/images``` - upload images from ```imagesToUpload``` file input. Max 10 at one request.
DELETE ```/images/:id``` - delete single image.

images are available on ```/uploads/:imagePath```
