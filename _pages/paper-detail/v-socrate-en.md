---
layout: paper-detail
permalink: /paper-detail/v-socrate-en/
title: "V-Socrate - Paper Detail"
paper_title: "V-Socrate: Socratic Multi-Agent Keyframe Selection for Long Video Understanding"
paper_mark: "V-S"
paper_short_name: "V-Socrate"
paper_authors: "<strong>Jiepeng Zhou*</strong>, Huanyao Zhang*, Jin Cui*, Shen Li, Jiaye Lin, Yongqiang Zhao, Hongzhen Huang, Linyu Li, Guang Liu."
paper_status: "arXiv Preprint"
paper_topics:
  - "Long Video Understanding"
  - "Multi-Agent"
  - "Keyframe Selection"
hero_image: "/images/Papers/V-Socrate/V-Socrate.png"
hero_alt: "V-Socrate multi-agent keyframe selection framework"
---

## Overview

V-Socrate is a training-free, duration-aware explore-then-verify framework for long-video question answering. It selects compact, question-relevant keyframes to reduce the visual-token and computational costs of processing hour-long videos.

## Method

- **Selection Agent:** explores the raw video and proposes candidate frame IDs.
- **Reflector Agent:** examines the selected frames at full resolution and either provides targeted feedback for another exploration round or confirms the final set.
- **Frozen downstream VLM:** answers the question using only the verified keyframes.

This separation between coarse exploration and full-resolution verification improves visual grounding while remaining reproducible with open-source VLMs.

## Results

- Evaluated with three open-source VLMs on LongVideoBench and Video-MME.
- With Qwen3-VL-8B, V-Socrate achieves **66.19** on LongVideoBench, exceeding the strongest frame-selection baseline by **3.21 points** while using **12.5% fewer frames** than uniform sampling.
- On Video-MME, it achieves **67.22** overall and outperforms uniform sampling by **1.33 points** across 1,800 medium- and long-video questions.
- It also outperforms existing video-agent pipelines under matched open-source backbones.
