---
layout: detail
permalink: /detail/mind-zh/
title: "MIND - 详细介绍"
pub_id: mind
lang: zh
---

# MIND: From Passive Minicry to Active Reasoning through Capability-Aware Multi-Perspective CoT Distillation

---

## MOTIVARION

- **单一路径监督会导致分布塌缩**：传统蒸馏采用大模型单条最优推理路径作为监督标签，但LLM本身具有多范式推理能力（比如形式符号、直觉、反事实等），让小模型强制拟合单一最优推理会迫使模型抹平多推理模式差异，丢失策略多样性，在OOD数据集上泛化表现差；
- **多路径蒸馏工作不足**：现有多路径蒸馏工作仅对多条推理做投票/打分融合，默认各个推理路径独立，忽略不同视角推理可以互补信息，无法充分利用多路径的信息增益；
- **老师与学生认知不协同**：大模型认知里的“最优推理”，对于小模型来说可能是分布外噪声，造成训练梯度震荡，产生推理幻觉；
- **学生认知是跳跃性的**：学生模型的学习能力在过程中是持续进化的，前期可能偏好分步直白推导，但后期能够接受跳跃式抽象推理。传统的一刀切会导致训练低效，灾难性遗忘严重。

---

## METHODOLOGY

### 1. 多视角高质量数据集构建

用8种推理范式，设计专属prompt，让教师模型对同一个问题用8种prompt生成8条不同的推理路径和答案。引入Judge Model，剔除答案错误的推理，降采样低难度样本，全保留高难度题目，最终筛选出仅497条训练样本，每条样本搭配8个CoT推理路径。

| 推理视角 | 描述 |
|-------|------|
| `Formal Symbolic(形式符号)` | 全符号化，严格形式推导，禁用直觉跳跃 |
| `Intuitive(直觉)` | 生活化启发、经验类比、弱化公式符号 |
| `Decomposition(分步拆解)` | 拆分子问题，编号分步求解|
| `Planning(规划式)` | 先顶层解题方案，再分步落地执行 |
| `Analogy(类比)` | 借用简单相似案例映射原题求解 |
| `Socratic(苏格拉底自问)` | 自问自答逐步推导 |
| `Contrastive(对比)` | 多候选方案对比淘汰，锁定最优解 |
| `Counterfactual(反事实)` | 修改条件反推结果，定位关键约束 |

![t-SNE]({{ site.baseurl }}/images/Papers/MIND/t-SNE.png)

从t-SNE结果表明，8类视角在隐空间形成了边界清晰，互不重叠的聚类簇，8类推理不是文本措辞差异，而是模型内部完全不同的激活表征：
- 在正式蒸馏前，先用8类推理训练8个专用小模型，每个仅用单视角数据进行蒸馏
- 用Sentence-Bert+DPMM狄利克雷过程混合模型提取每个模型最后一层的隐向量，用t-SNE降维可视化。

### 2. METANET构建
- 这一模块的输入为问题 + 8条候选推理${r\_k}$，输出为每条推理和当前学生能力的兼容性得分${s\_k}$。
- 用多头自注意力机制聚合全部8个视角特征，建模不同推理路径之间互补、协同的关系，进而解决传统方法忽略路径协同的问题
- 先过滤单步训练瞬时损失噪声，累积记录学生长期推理偏好，用k个mlp头来打分，并生成对应的分数矩阵，规避单次loss突变带来的权重震荡。

![metanet]({{ site.baseurl }}/images/Papers/MIND/Metanet.png)

### 3. 训练流程
（1）Feedback-Driven Inertia Calibration：反馈驱动惯性校准（MetaNet 更新）
核心：摒弃单步瞬时损失，依托学生长期损失表征推理可学性，实现 MetaNet 打分动态贴合学生实时能力。

分阶段训练策略

前期：少量 Epoch 完成 MetaNet 预热；
后期：MetaNet 与学生模型同步迭代，MetaNet 设置更小学习率、更大梯度累积，构造优化滞后惯性，过滤单批次训练随机噪声。

ListNet-KL 排序损失约束
\(\mathcal{L}_{meta}=D_{KL}\big (\pi _{\tau }(s)\, \| \, \pi _{\tau }(-\mathcal{L}_{real})\big )\)

