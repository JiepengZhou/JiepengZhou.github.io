---
layout: detail
permalink: /detail/deltaui-en/
title: "DeltaUI - Detail"
pub_id: deltaui
lang: en
---

# DeltaUI: Framework-Normalized UI State Transition Modeling for Multi-Task Front-End Engineering

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
