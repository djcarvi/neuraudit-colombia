"""
Renderers personalizados para manejar ObjectId de MongoDB
"""
import json
from bson import ObjectId
from rest_framework.renderers import JSONRenderer
from datetime import date, datetime
from decimal import Decimal


class MongoJSONRenderer(JSONRenderer):
    """
    Renderer personalizado que maneja la serialización de ObjectId de MongoDB
    """
    def render(self, data, accepted_media_type=None, renderer_context=None):
        """
        Renderiza la data a JSON manejando ObjectId
        """
        return json.dumps(
            data,
            cls=MongoJSONEncoder,
            ensure_ascii=False,
            indent=2 if renderer_context and renderer_context.get('indent') else None
        ).encode('utf-8')


class MongoJSONEncoder(json.JSONEncoder):
    """
    JSONEncoder personalizado que sabe cómo serializar ObjectId, dates y decimals
    """
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        elif isinstance(obj, datetime):
            return obj.isoformat()
        elif isinstance(obj, date):
            return obj.isoformat()
        elif isinstance(obj, Decimal):
            return float(obj)
        return super().default(obj)