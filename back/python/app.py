from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import torch
import torch.nn as nn
import torchvision.transforms as transforms
from torchvision import models
import gc
import os
from pathlib import Path


def load_env_file(file_path):
    if not file_path.exists():
        return

    for line in file_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip())


python_dir = Path(__file__).resolve().parent
app_env = os.getenv("APP_ENV", "development")
load_env_file(python_dir / f".env.{app_env}")
load_env_file(python_dir / ".env")

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

device = torch.device("cpu")  # force CPU for free-tier stability

# -------------------------------
# MODEL DEFINITIONS
# -------------------------------

class SiameseNetwork(nn.Module):
    def __init__(self):
        super(SiameseNetwork, self).__init__()
        self.resnet = models.resnet18(pretrained=True)
        self.resnet.fc = nn.Linear(self.resnet.fc.in_features, 128)

    def forward(self, img1, img2):
        feat1 = self.resnet(img1)
        feat2 = self.resnet(img2)
        return feat1, feat2


class UNet(nn.Module):
    def __init__(self):
        super(UNet, self).__init__()
        self.encoder = models.resnet18(pretrained=True)
        self.encoder.fc = nn.Identity()

        self.decoder = nn.Sequential(
            nn.ConvTranspose2d(512, 256, 3, 2, 1, 1),
            nn.ReLU(),
            nn.ConvTranspose2d(256, 128, 3, 2, 1, 1),
            nn.ReLU(),
            nn.ConvTranspose2d(128, 64, 3, 2, 1, 1),
            nn.ReLU(),
            nn.ConvTranspose2d(64, 1, 1),
            nn.Sigmoid()
        )

    def forward(self, x):
        x = self.encoder.conv1(x)
        x = self.encoder.bn1(x)
        x = self.encoder.relu(x)
        x = self.encoder.layer1(x)
        x = self.encoder.layer2(x)
        x = self.encoder.layer3(x)
        x = self.encoder.layer4(x)
        x = self.decoder(x)
        return x


class CNNModel(nn.Module):
    def __init__(self):
        super(CNNModel, self).__init__()
        self.cnn = models.resnet18(pretrained=True)
        self.cnn.fc = nn.Linear(self.cnn.fc.in_features, 1)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        x = self.cnn(x)
        return self.sigmoid(x) * 100


# -------------------------------
# LAZY MODEL LOADING
# -------------------------------

models_cache = {}

def get_siamese():
    if "siamese" not in models_cache:
        model = SiameseNetwork().to(device)
        model.eval()
        models_cache["siamese"] = model
    return models_cache["siamese"]

def get_unet():
    if "unet" not in models_cache:
        model = UNet().to(device)
        model.eval()
        models_cache["unet"] = model
    return models_cache["unet"]

def get_cnn():
    if "cnn" not in models_cache:
        model = CNNModel().to(device)
        model.eval()
        models_cache["cnn"] = model
    return models_cache["cnn"]


# -------------------------------
# PREPROCESSING
# -------------------------------

def preprocess_image(image):
    transform = transforms.Compose([
        transforms.ToPILImage(),
        transforms.Resize((128, 128)),  # reduced size
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                             std=[0.229, 0.224, 0.225])
    ])
    return transform(image).unsqueeze(0).to(device)


# -------------------------------
# MODEL FUNCTIONS
# -------------------------------

def calculate_damage_percentage(original, damaged):
    model = get_siamese()

    original_tensor = preprocess_image(original)
    damaged_tensor = preprocess_image(damaged)

    with torch.no_grad():
        feat1, feat2 = model(original_tensor, damaged_tensor)

    distance = torch.norm(feat1 - feat2, p=2).item()
    return round(min(max(distance * 10, 0), 100), 2)


def segment_damage(image):
    model = get_unet()

    image_tensor = preprocess_image(image)

    with torch.no_grad():
        mask = model(image_tensor)

    mask = mask.squeeze().cpu().numpy()
    mask = (mask > 0.5).astype(np.uint8)

    damage_area_percentage = (np.sum(mask) / mask.size) * 100
    return round(float(damage_area_percentage), 2)


def predict_damage(image):
    model = get_cnn()

    image_tensor = preprocess_image(image)

    with torch.no_grad():
        damage_score = model(image_tensor).item()

    return round(float(damage_score), 2)


# -------------------------------
# API ROUTES
# -------------------------------

@app.route('/compare-images', methods=['POST'])
def compare_images():
    try:
        file1 = request.files['image1']
        file2 = request.files['image2']

        img1 = cv2.imdecode(np.frombuffer(file1.read(), np.uint8), cv2.IMREAD_COLOR)
        img2 = cv2.imdecode(np.frombuffer(file2.read(), np.uint8), cv2.IMREAD_COLOR)

        result = calculate_damage_percentage(img1, img2)

        gc.collect()
        return jsonify({"damagePercentage": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/segment-damage', methods=['POST'])
def segment_damage_api():
    try:
        file = request.files['image']

        img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)

        result = segment_damage(img)

        gc.collect()
        return jsonify({"damageAreaPercentage": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/predict-damage', methods=['POST'])
def predict_damage_api():
    try:
        file = request.files['image']

        img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)

        result = predict_damage(img)

        gc.collect()
        return jsonify({"damageScore": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------
# RUN APP
# -------------------------------

if __name__ == '__main__':
    host = os.getenv("ML_HOST", "0.0.0.0")
    port = int(os.getenv("ML_PORT", "5001"))
    debug = os.getenv("ML_DEBUG", "false").lower() == "true"
    app.run(host=host, port=port, debug=debug)
