---
layout: detail
permalink: /detail/mind-zh/
title: "MIND - 面试介绍"
pub_id: mind
lang: zh
---

# MIND: From Passive Mimicry to Active Reasoning through Capability-Aware Multi-Perspective CoT Distillation

---

## 研究动机

- **单路径蒸馏的问题**：只模仿教师的一条“最优路径”，容易丢掉推理策略的多样性，OOD 泛化也比较弱。
- **现有多路径方法的问题**：通常只是对多条路径投票或加权，没有建模不同视角之间的互补关系。
- **教师和学生存在能力差距**：教师认为最好的推理，对小模型来说可能太难，反而会成为训练噪声。
- **学生能力会动态变化**：训练前期更适合简单、分步的推理，后期才能逐渐学习抽象路径，所以不能一直使用固定的蒸馏策略。

---

## 核心方法

### 1. 构建多视角推理数据

- 为同一道题设计 8 种推理视角：形式符号、直觉、分步拆解、规划、类比、苏格拉底式自问、对比和反事实。
- 教师模型分别生成 8 条 CoT，再通过 Judge Model 过滤错误答案。
- 对简单样本降采样，保留困难样本，最终得到 **497 道题，每道题包含 8 条推理路径**。

![t-SNE]({{ site.baseurl }}/images/Papers/MIND/t-SNE.png){: width="60%" }

- t-SNE 结果中，8 类视角形成了清晰的聚类。
- 说明这些视角不只是表达方式不同，模型内部的推理表征也确实存在差异。

### 2. MetaNet：判断哪些路径适合当前学生

- 输入：问题和 8 条候选推理 $r_k$。
- 输出：每条路径与学生当前能力的兼容性分数 $s_k$。
- 用多头自注意力建模不同推理视角之间的互补关系。
- 使用学生的长期损失趋势，而不是单个 batch 的瞬时 loss，避免评分频繁震荡。

![MetaNet]({{ site.baseurl }}/images/Papers/MIND/Metanet.png)

### 3. 动态训练流程

**MetaNet 更新**

- 先单独预热 MetaNet，再与学生模型同步训练。
- MetaNet 使用更小的学习率和更大的梯度累积，形成“惯性”，过滤短期训练噪声。
- 通过 ListNet-KL 目标，让 MetaNet 的评分与学生真实的路径学习难度对齐：

$$\mathcal{L}_{meta}=D_{KL}\big(\pi_\tau(s)\,\|\,\pi_\tau(-\mathcal{L}_{real})\big)$$

**动态路径筛选**

$$\mathcal{I}_{dyn}=\big\{k\mid s_k\geq\max(s)\cdot\beta\big\}$$

- 根据分数动态筛选适合当前学生的路径，并在候选子集内归一化权重。
- 学生优先学习当前阶段“学得会”的路径，能力提升后再逐渐接触更复杂的推理。

**学生模型损失**

$$\mathcal{L}_{total}=\mathcal{L}_{SFT}+\lambda\mathcal{L}_{cons}$$

- $\mathcal{L}_{SFT}$：根据兼容性分数，对不同推理路径进行加权学习。
- $\mathcal{L}_{cons}$：约束同一道题在不同推理视角下的答案分布保持一致。
- 目的：既保留多视角推理能力，又避免学到相互矛盾的逻辑。

---

## 实验设置

- **学生模型**：Qwen2.5-1.5B、Qwen2.5-7B、Llama3.1-8B。
- **ID 数据集**：MATH500、GSM8K、SVAMP。
- **OOD 数据集**：CSQA、StrategyQA、GPQA-Diamond。
- **主要对比方法**：单路径蒸馏、多路径一致性蒸馏、专家混合蒸馏和错误引导蒸馏等。

---

## 核心结果

![Main results]({{ site.baseurl }}/images/Papers/MIND/result-main.png)
![Ablation study 1]({{ site.baseurl }}/images/Papers/MIND/result-ablation-1.png)
![Ablation study 2]({{ site.baseurl }}/images/Papers/MIND/result-ablation-2.png)

- ID 数据集相比 SOTA 平均提升 **3.27%**。
- OOD 数据集平均提升 **7.53%**，说明多视角蒸馏提升了跨领域泛化能力。
- 只使用 **497 条训练样本** 就达到 SOTA，数据效率较高。
- 消融实验表明：长期反馈和 MetaNet 自注意力都很关键，分别负责稳定能力估计和建模路径互补关系。
