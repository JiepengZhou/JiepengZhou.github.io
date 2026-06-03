---
layout: detail
permalink: /detail/bcv3-zh/
title: "BrowseComp-V3 - 详细介绍"
pub_id: bcv3
lang: zh
---

# BrowseComp-V<sup>3</sup>: A Visual, Vertical, and Verifiable Benchmark for Multimodal Browsing Agents

---

##  MOTIVATION

搜索 Agent 数据集存在以下不足：

- **任务过于简单**：大多数 benchmark 仅搜索一轮或者检索一个页面就可以得到答案，对模型**多跳搜索并在不同页面之间进行信息整合**的考察较少；
- **忽视视觉信息**：问题大多落在网页上的文字信息，而网页中图片所承载的细粒度信息（如图表数据、嵌入式文字等）几乎未被纳入评测范围；
- **多模态难度较简单**：对图片的检索问题，大多只需要检索一次图片，没有考察模型在多个图片之间寻找关系或在单个图片不同位置综合解题的能力；
- **可验证性不足**：数据集缺乏客观、可量化的答案验证trajectory，意味着人工无法验证模型的检索路径是否正确。

![现有数据集对比]({{ site.baseurl }}/images/Papers/BCV3/bcv3_table_1.png)

多模态 Agent 框架存在以下不足：

- **工具强度不够**： 目前多数框架的工具较多但实际搜索过程中调用的次数较少，意味着工具实际无效，但对模型又有干扰作用；
- **工具实现细节**： 我们测试了如 *图片反搜是否将图拼接会上下文* *图搜和文搜做summary机制* *设计即阅即焚避免上下文长度过长*等机制；
- **可泛化性**： 在不同的模型上、不同的数据集上，框架都应该相比原模型带来性能提升，但现有框架多数只对某个数据集有效。

---

## METHODOLOGY

### 2.1 数据集构建

![数据集构建流程图]({{ site.baseurl }}/images/Papers/BCV3.png)

### 2.2 数据集分布

最终构建了 **300 条高质量样本**，具备以下特征：

- 覆盖 **5 个领域**；
- 按搜索深度/搜索跳数分为 **3 个难度等级**（Easy / Medium / Hard）；
- 按视觉交互信息划分为 **3 个等级**：

| Level | 描述 |
|-------|------|
| `Level I` | 模型需要对整张图进行搜索，得到关于这张图的信息才能解决问题 |
| `Level II` | 模型需要一次性看一张图的多个位置，或者多次看一张图的多个位置，得到相连的信息才能解决问题 |
| `Level III` | 模型需要一次性看多张图，从多张图之间统计信息，才能解决问题 |

![数据集统计]({{ site.baseurl }}/images/Papers/BCV3/bcv3_table_2.png)

### 2.3 数据样本示例

![Sample_1]({{ site.baseurl }}/images/Papers/BCV3/007_Science_Biology_1.jpg)
![Sample_2]({{ site.baseurl }}/images/Papers/BCV3/007_Science_Biology_2.jpg)

