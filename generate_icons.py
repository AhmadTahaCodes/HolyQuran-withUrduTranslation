import math
from PIL import Image, ImageDraw

def draw_quran_icon(size):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Background squircle / rounded rect for maskable & standard icon
    pad = int(size * 0.04)
    radius = int(size * 0.22)
    draw.rounded_rectangle([pad, pad, size - pad, size - pad], radius=radius, fill=(9, 29, 23, 255))
    
    # Decorative inner border (emerald + gold)
    inner_pad = int(size * 0.08)
    draw.rounded_rectangle([inner_pad, inner_pad, size - inner_pad, size - inner_pad], radius=int(radius * 0.8), outline=(217, 119, 6, 220), width=max(2, int(size * 0.015)))
    
    center = size / 2
    r_outer = size * 0.36
    
    # Draw Islamic 8-point geometric star rosette
    for i in range(8):
        angle1 = i * (math.pi / 4)
        angle2 = (i + 1) * (math.pi / 4)
        mid_angle = angle1 + (math.pi / 8)
        
        p1 = (center + r_outer * math.cos(angle1), center + r_outer * math.sin(angle1))
        p_mid = (center + (r_outer * 0.75) * math.cos(mid_angle), center + (r_outer * 0.75) * math.sin(mid_angle))
        draw.line([p1, p_mid], fill=(16, 185, 129, 120), width=max(1, int(size * 0.008)))

    # Central golden circular shield
    shield_r = size * 0.26
    draw.ellipse([center - shield_r, center - shield_r, center + shield_r, center + shield_r], fill=(6, 78, 59, 255), outline=(245, 158, 11, 255), width=max(2, int(size * 0.02)))
    
    # Open Quran Book motif in center
    book_w = size * 0.24
    book_h = size * 0.18
    by = center + size * 0.02
    
    # Book stand / Rehal (X shaped base)
    stand_w = size * 0.16
    stand_y = by + book_h * 0.6
    draw.polygon([
        (center - stand_w, stand_y + size * 0.05),
        (center, stand_y),
        (center + stand_w, stand_y + size * 0.05),
        (center + stand_w * 0.8, stand_y + size * 0.07),
        (center, stand_y + size * 0.02),
        (center - stand_w * 0.8, stand_y + size * 0.07)
    ], fill=(217, 119, 6, 255))
    
    # Left Page
    draw.polygon([
        (center, by - book_h * 0.5),
        (center - book_w, by - book_h * 0.35),
        (center - book_w * 0.95, by + book_h * 0.4),
        (center, by + book_h * 0.5)
    ], fill=(254, 249, 195, 255), outline=(217, 119, 6, 255), width=max(1, int(size * 0.01)))
    
    # Right Page
    draw.polygon([
        (center, by - book_h * 0.5),
        (center + book_w, by - book_h * 0.35),
        (center + book_w * 0.95, by + book_h * 0.4),
        (center, by + book_h * 0.5)
    ], fill=(255, 251, 235, 255), outline=(217, 119, 6, 255), width=max(1, int(size * 0.01)))
    
    # Page text lines (subtle gold stripes on pages)
    line_w = max(1, int(size * 0.008))
    for row in [-0.15, 0.0, 0.15]:
        # Left lines
        draw.line([
            (center - book_w * 0.8, by + book_h * row),
            (center - book_w * 0.2, by + book_h * row)
        ], fill=(180, 130, 20, 180), width=line_w)
        # Right lines
        draw.line([
            (center + book_w * 0.2, by + book_h * row),
            (center + book_w * 0.8, by + book_h * row)
        ], fill=(180, 130, 20, 180), width=line_w)

    # Central spine bookmark ribbon
    draw.polygon([
        (center - size * 0.015, by - book_h * 0.5),
        (center + size * 0.015, by - book_h * 0.5),
        (center + size * 0.015, by + book_h * 0.65),
        (center, by + book_h * 0.55),
        (center - size * 0.015, by + book_h * 0.65)
    ], fill=(225, 29, 72, 255))
    
    # Crescent and Star above book
    c_x = center
    c_y = by - book_h * 0.65
    cr_r = size * 0.055
    draw.ellipse([c_x - cr_r, c_y - cr_r, c_x + cr_r, c_y + cr_r], fill=(251, 191, 36, 255))
    draw.ellipse([c_x - cr_r * 0.6, c_y - cr_r * 1.1, c_x + cr_r * 1.2, c_y + cr_r * 0.7], fill=(6, 78, 59, 255))
    
    return img

if __name__ == "__main__":
    icon_512 = draw_quran_icon(512)
    icon_512.save("public/pwa-512x512.png", "PNG", optimize=True)
    print("Created public/pwa-512x512.png")
    
    icon_192 = draw_quran_icon(192)
    icon_192.save("public/pwa-192x192.png", "PNG", optimize=True)
    print("Created public/pwa-192x192.png")
    
    icon_180 = draw_quran_icon(180)
    icon_180.save("public/apple-touch-icon.png", "PNG", optimize=True)
    print("Created public/apple-touch-icon.png")

    icon_64 = draw_quran_icon(64)
    icon_64.save("public/favicon.ico", format="ICO", sizes=[(64, 64), (32, 32), (16, 16)])
    print("Created public/favicon.ico")
