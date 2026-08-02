---
layout: paper-detail
permalink: /paper-detail/bhl-en/
title: "BHL Generated Text Detection - Paper Detail"
paper_title: "BHL: A Method for Identifying Generative Long Text"
paper_mark: "BHL"
paper_short_name: "BHL Detection"
paper_authors: "<strong>Jiepeng Zhou</strong> · First Author"
paper_status: "Patent Granted"
paper_venue: "ZL202410848653.9"
paper_topics:
  - "Generated Text Detection"
  - "NLP"
  - "AI Safety"
hero_image: "/images/Papers/BHL.png"
hero_alt: "BHL hierarchy-attention architecture for generated long-text detection"
---

## Overview

BHL is a patented method for distinguishing AI-generated long-form text from human-written content. The project focuses on deep authentication in settings where local sentence-level cues are insufficient and evidence must be aggregated across a complete document.

## Motivation

Long-form generated text can maintain local fluency while exhibiting broader structural and distributional patterns. Detection therefore requires a representation that captures both fine-grained linguistic signals and document-level dependencies.

## Approach

- Encode textual units at multiple levels instead of reducing the document to isolated token statistics.
- Aggregate local and global evidence through a hierarchy-attention mechanism.
- Produce a document-level authenticity prediction from the resulting long-context representation.

The design emphasizes interpretable evidence aggregation and robustness to long inputs rather than relying on a single shallow heuristic.

## Status

The method was granted as a Chinese invention patent under **Patent No. ZL202410848653.9**.

## Conclusion

BHL provides a structured approach to generated-text authentication by combining hierarchical representations with attention-based evidence aggregation across long documents.