<details class="code-fold">
<summary>Example Sample (JSON)</summary>
<pre><code class="language-json">{% raw %}
{
  "id": "007_Science_Biology_L3_p2_t8_m0_r2_w1_c0_g10",
  "question": "The country where Figure 1 is located is home to many renowned universities, one of which is situated at the place shown in Figure 2. This university once received a note with printed information attached. On the day when the country of the small island associated with this information was admitted to the United Nations General Assembly, what was the family appellation of the first representative who signed the document?",
  "images": [
    "images/007_Science_Biology_1.jpg",
    "images/007_Science_Biology_2.jpg"
  ],
  "answer": "landless gentry",
  "sub_goals": [
    {
      "sg_id": 1,
      "description": "Determine the country where the image images/007_Science_Biology_1.jpg is located.",
      "key_info": "Oxford Street, English.",
      "ability": [
        "ReverseImageSearch"
      ],
      "dependence": []
    },
    {
      "sg_id": 2,
      "description": "Determine the location of image images/007_Science_Biology_2.jpg",
      "key_info": "Parker's Piece",
      "ability": [
        "ReverseImageSearch"
      ],
      "dependence": []
    },
    {
      "sg_id": 3,
      "description": "Find the university located at Parker's Piece.",
      "key_info": "University of Cambridge",
      "ability": [
        "TextSearch"
      ],
      "dependence": [
        1,
        2
      ]
    },
    {
      "sg_id": 4,
      "description": "Find the note with a printed message received by the University of Cambridge.",
      "key_info": "missing Darwin notebooks",
      "ability": [
        "TextSearch"
      ],
      "dependence": [
        3
      ]
    },
    {
      "sg_id": 5,
      "description": "Find the printed message on the note.",
      "key_info": "Librarian, Happy Easter X",
      "ability": [
        "TextSearch"
      ],
      "dependence": [
        4
      ]
    },
    {
      "sg_id": 6,
      "description": "Identify the island associated with the message 'Happy Easter X'.",
      "key_info": "Easter Island",
      "ability": [
        "TextSearch"
      ],
      "dependence": [
        5
      ]
    },
    {
      "sg_id": 7,
      "description": "Determine the country to which Easter Island belongs.",
      "key_info": "Chile",
      "ability": [
        "TextSearch"
      ],
      "dependence": [
        6
      ]
    },
    {
      "sg_id": 8,
      "description": "Find out when Chile joined the United Nations General Assembly.",
      "key_info": "26 June 1945",
      "ability": [
        "TextSearch"
      ],
      "dependence": [
        7
      ]
    },
    {
      "sg_id": 9,
      "description": "Find the first one signed the file.",
      "key_info": "Dong Biwu",
      "ability": [
        "TextSearch"
      ],
      "dependence": [
        8
      ]
    },
    {
      "sg_id": 10,
      "description": "Find what they call Dong's family",
      "key_info": "landless gentry",
      "ability": [
        "TextSearch",
        "WebVisit"
      ],
      "dependence": [
        8,
        9
      ]
    }
  ],
  "metadata": {
    "vis_inputs": 2,
    "source": [
      "https://www.amazon.com/Oxford-Street-Italian-guerra-silvana-ebook/dp/B00JGLTA0A",
      "https://zh.wikipedia.org/wiki/%E5%B8%95%E5%85%8B%E5%85%AC%E5%9B%AD"
    ],
    "level": 3,
    "difficulty": "Expert",
    "domain": {
      "d1": "Science",
      "d2": "Biology"
    },
    "fc_num": {
      "TextSearch": 8,
      "ImageSearch": 0,
      "ReverseImageSearch": 2,
      "WebVisit": 1,
      "Crop": 0
    },
    "trajectory": {
      "type": "Tree",
      "steps": [
        {
          "step": 1,
          "tool_name": "ReverseImageSearch",
          "input": "images/007_Science_Biology_1.jpg",
          "output": "Oxford Street, English",
          "description": "Determine the country where the image images/007_Science_Biology_1.jpg is located.",
          "dependence": [],
          "verify": "https://www.amazon.com/Oxford-Street-Italian-guerra-silvana-ebook/dp/B00JGLTA0A"
        },
        {
          "step": 2,
          "tool_name": "ReverseImageSearch",
          "input": "images/007_Science_Biology_2.jpg",
          "output": "Parker's Piece",
          "description": "Determine the location of image images/007_Science_Biology_2.jpg",
          "dependence": [],
          "verify": "https://zh.wikipedia.org/wiki/%E5%B8%95%E5%85%8B%E5%85%AC%E5%9B%AD"
        },
        {
          "step": 3,
          "tool_name": "TextSearch",
          "input": "English, Parker's Piece, University",
          "output": "University of Cambridge",
          "description": "Find the university located at Parker's Piece.",
          "dependence": [
            1,
            2
          ],
          "verify": "https://glossary.lib.cam.ac.uk/term/parkers-piece"
        },
        {
          "step": 4,
          "tool_name": "TextSearch",
          "input": "University of Cambridge, printed message",
          "output": "missing Darwin notebooks",
          "description": "Find the note with a printed message received by the University of Cambridge.",
          "dependence": [
            3
          ],
          "verify": "https://www.cam.ac.uk/stories/darwins-tree-of-life"
        },
        {
          "step": 5,
          "tool_name": "TextSearch",
          "input": "missing Darwin notebooks, printed message",
          "output": "Librarian, Happy Easter X",
          "description": "Find the printed message on the note.",
          "dependence": [
            4
          ],
          "verify": "https://www.bbc.com/news/entertainment-arts-60980288"
        },
        {
          "step": 6,
          "tool_name": "TextSearch",
          "input": "Happy Easter X, island",
          "output": "Easter Island",
          "description": "Identify the island associated with the message 'Happy Easter X'.",
          "dependence": [
            5
          ],
          "verify": "https://anthropologynow.wordpress.com/2014/04/20/happy-easter-island/"
        },
        {
          "step": 7,
          "tool_name": "TextSearch",
          "input": "Easter Island, nation",
          "output": "Chile",
          "description": "Determine the country to which Easter Island belongs.",
          "dependence": [
            6
          ],
          "verify": "https://en.wikipedia.org/wiki/Easter_Island"
        },
        {
          "step": 8,
          "tool_name": "TextSearch",
          "input": "Chile, United Nation, join date",
          "output": "26 June 1945",
          "description": "Find out when Chile joined the United Nations General Assembly.",
          "dependence": [
            7
          ],
          "verify": "https://research.un.org/en/unmembers/founders"
        },
        {
          "step": 9,
          "tool_name": "TextSearch",
          "input": "26 June 1945，first one sign",
          "output": "Dong Biwu",
          "description": "Find the first one who sign the file on 26 Junee 1945.",
          "dependence": [
            8
          ],
          "verify": "https://media.un.org/photo/en/asset/oun7/oun7755606"
        },
        {
          "step": 10,
          "tool_name": "TextSearch",
          "input": "Dong Biwu",
          "output": "https://xboorman.enpchina.eu/biographie/dong-biwu/",
          "description": "Search for the page about Dong's family.",
          "dependence": [
            8,
            9
          ],
          "verify": ""
        },
        {
          "step": 11,
          "tool_name": "WebVisit",
          "input": "https://xboorman.enpchina.eu/biographie/dong-biwu/",
          "output": "landless gentry",
          "description": "Search for what they call about Dong's family.",
          "dependence": [
            10
          ],
          "verify": ""
        }
      ]
    }
  }
}
{% endraw %}</code></pre>
</details>

