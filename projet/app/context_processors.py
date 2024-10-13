from django.http import HttpResponse
from .models import *

import random

def context(request):

    def themes_palettes_sample(limit=11):
        """Get a sample of theme palettes."""
        themes_palettes_sample = []
        all_themes = Theme_train.objects.all()
        
        for index, theme in enumerate(all_themes):
            if index < limit:
                new_object = {
                    'theme': theme.theme,
                    'palette': theme.theme_color.all()
                }
                themes_palettes_sample.append(new_object)

        return themes_palettes_sample

    return {
        'theme_train': Theme_train.objects.order_by('?').all(),
        'color_train': Color_train.objects.all(),
        'themes_palettes_sample': themes_palettes_sample()
    }
