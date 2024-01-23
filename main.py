import uvicorn
from fastapi import FastAPI,File,UploadFile
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from PIL import Image
from io import BytesIO
from keras.models import load_model
from fastapi import Request
import os


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = tf.keras.models.load_model("Mammals_predictionv1.h5")


class_name = ['african_elephant','alpaca','american_bison','anteater','arctic_fox','armadillo','baboon','badger','blue_whale','brown_bear','camel','dolphin','giraffe','groundhog',
'highland_cattle',
'horse',
'jackal',
'kangaroo',
'koala',
 'manatee',
 'mongoose',
 'mountain_goat',
 'opossum',
 'orangutan',
 'otter',
 'polar_bear',
 'porcupine',
 'red_panda',
 'rhinoceros',
 'sea_lion',
 'seal',
 'snow_leopard',
 'squirrel',
 'sugar_glider',
 'tapir',
 'vampire_bat',
 'vicuna',
 'walrus',
 'warthog',
 'water_buffalo',
 'weasel',
 'wildebeest',
 'wombat',
 'yak',
 'zebra']



app.mount("/static", StaticFiles(directory="frontend/static"), name="static")
templates = Jinja2Templates(directory="frontend")


@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get('/ping')
async def check():
    return "Hello world"


def read_file_as_image(data):
    img = Image.open(BytesIO(data)).resize((224, 224))
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    return img_array


@app.post('/predict')
async def prediction(file: UploadFile = File(...)):

     img = read_file_as_image(await file.read())
     img = np.expand_dims(img, axis=0)

     predicted =  model.predict(img)
     result = class_name[np.argmax(predicted[0])]
     confidence = np.max(predicted[0])

     return{
         'class': result,
         'confidence':round(confidence * 100, 1)
     }

if __name__ == '__main__':
     import os
     uvicorn.run(app, host='0.0.0.0', port=int(os.environ.get('PORT',10000)))
