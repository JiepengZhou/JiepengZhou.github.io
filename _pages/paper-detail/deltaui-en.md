---
layout: paper-detail
permalink: /paper-detail/deltaui-en/
title: "DeltaUI - Paper Detail"
paper_title: "DeltaUI: Framework-Normalized UI State Transition Modeling for Multi-Task Front-End Engineering"
paper_mark: "ΔUI"
paper_short_name: "DeltaUI"
paper_authors: "Jiaye Lin, Zhongxu Guan, Huanyao Zhang, Zonghao Ying, Yuehan Zhang, Bohan Zeng, <strong>Jiepeng Zhou</strong>, Peilin Zhao, Wentao Zhang"
paper_status: "ACMMM 2026"
paper_rank: "CCF A"
paper_topics:
  - "Multimodal Front-End"
  - "UI Generation"
  - "Code Agent"
hero_image: "/images/Papers/DeltaUI/DeltaUI.png"
hero_alt: "DeltaUI framework-normalized UI state transition framework"
---

## Overview

DeltaUI is a unified framework for multimodal front-end generation, editing, and repair. Instead of directly decoding framework-specific code, it models each task as a structured transition in a shared, framework-normalized UI state space.

## Key Ideas

- **Typed UI state graph:** separates shared UI semantics from framework-specific syntax.
- **Multimodal transition model:** predicts structured state operations from the source UI, screenshots, instructions, and issue descriptions.
- **Deterministic code realization:** converts the updated state into executable code for the target framework.
- **Execution-aware refinement:** uses compiler and rendering feedback to iteratively improve the result through a bounded, auditable loop.

## Results

Experiments on DesignBench and Design2Code show consistent improvements over direct code-decoding baselines across multiple MLLM backbones, together with effective transfer to real-world webpages.
