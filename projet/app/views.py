from django.shortcuts import render
from django.shortcuts import redirect

from django.template.loader import render_to_string
from django.http import JsonResponse

from .models import *

# Create your views here.
from . import ia


def home(request):
    colors = [
                {'r': 141, 'g': 193, 'b': 77}, 
                {'r': 114, 'g': 154, 'b': 109}, 
                {'r': 45, 'g': 95, 'b': 63}, 
                {'r': 188, 'g': 218, 'b': 142}, 
                {'r': 135, 'g': 170, 'b': 182}
            ]

    return render(request,'app/home.html',{'colors': colors})


def get_random_theme_colors(request):
    def rgb_to_hsl(r, g, b):
        """Convert RGB to HSL color space."""
        r /= 255.0
        g /= 255.0
        b /= 255.0
        max_c = max(r, g, b)
        min_c = min(r, g, b)
        delta = max_c - min_c
        l = (max_c + min_c) / 2

        if delta == 0:
            h = s = 0
        else:
            s = delta / (1 - abs(2 * l - 1))
            if max_c == r:
                h = (g - b) / delta + (6 if g < b else 0)
            elif max_c == g:
                h = (b - r) / delta + 2
            else:
                h = (r - g) / delta + 4
            h /= 6

        return h * 360, s, l

    def hsl_to_rgb(h, s, l):
        """Convert HSL to RGB color space."""
        if s == 0:
            r = g = b = l
        else:
            def hue_to_rgb(p, q, t):
                if t < 0: t += 1
                if t > 1: t -= 1
                if t < 1 / 6: return p + (q - p) * 6 * t
                if t < 1 / 2: return q
                if t < 2 / 3: return p + (q - p) * (2 / 3 - t) * 6
                return p

            q = l * (1 + s) if l < 0.5 else l + s - l * s
            p = 2 * l - q
            r = hue_to_rgb(p, q, h / 360 + 1 / 3)
            g = hue_to_rgb(p, q, h / 360)
            b = hue_to_rgb(p, q, h / 360 - 1 / 3)

        return int(r * 255), int(g * 255), int(b * 255)

    def adjust_brightness(r, g, b, brightness_factor):
        """Adjust brightness of a color."""
        h, s, l = rgb_to_hsl(r, g, b)
        l = brightness_factor
        return hsl_to_rgb(h, s, l)

    def get_adjusted_colors(theme_colors, brightness_factor):
        """Adjust colors based on brightness factor."""
        adjusted_colors = []
        for color in theme_colors:
            adjusted_color = adjust_brightness(color.r, color.g, color.b, brightness_factor)
            adjusted_colors.append({'r': adjusted_color[0], 'g': adjusted_color[1], 'b': adjusted_color[2]})
        return adjusted_colors

    def fetch_random_theme_colors(brightness_factor=0.45):
        """Fetch random theme colors or return default colors if none exist."""
        if Theme_train.objects.exists():
            random_theme = Theme_train.objects.order_by('?').first()
            all_random_theme_colors = random_theme.theme_color.all()
            return get_adjusted_colors(all_random_theme_colors, brightness_factor)
        else:
            default_colors = [
                {'r': 141, 'g': 193, 'b': 77}, 
                {'r': 114, 'g': 154, 'b': 109}, 
                {'r': 45, 'g': 95, 'b': 63}, 
                {'r': 188, 'g': 218, 'b': 142}, 
                {'r': 135, 'g': 170, 'b': 182}
            ]
            return get_adjusted_colors(default_colors, brightness_factor)

    colors = fetch_random_theme_colors()
    return JsonResponse({'colors': colors})


def palette(request):
    action = request.GET.get('action')

    try:
        theme = request.session['theme']
    except KeyError:
        theme = ""

    try:
        palette = request.session['palette']
    except KeyError:
        palette = []


    if request.method == 'POST':
        if action == 'valider_palette':
            theme = request.POST.get('theme')
            new_theme = Theme_train(theme=theme)
            new_theme.save()

            for i in range(1, 6):
                couleurs_i = request.POST.get('couleur_' + str(i))

                if couleurs_i.startswith('#'):
                    couleurs_i = couleurs_i[1:]

                r = int(couleurs_i[0:2], 16)
                g = int(couleurs_i[2:4], 16)
                b = int(couleurs_i[4:6], 16)

                couleurs = Color_train(r=r, g=g, b=b)
                couleurs.save()

                new_theme.theme_color.add(couleurs)

            theme = ""

    return render(request, 'app/palette.html', {'theme': theme, 'palette': palette, 'number_color_inputs': len(palette)} )


def get_session_data(request):
    palette = request.session.get('palette', None)

    return JsonResponse({'palette': palette})


def ia_palette_choice(request):
    donnees_ia = ""

    try:
        theme = request.session['theme']
        number_color_inputs = len(request.session['palette'])

        donnees_ia = ia.create_colors(theme, number_color_inputs)

        request.session['palette'] = donnees_ia

    except KeyError:
        print('error data')

    return JsonResponse({'palette': donnees_ia, 'number_color_inputs': len(request.session['palette'])})



def palette_update(request, id):
    action = request.GET.get('action')
    palette = []

    if request.method == 'POST':
        if action == "update":
            r = int(request.POST.get('r'))
            g = int(request.POST.get('g'))
            b = int(request.POST.get('b'))

            request.session['palette'][id] = [r,g,b]
            palette = request.session['palette']


        if action == "add":
            request.session['palette'].append([255, 255, 255])

            number_color_inputs = len(request.session['palette'])
            html = render_to_string("app/Palette_includes/components/color_input.html",{"colour": [255, 255, 255], "forloop_counter": len(request.session['palette'])})

            request.session.modified = True
            
            return JsonResponse({'html': html, 'number_color_inputs': number_color_inputs})


        if action == "erase":
            request.session['palette'].pop(int(id)-1)

            request.session.modified = True

            palette = request.session['palette']
            palette_html = []

            for i, colour in enumerate(palette):
                html = render_to_string("app/Palette_includes/components/color_input.html",{"colour": colour, "forloop_counter": i+1})
                palette_html.append(html)

            return JsonResponse({'palette': palette_html, 'number_color_inputs': len(request.session['palette'])})
        

        request.session.modified = True

    return JsonResponse({'palette': palette, 'number_color_inputs': len(request.session['palette'])})



def theme_choice(request):
    theme = request.session['theme']

    if request.method == 'POST':
        theme = request.POST.get('theme')

        request.session['theme'] = theme

    return JsonResponse({'theme': theme})
