from django import template

register = template.Library()

@register.filter
def rgb_to_hex(rgb):
    rgb_str = 'rgb({},{},{})'.format(rgb[0], rgb[1], rgb[2])

    def rgb_to_hex(rgb_string):
        rgb_values = rgb_string[4:-1].split(',')
        red, green, blue = int(rgb_values[0]), int(rgb_values[1]), int(rgb_values[2])

        hex_color = "#{:02x}{:02x}{:02x}".format(red, green, blue)
        return hex_color

    hex_color = rgb_to_hex(rgb_str)
    return(hex_color)