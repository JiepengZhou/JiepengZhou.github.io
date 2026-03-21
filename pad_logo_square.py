#!/usr/bin/env python3
"""
将非正方形 logo 补成正方形（居中），便于教育/实习等圆形头像区域显示。

依赖: pip install Pillow

示例:
    cd JiepengZhou.github.io
    pip install Pillow
    # 透明填充，输出 hkust_square.png
    python pad_logo_square.py images/logos/hkust.png
    # 指定输出目录（文件名自动生成 hkust_square.png）
    python pad_logo_square.py images/logos/hkust.png -o images/logos
    # 指定完整输出文件路径
    python pad_logo_square.py images/logos/hkust.png -o images/logos/hkust_square.png
    # 与 logo 黑底一致（不透明）
    python pad_logo_square.py images/logos/hkust.png --bg "#000000" -o images/logos/hkust_square.png
    # 固定边长 512（内容不放大，只加边）
    python pad_logo_square.py images/logos/hkust.png --size 512 -o images/logos/hkust_square.png

"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("请先安装 Pillow: pip install Pillow", file=sys.stderr)
    sys.exit(1)


def parse_color(s: str) -> tuple[int, int, int, int]:
    s = s.strip()
    if s.lower() in ("transparent", "none", "alpha"):
        return (0, 0, 0, 0)
    if s.startswith("#") and len(s) == 7:
        r = int(s[1:3], 16)
        g = int(s[3:5], 16)
        b = int(s[5:7], 16)
        return (r, g, b, 255)
    raise ValueError(f"无法解析颜色: {s}，使用 #RRGGBB 或 transparent")


def pad_to_square(
    im: Image.Image,
    *,
    side: int | None = None,
    bg_rgba: tuple[int, int, int, int] = (0, 0, 0, 0),
) -> Image.Image:
    w, h = im.size
    if side is None:
        side = max(w, h)
    if side < max(w, h):
        raise ValueError(f"目标边长 {side} 小于原图 max({w},{h})，会裁切，请调大 --size 或不指定")

    out = Image.new("RGBA", (side, side), bg_rgba)
    if im.mode != "RGBA":
        im = im.convert("RGBA")
    x = (side - w) // 2
    y = (side - h) // 2
    out.paste(im, (x, y), im)
    return out


def _default_ext(inp: Path, jpeg: bool) -> str:
    if jpeg:
        return ".jpg"
    s = inp.suffix.lower()
    if s in (".png", ".jpeg", ".jpg", ".webp", ".gif"):
        return s
    return ".png"


_IMAGE_SUFFIX = frozenset({".png", ".jpeg", ".jpg", ".webp", ".gif"})

# 脚本所在仓库根目录下的默认输出目录（未指定 -o 时使用）
_REPO_ROOT = Path(__file__).resolve().parent
_DEFAULT_OUT_DIR = _REPO_ROOT / "images" / "logos"


def resolve_output_path(
    inp: Path,
    out: Path | None,
    *,
    jpeg: bool,
) -> Path:
    """out 为 None → 默认目录 _DEFAULT_OUT_DIR；为目录 → 其下 <原名>_square.ext；为带图片后缀的路径 → 当作文件。"""
    stem_sq = inp.stem + "_processed"
    ext = _default_ext(inp, jpeg)

    if out is None:
        return _DEFAULT_OUT_DIR / (stem_sq + ext)

    out = out.expanduser().resolve()
    if out.suffix.lower() in _IMAGE_SUFFIX:
        return out
    # 视为目录（含不存在但意图为目录的路径，如 images/logos）
    return out / (stem_sq + ext)


def main() -> None:
    p = argparse.ArgumentParser(description="将 logo 补成正方形（居中填充）")
    p.add_argument("input", type=Path, help="输入图片路径，如 images/logos/hkust.png")
    p.add_argument(
        "-o",
        "--output",
        type=Path,
        default=None,
        help="输出：若给文件路径（含 .png 等后缀）则写入该文件；若给目录则写入该目录下的 <原名>_square.png。默认目录为仓库内 images/logos/",
    )
    p.add_argument(
        "--size",
        type=int,
        default=None,
        metavar="PX",
        help="正方形边长（像素）；默认取宽高中较大者，不放大原图内容",
    )
    p.add_argument(
        "--bg",
        default="transparent",
        help='填充色: transparent 或 #RRGGBB，如 #000000 与 HKUST 黑底一致',
    )
    p.add_argument(
        "--jpeg",
        action="store_true",
        help="输出为 JPEG（无透明通道，透明区域会变成 --bg 或白色）",
    )
    args = p.parse_args()

    inp = args.input.resolve()
    if not inp.is_file():
        print(f"找不到文件: {inp}", file=sys.stderr)
        sys.exit(1)

    bg = parse_color(args.bg)
    if args.jpeg and bg[3] == 0:
        bg = (255, 255, 255, 255)

    im = Image.open(inp)
    square = pad_to_square(im, side=args.size, bg_rgba=bg)

    out_path = resolve_output_path(inp, args.output, jpeg=args.jpeg)
    if not out_path.suffix:
        out_path = out_path.with_suffix(".jpg" if args.jpeg else ".png")

    out_path.parent.mkdir(parents=True, exist_ok=True)

    if args.jpeg:
        rgb = Image.new("RGB", square.size, bg[:3] if bg[3] else (255, 255, 255))
        rgb.paste(square, mask=square.split()[3] if square.mode == "RGBA" else None)
        rgb.save(out_path, quality=95)
    else:
        fmt = out_path.suffix.lstrip(".").upper() or "PNG"
        if fmt == "JPG":
            fmt = "JPEG"
        square.save(out_path, format=fmt)

    print(f"已保存: {out_path} ({square.size[0]}×{square.size[1]})")


if __name__ == "__main__":
    main()