\(\mathcal{L}_{real}\)：学生在单条推理\(r_k\)上的交叉熵损失；损失越高→该推理和学生当前能力越不匹配；
\(\pi_\tau(\cdot)\)：带温度系数\(\tau\)的 Softmax 概率分布；
优化目标：缩小 MetaNet 预测得分分布\(\pi_\tau(s)\)与真实难度分布\(\pi_\tau(-\mathcal{L}_{real})\)的 KL 散度，让打分匹配真实学习难度。


（2）基于兼容性得分动态筛选有效推理子集依据 MetaNet 输出兼容性分数\(s_k\)，筛选高适配推理、丢弃噪声路径。
动态候选集筛选公式
\(\mathcal{I}_{dyn}=\big\{ k\mid s_{k}\geq \max(s)*\beta \big\}\)
\(\beta\)为超参数阈值，仅保留得分≥最高分 ×β 的推理，剔除不兼容样本。
子集内权重归一化
\(\alpha _{k}=\frac {\exp \left( s_{k}/\tau _{student }\right) }{\sum_{j\in \mathcal{I}_{dyn}}\exp \left( s_{j}/\tau _{student }\right) }, \forall k\in \mathcal{I}_{dyn}\)
仅在筛选后的集合\(\mathcal{I}_{dyn}\)中计算每条推理的融合权重\(\alpha_k\)。
（3）学生总损失：\(\boldsymbol{\mathcal{L}_{total}=\mathcal{L}_{SFT}+\lambda \mathcal{L}_{cons}}\)损失由加权监督微调损失+一致性正则损失加权组成，\(\lambda\)为正则项权重系数。① 偏好加权 SFT 损失 \(\mathcal{L}_{SFT}\)\(\mathcal{L}_{S F T}=\sum_{k \in \mathcal{I}_{d y n}} \alpha_{k} \cdot \mathcal{L}_{C E}\left(r_{k} | x ; \theta\right)\)
使用动态适配权重\(\alpha_k\)加权交叉熵；
引导模型优先学习与自身能力匹配度更高的推理路径。
② 成对一致性正则损失 \(\mathcal{L}_{cons}\)\(\mathcal{L}_{cons}=\sum_{\substack{i, j \in \mathcal{I}_{dyn} \\ i<j}}\left(\alpha_{i} \cdot \alpha_{j}\right) \cdot JSD\left(P_{i} \| P_{j}\right)\)
\(P_i,P_j\)：同问题下两条不同推理对应的答案概率分布；
JSD：JS 散度，衡量分布差异；
作用：约束多视角推理答案分布趋于一致，避免模型学到互相矛盾的推理逻辑，防止推理表征碎片化。


### 4. 对比
- 学生模型：Qwen2.5-1.5B、Qwen2.5-7B、Llama3.1-8B
- 数据集：
-- ID（数学推理）：MATH500、GSM8K、SVAMP（同分布数学题）
-- OOD（跨域泛化）：CSQA 常识 QA、StrategyQA 隐式多步推理、GPQA-Diamond（硕博级理化生难题，高难度域外）
- baseline：原生零样本 CoT、SbS-KD（标准单路径蒸馏）、MCC-KD（多路径一致性蒸馏）、MoDE-CoTD（专家混合蒸馏）、EDIT（错误引导蒸馏）、消融变体 Ours w/o fusion（无动态融合）。

---

## RESULT

![main]({{ site.baseurl }}/images/Papers/MIND/result-main.png)
![ablation-1]({{ site.baseurl }}/images/Papers/MIND/result-ablation-1.png)
![ablatioin-2]({{ site.baseurl }}/images/Papers/MIND/result-ablation-2.png)

- MIND 多推理路径蒸馏使得小模型效果更加逼近大尺寸基座，相较SOTA ID平均 **+ 3.27%**
- 传统多路径蒸馏在OOD数据集上普遍性能下降，但MIND在OOD数据集平均提升 **+ 7.53%**
- MIND仅用497条样本就实现SOTA，动态自适应机制抵消多视角与MetaNet的少量计算开销，整体训练效率优于基线
- 消融实验也表明，用瞬时损失来加权/移除metanet的自注意力层会导致模型性能大幅下降，无法挖掘路径互补关系。