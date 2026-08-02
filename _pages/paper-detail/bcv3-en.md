---
layout: paper-detail
permalink: /paper-detail/bcv3-en/
title: "BrowseComp-V3 - Paper Detail"
paper_title: "BrowseComp-V<sup>3</sup>: A Visual, Vertical, and Verifiable Benchmark for Multimodal Browsing Agents"
paper_mark: "V³"
paper_short_name: "BrowseComp-V³"
paper_authors: "Huanyao Zhang, <strong>Jiepeng Zhou</strong>, Bo Li, Bowen Zhou, Yanzhe Shan, Zhiyong Cao, Jiaoyang Chen, Yuqian Han, Zinan Sheng, Zhengwei Tao, Hao Liang, Jialong Wu, Yang Shi, Yuanpeng He, Jiaye Lin, Qintong Zhang, Guochen Yan, Runhao Zhao, Zhengpin Li, Xiaohan Yu, Lang Mei, Chong Chen, Wentao Zhang, Bin CUI."
paper_status: "arXiv Preprint"
paper_venue: "2026"
paper_url: "https://arxiv.org/abs/2602.12876"
paper_topics:
  - "Search Agent"
  - "Multimodal Browsing"
  - "Benchmark"
hero_image: "/images/Papers/BCV3/BCV3.png"
hero_alt: "BrowseComp-V3 benchmark construction and evaluation framework"
---

## Overview

BrowseComp-V<sup>3</sup> is a visual web-browsing benchmark designed to evaluate whether multimodal agents can search, inspect, connect, and verify information distributed across webpages and images.

> **At a glance:** 300 expert-verified tasks spanning five vertical domains, three search-depth levels, and three levels of visual interaction complexity.

Unlike conventional retrieval benchmarks, each task requires an agent to construct a traceable evidence chain rather than produce an answer from a single page.

## Motivation

Existing search-agent benchmarks leave three important capabilities underexplored:

- **Multi-hop browsing:** real questions often require evidence aggregation across several webpages rather than single-turn retrieval.
- **Visual evidence grounding:** decisive information may be embedded in charts, screenshots, maps, or localized image regions.
- **Objective verification:** an answer should be supported by reproducible evidence and a clearly defined reasoning path.

BrowseComp-V<sup>3</sup> combines these requirements in one benchmark so that evaluation reflects the complete browsing process, not only the final response.

<figure class="paper-figure">
  <img src="{{ site.baseurl }}/images/Papers/BCV3/bcv3_table_1.png" alt="Comparison between BrowseComp-V3 and existing browsing benchmarks">
  <figcaption>Comparison with existing browsing benchmarks across visual, vertical, and verifiable evaluation dimensions.</figcaption>
</figure>

## Benchmark Design

### Expert-Guided Construction

Domain experts begin with visual and textual exemplars, design multi-hop questions, and specify the expected answer, sub-goals, evidence sources, and required tools. Human annotators then execute the task and record a structured trajectory.

Every sample passes multiple quality-control stages:

1. cross-checking by independent annotators;
2. temporal-stability validation;
3. answer-uniqueness checks;
4. sub-goal and dependency validation;
5. evidence-traceability review.

### Dataset Structure

The benchmark contains **300 high-quality samples** across five vertical domains. Difficulty is jointly determined by search depth and visual interaction complexity.

| Visual level | Required capability |
|---|---|
| **Level I** | Locate and extract information from one image. |
| **Level II** | Inspect multiple regions of the same image and connect their evidence. |
| **Level III** | Aggregate evidence across multiple images and webpages. |

Each released item retains its question, visual inputs, answer, sub-goal graph, supporting evidence, tool requirements, and metadata. This structure makes both the answer and the path leading to it auditable.

<figure class="paper-figure">
  <img src="{{ site.baseurl }}/images/Papers/BCV3/bcv3_table_2.png" alt="BrowseComp-V3 dataset statistics">
  <figcaption>Dataset composition across domains, difficulty levels, and visual interaction levels.</figcaption>
</figure>

### Case Study

