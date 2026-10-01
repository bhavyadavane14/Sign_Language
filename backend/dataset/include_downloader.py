"""
include_downloader.py
---------------------
Downloads a sample of the INCLUDE ISL dataset from Zenodo (no auth needed).
Extracts frames from videos using OpenCV and saves them as images.

Usage: python include_downloader.py
"""

import os
import sys
import zipfile
import requests
import json
import subprocess
from pathlib import Path

# ── Config ────────────────────────────────────────────────────────────────────
BASE_DIR    = Path(__file__).parent
OUT_DIR     = BASE_DIR / "include_raw"
FRAMES_DIR  = BASE_DIR / "include_frames"
OUT_DIR.mkdir(exist_ok=True)
FRAMES_DIR.mkdir(exist_ok=True)

# Smallest two zips from Zenodo (no auth required, CC-BY 4.0)
DOWNLOADS = [
    {
        "name": "Electronics_2of2",
        "url":  "https://zenodo.org/api/records/4010759/files/Electronics_2of2.zip/content",
        "size_mb": 786,
    },
    {
        "name": "Days_and_Time_3of3",
        "url":  "https://zenodo.org/api/records/4010759/files/Days_and_Time_3of3.zip/content",
        "size_mb": 813,
    },
]

FRAMES_PER_VIDEO = 5   # Extract this many evenly-spaced frames per video


def download_with_progress(url: str, dest: Path, label: str):
    """Stream download with progress."""
    if dest.exists():
        print(f"  [SKIP] {dest.name} already downloaded.")
        return True
    print(f"  Downloading {label}  ({dest.name}) ...")
    try:
        with requests.get(url, stream=True, timeout=60) as r:
            r.raise_for_status()
            total = int(r.headers.get("content-length", 0))
            done  = 0
            with open(dest, "wb") as f:
                for chunk in r.iter_content(chunk_size=1024 * 1024):
                    if chunk:
                        f.write(chunk)
                        done += len(chunk)
                        if total:
                            pct = done / total * 100
                            mb  = done / 1_000_000
                            print(f"\r  {pct:5.1f}%  ({mb:.0f} MB)", end="", flush=True)
        print(f"\r  Done — {done/1_000_000:.0f} MB saved.            ")
        return True
    except Exception as e:
        print(f"\n  ERROR: {e}")
        if dest.exists():
            dest.unlink()
        return False


def extract_frames(video_path: Path, out_folder: Path, n_frames: int = 5):
    """Extract n evenly-spaced frames from a video using OpenCV."""
    try:
        import cv2
        cap = cv2.VideoCapture(str(video_path))
        total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        if total <= 0:
            cap.release()
            return 0
        indices = [int(i * total / n_frames) for i in range(n_frames)]
        saved = 0
        for idx in indices:
            cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
            ret, frame = cap.read()
            if ret:
                out_path = out_folder / f"frame_{idx:04d}.jpg"
                cv2.imwrite(str(out_path), frame)
                saved += 1
        cap.release()
        return saved
    except Exception as e:
        print(f"    Frame extraction error for {video_path.name}: {e}")
        return 0


def process_zip(zip_path: Path, category_name: str):
    """Extract zip and pull frames from every video."""
    print(f"\n  Extracting {zip_path.name}...")
    extract_dir = OUT_DIR / zip_path.stem
    extract_dir.mkdir(exist_ok=True)

    with zipfile.ZipFile(zip_path, "r") as z:
        z.extractall(extract_dir)

    # Walk extracted folders — each subfolder = one sign class
    video_exts = {".mp4", ".avi", ".mov", ".mkv"}
    signs_processed = {}

    for root, dirs, files in os.walk(extract_dir):
        for fname in files:
            if Path(fname).suffix.lower() not in video_exts:
                continue
            video_path = Path(root) / fname
            sign_name  = Path(root).name   # folder name = sign word

            frame_out = FRAMES_DIR / category_name / sign_name
            frame_out.mkdir(parents=True, exist_ok=True)

            n = extract_frames(video_path, frame_out, FRAMES_PER_VIDEO)
            signs_processed.setdefault(sign_name, 0)
            signs_processed[sign_name] += n

    return signs_processed


def main():
    print("=" * 60)
    print(" INCLUDE ISL Dataset Downloader (Zenodo — No Auth Required)")
    print("=" * 60)
    print(f" Output dir : {OUT_DIR}")
    print(f" Frames dir : {FRAMES_DIR}")
    print(f" Frames/video: {FRAMES_PER_VIDEO}")
    print()

    all_signs = {}
    for item in DOWNLOADS:
        zip_dest = OUT_DIR / f"{item['name']}.zip"
        print(f"[{item['name']}]  ~{item['size_mb']} MB")
        ok = download_with_progress(item["url"], zip_dest, item["name"])
        if not ok:
            print(f"  Skipping extraction for {item['name']}.")
            continue
        signs = process_zip(zip_dest, item["name"])
        all_signs.update(signs)
        print(f"  Signs extracted: {list(signs.keys())[:5]}{'...' if len(signs) > 5 else ''}")

    # Save class list
    manifest = {"classes": sorted(all_signs.keys()), "frame_counts": all_signs}
    manifest_path = FRAMES_DIR / "include_manifest.json"
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)

    print()
    print("=" * 60)
    print(f" Done!  {len(all_signs)} sign classes extracted.")
    print(f" Frames saved to: {FRAMES_DIR}")
    print(f" Manifest: {manifest_path}")
    print("=" * 60)


if __name__ == "__main__":
    main()
