from app.ml.inference import inference_engine
from app.schemas.translation import FrameRequest

class TranslationService:
    def process_frame(self, request: FrameRequest):
        return inference_engine.translate_frame(request.frame)
        
    def reset_session(self):
        return inference_engine.reset_session()

translation_service = TranslationService()
