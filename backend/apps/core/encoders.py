# -*- coding: utf-8 -*-
"""
Encoders personalizados para manejar ObjectId de MongoDB
"""

from bson import ObjectId
from rest_framework.utils.encoders import JSONEncoder as BaseJSONEncoder


class MongoJSONEncoder(BaseJSONEncoder):
    """
    JSONEncoder personalizado que puede serializar ObjectId de MongoDB
    """
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)