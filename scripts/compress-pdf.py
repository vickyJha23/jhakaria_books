"""Shrink a PDF printed by Chrome: re-encode every embedded image as JPEG (Chrome stores them losslessly).
Usage: python scripts/compress-pdf.py public/jakharia-catalogue.pdf   (needs: pip install pymupdf pillow)"""
import io, os, sys
import pymupdf
from PIL import Image

path = sys.argv[1]
doc = pymupdf.open(path)
done = set()
for page in doc:
    for img in page.get_images(full=True):
        xref, smask = img[0], img[1]
        if xref in done:
            continue
        done.add(xref)
        base = pymupdf.Pixmap(doc, xref)
        if base.n - base.alpha > 3:
            base = pymupdf.Pixmap(pymupdf.csRGB, base)
        im = Image.open(io.BytesIO(base.tobytes('png'))).convert('RGB')
        if smask:  # flatten transparency onto the white page so it does not turn black
            mask = pymupdf.Pixmap(doc, smask)
            alpha = Image.open(io.BytesIO(mask.tobytes('png'))).convert('L').resize(im.size)
            im = Image.composite(im, Image.new('RGB', im.size, 'white'), alpha)
        im.thumbnail((700, 700), Image.LANCZOS)
        buf = io.BytesIO(); im.save(buf, 'JPEG', quality=82, optimize=True)
        page.replace_image(xref, stream=buf.getvalue())  # drops the soft mask: the image is now opaque
tmp = path + '.tmp'
doc.save(tmp, garbage=4, deflate=True)
doc.close()
os.replace(tmp, path)
print(f'{path}: {os.path.getsize(path) // 1024} KB')
