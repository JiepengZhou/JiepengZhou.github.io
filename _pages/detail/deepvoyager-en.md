---
layout: detail
permalink: /detail/deepvoyager-en/
title: "DeepVoyager-VL - Detail"
---

# DeepVoyager-VL: Incentivizing Vision-in-the-Loop Search for Long-Horizon Multimodal Agents

---

## Overview

DeepVoyager-VL is a long-horizon multimodal deep-search framework that places visual evidence inside the search and reasoning loop. Unlike methods that use vision only at the input or answer stage, it allows intermediate visual observations to guide subsequent retrieval.

## Method

- **Multimodal event graph:** drives data synthesis and produces questions with intermediate visual dependencies and long reasoning chains.
- **Active visual acquisition:** enables the agent to seek additional visual evidence during multi-turn search.
- **On-demand image loading:** loads relevant images when needed instead of fixing all visual inputs in advance.
- **Supervised fine-tuning:** trains models on the synthesized trajectories without reinforcement learning.

## Results

Experiments across ten multimodal search benchmarks demonstrate that DeepVoyager-VL consistently improves long-horizon visual search and reasoning, showing the value of integrating vision throughout the retrieval process.
