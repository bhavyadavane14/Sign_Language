import api from './api';

export interface ChatReply {
  reply: string;
  sources?: string[];
  grounded?: boolean;
}

interface HistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Knowledge Base for Indian Sign Language & SIGNX
 */
const ISL_KNOWLEDGE: Array<{ keywords: string[]; answer: string; sources: string[] }> = [
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'namaste'],
    answer: "Namaste & Hello! 🤟 I am your SIGNX AI Assistant. I can help you learn Indian Sign Language (ISL), explain our computer vision recognition pipeline, teach hand postures for the manual alphabet & numbers, or guide you on deaf accessibility in India. How can I assist you today?",
    sources: ['https://islrtc.nic.in/']
  },
  {
    keywords: ['how it works', 'how does it work', 'architecture', 'technology', 'pipeline', 'recognition work'],
    answer: "SIGNX operates on a 5-stage real-time AI pipeline:\n\n1. **Optical Capture**: Webcam captures video at 30+ FPS.\n2. **Spatial Keypoint Extraction**: Google MediaPipe Hands extracts 21 3D landmarks (x, y, z normalized coordinates) for a 63-dimensional feature vector.\n3. **Neural Classification**: A Bi-LSTM neural network maps the landmark kinematics to probability distributions across ISL classes.\n4. **Temporal Smoothing & Duplicate Suppression**: Stabilizes predictions across consecutive frames to avoid repetitive outputs.\n5. **Multilingual Synthesis**: Transcribes text and converts it to speech using localized Indian accents (en-IN, hi-IN).",
    sources: ['docs/ARCHITECTURE.md', 'https://developers.google.com/mediapipe/solutions/vision/hand_landmarker']
  },
  {
    keywords: ['classes', 'signs supported', 'alphabet', 'numbers', 'what signs', 'supported'],
    answer: "The SIGNX AI model recognizes core Indian Sign Language classes:\n\n• **26 ISL Alphabets**: Letters A through Z\n• **10 ISL Digits**: Numbers 0 through 9\n• **Interactive Gestures**: 'HELLO' (open 5-finger palm), 'OK / F' (thumb-index ring), 'I LOVE YOU' (thumb + index + pinky), 'THUMBS UP / GOOD' (upward thumb), and 'PEACE / 2 / V'.\n\nFull continuous ISL contains thousands of regional signs, which are cataloged in our 'Learn ISL' educational portal.",
    sources: ['docs/MODEL.md', 'https://islrtc.nic.in/indian-sign-language-dictionary']
  },
  {
    keywords: ['difference', 'asl', 'american', 'different from'],
    answer: "Indian Sign Language (ISL) differs fundamentally from American Sign Language (ASL):\n\n1. **Manual Alphabet**: ISL incorporates both one-handed and two-handed finger-spelling (similar in roots to British Sign Language - BSL), whereas ASL is strictly one-handed.\n2. **Grammar & Word Order**: ISL follows a Subject-Object-Verb (SOV) structure similar to spoken Indian languages like Hindi and Tamil, whereas ASL uses Topic-Comment and Subject-Verb-Object (SVO).\n3. **Cultural Context**: ISL features localized gestures for Indian cultural events, family relationships, and regional idioms recognized by ISLRTC (Indian Sign Language Research and Training Centre).",
    sources: ['https://islrtc.nic.in/about-isl']
  },
  {
    keywords: ['include', 'dataset', 'iit madras', 'corpus', 'training data'],
    answer: "The **INCLUDE dataset** (Indian Sign Language Recognition using Depth Cameras for Education) is a large-scale ISL dataset created by IIT Madras.\n\nKey facts:\n• Contains **263 ISL words** performed by **15 signers**\n• Over **4,200 video clips** recorded with depth cameras\n• Covers everyday vocabulary across multiple domains\n• Developed to support educational applications for the deaf community in India\n• Available for research purposes to advance ISL recognition technology\n\nSIGNX draws inspiration from this dataset for ISL corpus standards.",
    sources: ['https://doi.org/10.1145/3394171.3413528', 'https://islrtc.nic.in/']
  },
  {
    keywords: ['teach', 'how to sign', 'how do i sign', 'sign for'],
    answer: "Here is how to sign common gestures in the SIGNX studio:\n\n• **'HELLO / 5'**: Open your hand with all 5 fingers spread out and upright facing the camera.\n• **'A / 0'**: Curl all fingers into a closed fist with your thumb resting against the side of your index finger.\n• **'1 / D'**: Point your index finger vertically upwards while keeping other fingers tucked.\n• **'V / 2'**: Raise index and middle fingers in a V-peace formation.\n• **'I LOVE YOU'**: Extend your thumb, index, and pinky fingers while keeping middle and ring fingers curled.\n• **'OK'**: Touch the tip of your thumb and index finger together to form an O, with remaining fingers upright.",
    sources: ['https://islrtc.nic.in/learning-material']
  },
  {
    keywords: ['camera', 'not working', 'detect', 'not detecting'],
    answer: "If the camera is not detecting your hand:\n\n1. **Check Browser Permissions**: Ensure you allowed webcam access in Chrome/Edge (look for the camera icon in your address bar).\n2. **Lighting**: Ensure your hand is well-illuminated and not washed out by bright backlights.\n3. **Positioning**: Hold your hand 1.5 to 3 feet from the camera with your palm facing the lens.\n4. **Background**: Plain contrasting backgrounds give the highest landmark accuracy at 60 FPS.",
    sources: ['docs/DEPLOYMENT.md']
  },
  {
    keywords: ['islrtc', 'government', 'institute', 'training centre'],
    answer: "ISLRTC stands for the **Indian Sign Language Research and Training Centre**, an autonomous body under the Department of Empowerment of Persons with Disabilities, Ministry of Social Justice and Empowerment, Government of India. They publish the official 10,000-term ISL Dictionary and standardize sign language education nationwide.",
    sources: ['https://islrtc.nic.in/']
  },
  {
    keywords: ['two-handed', 'two handed', 'both hands', 'manual alphabet'],
    answer: "The ISL manual alphabet is **two-handed** due to its historical roots in British Sign Language (BSL), which was introduced in India during the British colonial era.\n\nKey differences from one-handed alphabets (like ASL):\n• **Base hand**: One hand acts as a static reference/base\n• **Active hand**: The other hand shapes or points to indicate specific letters\n• **More expressive**: Two-handed systems can encode more distinct handshapes with less confusion\n• **BSL lineage**: Many South Asian sign languages share this two-handed tradition\n\nISLRTC has standardized these handshapes across India's 6 regional ISL dialects.",
    sources: ['https://islrtc.nic.in/about-isl']
  },
  {
    keywords: ['mediapipe', 'landmark', 'keypoint', 'hand landmark', '21 point'],
    answer: "Google **MediaPipe Hands** is the core vision pipeline powering SIGNX gesture detection:\n\n• Detects and tracks **21 3D hand landmarks** per hand (42 total for two hands)\n• Each landmark has **x, y, z coordinates** normalized to the image size\n• Runs at **30–60 FPS** in real-time on standard webcams\n• Uses a **two-stage pipeline**: Palm detection → Hand landmark regression\n• The 21 landmarks cover: wrist (1), thumb (4), index (4), middle (4), ring (4), pinky (4)\n\nSIGNX extracts these 63-dimensional vectors (21 landmarks × 3 coordinates) and feeds them into the ISL classification model.",
    sources: ['https://developers.google.com/mediapipe/solutions/vision/hand_landmarker']
  }
];

