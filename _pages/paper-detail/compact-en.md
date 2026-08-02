---
layout: paper-detail
permalink: /paper-detail/compact-en/
title: "COMPACT - Paper Detail"
paper_title: "“The Whole Is Greater Than the Sum of Its Parts”: A Compatibility-Aware Multi-Teacher CoT Distillation Framework"
paper_mark: "CMP"
paper_short_name: "COMPACT"
paper_authors: "Jin Cui*, Jiaqi Guo*, Ruixuan Yang, Jiayi Lu, <strong>Jiepeng Zhou</strong>, Jiajun Xu, Jiangcheng Song, Boran Zhao, Pengju Ren."
paper_status: "IJCAI 2026"
paper_rank: "CCF B"
paper_url: "https://arxiv.org/abs/2601.13992"
paper_topics:
  - "Knowledge Distillation"
  - "Multi-Teacher Learning"
  - "Chain-of-Thought"
hero_image: "/images/Papers/compact.png"
hero_alt: "COMPACT compatibility-aware multi-teacher chain-of-thought distillation framework"
---

## Overview

COMPACT is a compatibility-aware multi-teacher chain-of-thought distillation framework for transferring diverse reasoning strategies into lightweight language models. Instead of treating all teacher rationales as equally useful, it models how well each source of supervision complements the student's current learning state.

## Motivation

Different teachers exhibit distinct reasoning preferences, strengths, and biases. Naively merging their outputs can introduce redundant or conflicting supervision, while selecting a single teacher discards potentially complementary reasoning paths.

COMPACT is built around the premise that the value of multi-teacher supervision depends on **compatibility**, not simply teacher scale or standalone accuracy.

## Framework

- **Diverse teacher reasoning:** multiple teachers provide complementary chain-of-thought trajectories for the same problem.
- **Compatibility-aware assessment:** the framework estimates which trajectories can be productively combined for the student.
- **Dynamic fusion:** compatible reasoning signals are aggregated while conflicting or unhelpful supervision is suppressed.
- **Student distillation:** the fused supervision encourages a compact model to internalize reasoning behavior rather than imitate surface-form outputs.

## Significance

The framework provides a structured way to exploit heterogeneous teachers under limited training data. Its central contribution is to turn multi-teacher distillation from indiscriminate aggregation into adaptive reasoning supervision.

## Conclusion

COMPACT demonstrates why the collective value of compatible teachers can exceed the contribution of any isolated source. The resulting perspective is broadly applicable to efficient reasoning-model training and multi-source knowledge transfer.
