---
layout: detail
permalink: /detail/deltaui-zh/
title: "DeltaUI - 详情"
pub_id: deltaui
lang: zh
---

# DeltaUI：基于框架归一化 UI 状态转换的多任务前端工程框架

---

## 项目概述

DeltaUI 将前端生成、编辑和修复统一建模为 UI 状态转换，而不是直接生成特定框架的代码。

## 核心方法

- **UI 状态图**：将通用 UI 语义与框架相关语法分离。
- **多模态转换模型**：结合原始 UI、截图、文本指令和问题描述，预测结构化状态操作。
- **确定性代码生成**：将更新后的 UI 状态转换为目标框架代码。
- **执行反馈优化**：利用编译和渲染结果进行有限轮迭代，保证整个过程可追踪、可审计。

## 实验结果

在 DesignBench 和 Design2Code 上，DeltaUI 在多种 MLLM 骨干模型下均优于直接代码生成方法，并能有效迁移到真实网页场景。
