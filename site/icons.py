"""Generuje favicon.ico (32 px) i apple-touch-icon.png (180 px) — stdlib, deterministycznie."""
import struct
import zlib

BLUE = (10, 22, 31)      # petrol ink (marka „Sygnał”)
WHITE = (43, 217, 169)   # mint


def _art(size):
    """Piksele znaku: niebieskie tło, biały romb, niebieski romb wewnętrzny."""
    c = (size - 1) / 2
    r1 = size * 0.36
    r2 = size * 0.17
    rows = []
    for y in range(size):
        row = []
        for x in range(size):
            d = abs(x - c) + abs(y - c)
            row.append(WHITE if r2 < d <= r1 else BLUE)
        rows.append(row)
    return rows


def _png(size):
    rows = _art(size)
    raw = b"".join(b"\x00" + b"".join(bytes(p) for p in row) for row in rows)

    def chunk(tag, data):
        payload = tag + data
        return struct.pack(">I", len(data)) + payload + struct.pack(">I", zlib.crc32(payload) & 0xFFFFFFFF)

    ihdr = struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0)
    return (b"\x89PNG\r\n\x1a\n"
            + chunk(b"IHDR", ihdr)
            + chunk(b"IDAT", zlib.compress(raw, 9))
            + chunk(b"IEND", b""))


def _ico(size=32):
    rows = _art(size)
    xor = b"".join(
        b"".join(struct.pack("<BBBB", p[2], p[1], p[0], 255) for p in row)
        for row in reversed(rows)
    )
    and_stride = ((size + 31) // 32) * 4
    and_mask = b"\x00" * (and_stride * size)
    bih = struct.pack("<IiiHHIIiiII", 40, size, size * 2, 1, 32, 0, len(xor) + len(and_mask), 0, 0, 0, 0)
    img = bih + xor + and_mask
    header = struct.pack("<HHH", 0, 1, 1) + struct.pack("<BBBBHHII", size, size, 0, 0, 1, 32, len(img), 22)
    return header + img


def write_icons(dist):
    (dist / "favicon.ico").write_bytes(_ico(32))
    (dist / "apple-touch-icon.png").write_bytes(_png(180))