<div class="paper-case">
  <p class="paper-case__label">EXAMPLE TASK · SCIENCE / BIOLOGY · LEVEL III</p>
  <p class="paper-case__question"><strong>Question.</strong> The country where Figure 1 is located is home to many renowned universities, one of which is situated at the place shown in Figure 2. This university once received a note with printed information attached. On the day when the country of the small island associated with this information was admitted to the United Nations General Assembly, what was the family appellation of the first representative who signed the document?</p>

  <div class="paper-gallery" role="region" aria-label="Visual inputs for the example task">
    <figure>
      <img src="{{ site.baseurl }}/images/Papers/BCV3/007_Science_Biology_1.jpg" alt="Oxford Street, the first visual input in the example task">
      <figcaption>Figure 1 · Oxford Street</figcaption>
    </figure>
    <figure>
      <img src="{{ site.baseurl }}/images/Papers/BCV3/007_Science_Biology_2.jpg" alt="Parker's Piece, the second visual input in the example task">
      <figcaption>Figure 2 · Parker's Piece</figcaption>
    </figure>
  </div>

  <details class="paper-case__details">
    <summary>View the verified reasoning path</summary>
    <ol>
      <li>Localize Figure 1 to Oxford Street in the United Kingdom.</li>
      <li>Identify Figure 2 as Parker's Piece and connect it to the University of Cambridge.</li>
      <li>Trace the printed note to the missing Darwin notebooks and the message “Librarian, Happy Easter X.”</li>
      <li>Resolve Easter Island to Chile and follow the date dependency to the relevant signed document.</li>
      <li>Identify Dong Biwu and retrieve the requested family appellation.</li>
    </ol>
  </details>

  <p class="paper-case__answer"><span>Verified answer</span><strong>landless gentry</strong></p>
</div>

### Searchable and Verifiable by Design

The benchmark separates successful browsing into explicit sub-goals. Each sub-goal records its dependencies and supporting source, allowing evaluators to identify where an agent succeeds or fails.

This design supports analysis beyond exact-match accuracy, including search efficiency, evidence quality, visual grounding, and trajectory completeness.

## Agent Evaluation Framework

We build an end-to-end evaluation framework around five browsing tools:

| Tool | Function |
|---|---|
| `TextSearch` | Retrieve information through textual queries. |
| `ImageSearch` | Search for relevant web images. |
| `ReverseImageSearch` | Identify the source or context of a given image. |
| `CropImage` | Isolate regions for fine-grained visual inspection. |
| `WebVisit` | Open webpages and extract supporting content. |

The framework integrates retrieval and webpage access through MCP services. A structured execution protocol records every tool call, while hash-based caching reduces repeated API requests and improves reproducibility.

### Evaluation Protocol

Agents must gather evidence, resolve the dependency graph, and return a verifiable final answer within a bounded interaction budget. Controlled reminders near the end of the budget encourage answer consolidation without altering the underlying evidence requirements.

## Key Findings

### Model Evaluation

Experiments reveal a persistent gap between general multimodal perception and complete visual browsing. Even strong models may retrieve a relevant page yet fail to locate, download, or interpret the decisive image.

The main observations are:

- stronger search models do not necessarily provide stronger visual evidence localization;
- instruction-following errors can invalidate otherwise successful tool trajectories;
- tool-augmented agents consistently outperform models relying only on native browsing or visual capabilities;
- increasing effective search rounds and Pass@K improves benchmark performance.

<div class="paper-gallery" role="region" aria-label="BrowseComp-V3 evaluation results">
  <figure>
    <img src="{{ site.baseurl }}/images/Papers/BCV3/bcv3_table_3.png" alt="Main model evaluation results on BrowseComp-V3">
    <figcaption>Main evaluation results across the tested multimodal models.</figcaption>
  </figure>
  <figure>
    <img src="{{ site.baseurl }}/images/Papers/BCV3/bac3_figure_4.png" alt="Pass at K and search-round ablation results">
    <figcaption>Effects of Pass@K and the number of search rounds.</figcaption>
  </figure>
</div>

### What the Benchmark Measures

Performance gains from additional search attempts support the benchmark's central premise: difficult samples remain searchable, while their structured evidence chains keep answers verifiable.

The benchmark therefore distinguishes agents that merely generate plausible answers from those that reliably discover and validate the required information.

## Error Analysis

Across evaluated models, the dominant source of failure is **visual information localization**, followed by errors in fine-grained image perception. These failures commonly occur in one of three places:

1. selecting the correct image from a webpage;
2. identifying the relevant region within that image;
3. connecting the extracted visual evidence to later textual search steps.

<figure class="paper-figure">
  <img src="{{ site.baseurl }}/images/Papers/BCV3/bcv3_figure_5.png" alt="Error attribution analysis across evaluated models">
  <figcaption>Error attribution highlights visual localization and perception as the dominant failure sources.</figcaption>
</figure>

Because each task includes an explicit sub-goal graph, these errors can be attributed to individual stages instead of being collapsed into a single incorrect final answer.

## Conclusion

BrowseComp-V<sup>3</sup> provides a challenging and auditable evaluation setting for multimodal browsing agents. Its main contributions are:

- a carefully verified benchmark covering cross-page, multi-hop, and visual search;
- a reproducible agent framework with five complementary browsing tools;
- structured trajectories that expose both final-answer quality and intermediate failure modes.

The benchmark is intended to support progress toward agents that can not only browse the web, but also ground their conclusions in complete and verifiable evidence.