2.4 Agent 框架设计

我们搭建了一个 Agent 评测框架，为模型提供以下 **5 种工具**：

| 工具 | 功能 |
|------|------|
| `TextSearch` | 文本关键词检索 |
| `ImageSearch` | 图像检索 |
| `ReverseImageSearch` | 以图搜图 |
| `CropImage` | 图像裁剪与区域提取 |
| `WebVisit` | 网页访问与内容读取 |

**框架实现细节：**

- 通过 **MCP 服务** 接入 SerpApi 和 Jina，支持模型在运行时调用检索与网页浏览能力；
- 通过 **Prompt 注入机制**，强制模型在剩余 5 轮时开始整合答案，并引导模型在无法作答时主动调用工具；
- 实现了基于**哈希映射的缓存机制**，将检索 query 映射为哈希键并存入 DB，在降低 API 成本的同时便于后续迁移复用。
- **即阅即焚机制**，为了避免上下文过长，每次输入多图后都进行summary转成文本摘要，并维护一个搜索状态表，用于实现agent memory。

---

## RESULTS

### 3.1 主实验：模型基准评测

结论： **GPT-5.2 表现最优**， doubao模型表现出色，qwen模型指令遵循能力较差：

![模型评测结果]({{ site.baseurl }}/images/Papers/BCV3/bcv3_table_3.png)

实验也表明，**引入 Agent 框架后模型的整体表现显著提升**。

### 3.2 消融实验：Pass@K 与搜索轮数

- **Pass@K 越大**，调大pass@k，模型答对的数目越多；
- **搜索轮数越多**，放宽搜索轮数，模型的表现越优秀。

*在更短轮次内检索到更多有效信息的模型，就表明模型的搜索能力更强。*

![Pass@K 与搜索轮数实验]({{ site.baseurl }}/images/Papers/BCV3/bac3_figure_4.png)

---

## ABILITY BOUND ANALYSIS

![错误原因分析]({{ site.baseurl }}/images/Papers/BCV3/bcv3_figure_5.png)

可以看到，GPT-5.2、Gemini3-Flash、Doubao-Seed-1.8与Qwen3-VL-235B主要的犯错位置都在**视觉信息定位的事物**上，其次是图像感知能力的失败。这也验证了当前多模态大模型*可能实际上没有看图的能力，而是在不断推理中解决了多模态问题*。
   
---