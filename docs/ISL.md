# Indian Sign Language (ISL) Standards & Dataset Documentation

## 1. Overview & Linguistic Identity

Indian Sign Language (ISL) is a natural, complete language utilized by over 18 million Deaf and hard-of-hearing individuals across the Indian subcontinent. ISL is **linguistically distinct** from American Sign Language (ASL), British Sign Language (BSL), and other international systems.

### Critical Distinctions: ISL vs ASL
* **Manual Alphabet & Numbers**: ISL fundamentally incorporates a **two-handed manual alphabet** (derived historically from two-handed British/BANZSL roots) alongside distinct regional variations, whereas ASL exclusively relies on single-handed fingerspelling.
* **Grammatical Structure**: ISL adheres to a **Subject-Object-Verb (SOV)** typology resembling spoken Indian languages (Hindi, Bengali, Tamil, etc.), contrasting with ASL's Subject-Verb-Object (SVO) / Topic-Comment structures.
* **Spatial & Non-Manual Features**: ISL incorporates facial expressions, head movements, and mouth morphemes that carry syntactic weight.

> **CRITICAL ARCHITECTURAL POLICY**: Under no circumstances should single-handed ASL heuristics or random hand gestures be mislabeled as Indian Sign Language. All gesture representations must originate from verified ISL corpora.

---

## 2. Verified Indian Sign Language Datasets

To ensure authentic sign language recognition, the SignX platform integrates with and references verified, peer-reviewed Indian Sign Language corpora:

### A. INCLUDE Dataset (Primary Benchmark)
* **Full Title**: *INCLUDE: A Large Scale Dataset for Indian Sign Language Recognition*
* **Institutions**: Indian Institute of Technology Madras (IIT Madras) & Microsoft Research India
* **Publication**: ACM Multimedia (ACM MM 2020)
* **Authors**: Prem Selvaraj, Gokul N.C., Pratyush Kumar, Mitesh M. Khapra
* **Dataset Characteristics**:
  * **Classes**: 263 isolated word and phrase signs across 15 domains (Greetings, Everyday Words, Education, Emergency, etc.).
  * **Video Samples**: 4,287 high-definition RGB video recordings.
  * **Performers**: 7 experienced native deaf signers ensuring linguistic authenticity.
  * **Licensing**: Creative Commons Attribution-NonCommercial (CC BY-NC 4.0) for academic and educational accessibility research.
  * **Resource URL**: [INCLUDE Dataset on GitHub / Zenodo](https://github.com/AI4Bharat/INCLUDE)

### B. ISLRTC 10,000-Term Official ISL Dictionary
* **Authority**: **Indian Sign Language Research and Training Centre (ISLRTC)**
  * Autonomous Body under the Department of Empowerment of Persons with Disabilities (Divyangjan), Ministry of Social Justice and Empowerment, Government of India.
* **Corpus Scope**:
  * Over 10,000 standardized signs spanning basic conversation, academic terminology, administrative, medical, and technical vocabularies.
  * Officially approved video reference standard across India.
* **Resource URL**: [https://islrtc.nic.in/](https://islrtc.nic.in/)

### C. CISLR (Continuous Indian Sign Language Recognition)
* **Institutions**: IIIT Hyderabad, CSIR-CEERI
* **Scope**: Continuous sentence-level sign language video datasets for continuous gesture recognition and temporal sequence modeling.

---

## 3. Supported Classes in SignX Model Adapter

The current SignX machine learning inference adapter (`backend/app/ml/model_adapter.py`) defines a structured 36-class output vector representing the verified foundational ISL manual alphabet and numeric digits:

| Category | Classes | Details |
| :--- | :--- | :--- |
| **ISL Alphabet** | **A – Z** (26 classes) | Standard two-handed and verified single/dual manual letter signs conforming to ISLRTC standards |
| **ISL Digits** | **0 – 9** (10 classes) | Verified numeric representations in Indian Sign Language |

*Class mapping is strictly indexed via `model/labels/classes.json`.*

---

## 4. End-to-End Recognition Architecture

The real ISL recognition pipeline strictly separates **spatial landmark extraction** from **neural classification**:

```
Webcam Frame (30 FPS)
       │
       ▼
Google MediaPipe Hands
(21 3D Spatial Landmarks: x, y, z normalized per hand)
       │
       ▼
Landmark Coordinate Normalization & Feature Alignment
(63-dimensional vector per hand, normalized relative to wrist)
       │
       ▼
Trained ISL Neural Network
(Deep CNN / BiLSTM / Spatial-Temporal GCN trained on INCLUDE / ISLRTC data)
       │
       ▼
Softmax Probability Distribution across verified ISL classes
       │
       ▼
Confidence Filter & Temporal Window Smoothing
       │
       ▼
Authentic Translated Text + Speech Synthesis
```

### Zero-Faking Policy:
1. **MediaPipe is NOT the classifier**: MediaPipe performs vision-based keypoint tracking. It does not possess intrinsic knowledge of ISL syntax or semantics.
2. **Real Model Inference**: Classification is exclusively performed when a valid weights file (`model/weights/signx_model.h5` or ONNX model) trained on verified ISL is loaded.
3. **No Heuristic Guesses**: If the model is not loaded or confidence is below threshold, the system displays:
   `"Waiting for sign..."` or `"Model weights awaiting installation (signx_model.h5)"`
   It will never invent or guess "Hello" or "Thank you".

---

## 5. Model Weights Setup Guide

To connect your trained ISL neural network:
1. Train a 1D-CNN or Dense Neural Network using the 63-dimensional normalized landmark features extracted from the INCLUDE / ISLRTC dataset.
2. Export the trained weights to Keras H5 format: `signx_model.h5`.
3. Place the file at:
   ```
   SIGNX/model/weights/signx_model.h5
   ```
4. Configure the environment variable in `.env`:
   ```bash
   MODEL_PATH=../model/weights/signx_model.h5
   ```
5. Restart the backend service. The engine will detect the model, report `is_loaded: True`, and begin streaming genuine predictions.