export const chatbotService = {
  sendMessage: async (
    message: string,
    history: HistoryMessage[] = []
  ): Promise<ChatReply> => {
    // 1. First, attempt to send to the real backend API (with conversation history)
    try {
      const response = await api.post(
        '/api/chat',
        {
          message,
          history: history.map(h => ({ role: h.role, content: h.content })),
        },
        { timeout: 5000 }
      );
      if (response.data && (response.data.response || response.data.reply)) {
        return {
          reply: response.data.response || response.data.reply,
          sources: response.data.sources || [],
          grounded: response.data.grounded || false
        };
      }
    } catch (apiError) {
      // Backend not running or Gemini API key unconfigured — fall through to intelligent local engine
    }

    // 2. Intelligent Built-in ISL Knowledge Matcher (offline fallback)
    await new Promise(r => setTimeout(r, 500)); // natural typing latency
    const lower = message.toLowerCase().trim();

    for (const entry of ISL_KNOWLEDGE) {
      const matches = entry.keywords.some(keyword => lower.includes(keyword));
      if (matches) {
        return {
          reply: entry.answer,
          sources: entry.sources,
          grounded: true
        };
      }
    }

    // 3. Generic intelligent response for unmatched queries
    return {
      reply: `Thank you for asking about "${message}". In Indian Sign Language (ISL), communication blends hand shapes, spatial orientation, facial expressions, and movement.\n\nSIGNX focuses on foundational alphabet letters (A-Z) and numbers (0-9) to allow deaf and hearing users to fingerspell words and communicate in real time.\n\nWould you like me to:\n• **Teach you** how to sign a specific letter or word?\n• **Explain** how the SIGNX recognition model works?\n• **Guide you** through the ISL Learning section?`,
      sources: ['https://islrtc.nic.in/']
    };
  }
};
