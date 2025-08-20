# -*- coding: utf-8 -*-
"""
Custom renderers for contratacion app to handle MongoDB ObjectId
"""

from rest_framework.renderers import JSONRenderer
from bson import ObjectId
import json


class MongoJSONRenderer(JSONRenderer):
    """
    Custom JSON renderer that can handle MongoDB ObjectId serialization
    """
    
    def render(self, data, accepted_media_type=None, renderer_context=None):
        """
        Render `data` into JSON, handling ObjectId instances
        """
        if data is None:
            return bytes()
        
        # Use custom encoder that handles ObjectId
        return json.dumps(
            data,
            cls=MongoJSONEncoder,
            ensure_ascii=self.ensure_ascii,
            allow_nan=not self.strict
        ).encode('utf-8')


class MongoJSONEncoder(json.JSONEncoder):
    """
    JSON Encoder that handles MongoDB ObjectId
    """
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)