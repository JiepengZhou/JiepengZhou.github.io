---
layout: paper-detail
permalink: /paper-detail/grading-en/
title: "BiLSTM Grading Model - Paper Detail"
paper_title: "Automated Grading with BiLSTM and Manually Designed Features"
paper_mark: "GRD"
paper_short_name: "BiLSTM Grading"
paper_status: "Research Project"
paper_topics:
  - "Automated Grading"
  - "BiLSTM"
  - "Feature Engineering"
hero_image: "/images/Papers/Gradingmodel.png"
hero_alt: "BiLSTM automated grading model with manually designed features"
---

## Overview

This project explores an automated grading model that combines bidirectional sequence modeling with manually designed features. The goal is to use learned textual representations and explicit task-relevant signals within one prediction pipeline.

## Motivation

Pure feature engineering can miss contextual dependencies, while an end-to-end neural model may overlook useful domain knowledge. A hybrid design provides both sequence-aware representations and controllable auxiliary evidence.

## Architecture

- A **BiLSTM encoder** captures contextual information in both forward and backward directions.
- **Manually designed features** represent complementary lexical or task-specific grading cues.
- A **fusion layer** combines neural and explicit representations before producing the final score or category.

## Practical Value

The architecture offers a reusable baseline for grading tasks with limited labeled data, where incorporating prior knowledge can be as important as increasing model complexity.

## Conclusion

The project demonstrates a straightforward way to combine contextual sequence learning with interpretable feature extraction for automated assessment.
