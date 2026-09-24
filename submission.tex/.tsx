\documentclass[11pt,a4paper]{article}
\usepackage[utf8]{inputenc}
\usepackage{amsmath,amsfonts,amssymb,amsthm}
\usepackage{geometry}
\geometry{margin=1in}
\usepackage{booktabs}
\usepackage{cite}
\usepackage{microtype}
\usepackage{titlesec}
\usepackage{listings}
\usepackage{xcolor}

\titleformat{\section}{\large\bfseries}{\thesection}{1em}{}
\titleformat{\subsection}{\normalsize\bfseries}{\thesubsection}{1em}{}

\lstset{
    backgroundcolor=\color{gray!5},
    basicstyle=\ttfamily\small,
    breaklines=true,
    keywordstyle=\color{blue},
    commentstyle=\color{green!50!black},
    stringstyle=\color{orange},
    frame=single
}

\title{\textbf{Advanced Machine Learning Ambassador Assessment \\ Round 2 Selection Problems}}
\author{\textbf{Applicant Name}}
\date{\today}

\begin{document}

\maketitle

\section{Problem 1: Greedy Decoding Strategy Analysis}

\subsection{Mathematical Formalization \& Sequence Probabilities}
Autoregressive language generation can be modeled as finding a target sequence $\mathbf{Y} = (y_1, y_2, \dots, y_T)$ within a vocabulary space $V$ that maximizes the conditional joint probability distribution given a context $\mathbf{X}$:
\begin{equation}
P(\mathbf{Y} \mid \mathbf{X}) = \prod_{t=1}^{T} P(y_t \mid y_{<t}, \mathbf{X})
\end{equation}

Greedy decoding optimizes for local, step-wise maximizations at each temporal slice $t$:
\begin{equation}
y_t = \arg\max_{w \in V} P(w \mid y_{<t}, \mathbf{X})
\end{equation}

For a horizon of $T=2$, the model evaluates three primary paths during the first iteration:
\begin{equation*}
P(\text{"sat"}) = 0.5, \quad P(\text{"ran"}) = 0.4, \quad P(\text{"hid"}) = 0.1
\end{equation*}

The argmax selection yields $y_1 = \text{"sat"}$. Conditioning the subsequent generation step on $y_1$ gives the joint sequence probability:
\begin{equation}
P(\text{"sat"}, y_2) = P(\text{"sat"}) \times P(y_2 \mid \text{"sat"}) = 0.5 \times 0.3 = \mathbf{0.15}
\end{equation}

Conversely, evaluating the sub-optimal branch at $t=1$ reveals a globally superior trajectory:
\begin{equation}
P(\text{"ran"}, y_2) = P(\text{"ran"}) \times P(y_2 \mid \text{"ran"}) = 0.4 \times 0.9 = \mathbf{0.36}
\end{equation}

\subsection{Algorithmic Evaluation}
Greedy decoding outputs the sequence starting with \textbf{"sat"} (Joint $P = 0.15$). This is \textbf{not} the most probable two-token sequence. Because greedy decoding lacks search lookahead, it greedily commits to locally optimal tokens, completely pruning downstream branches that contain significantly higher cumulative mass ($0.36 > 0.15$).

---

\section{Problem 2: Architectural Comparison: Fine-Tuning vs. RAG}

For a 200-page operational handbook experiencing monthly revisions, knowledge retention must be categorized by parametric and non-parametric memory bounds.

\subsection{Comparative Architectural Matrix}
\begin{table}[h]
\centering
\caption{Parametric (Fine-Tuning) vs. Non-Parametric (RAG) Architecture}
\label{tab:rag_vs_ft}
\begin{tabular}{lll}
\toprule
\textbf{Metric} & \textbf{Fine-Tuning} & \textbf{Retrieval-Augmented Generation (RAG)} \\
\midrule
Knowledge Storage & Internal Weights ($\Delta W$) & External Vector DB Index (e.g., HNSW) \\
Data Latency & High (Requires training epochs) & Near-Zero (Instantaneous index updates) \\
Hallucination Vulnerability & High (Plausible confabulations) & Low (Strictly bounded context gating) \\
Auditability & Indeterminate Black Box & Deterministic Document Citations \\
\bottomrule
\end{tabular}
\end{table}

\subsection{Core Technical Justifications}
\begin{itemize}
    \item \textbf{Catastrophic Forgetting and Weight Drift:} Fine-tuning a language model continuously on monthly cycles alters base model parameters. This introduces a risk of catastrophic forgetting, where base reasoning capacities degrade to accommodate new structural rules.
    \item \textbf{Vector Pipeline Computational Footprint:} A 200-page document ($\approx 60,000$ tokens) scales effortlessly into modern dense vector embedding spaces. Updating knowledge requires clearing the index and re-embedding chunks, skipping the computational overhead associated with backpropagation.
\end{itemize}

---

\section{Problem 3: Quantitative Recommender Similarity Modeling}

Given preference vectors in an $N$-dimensional spatial domain, user similarity is evaluated using the geometric cosine rule:
\begin{equation}
\text{Sim}(\mathbf{U}, \mathbf{V}) = \cos(\theta) = \frac{\mathbf{U} \cdot \mathbf{V}}{\|\mathbf{U}\| \|\mathbf{V}\|}
\end{equation}

\subsection{Cosine Similarity Computations}
Given preference representations $\mathbf{U} = [5, 1, 4]^T$, $\mathbf{A} = [4, 1, 5]^T$, and $\mathbf{B} = [1, 5, 2]^T$:
\begin{equation*}
\|\mathbf{U}\| = \sqrt{5^2 + 1^2 + 4^2} = \sqrt{42}, \quad \|\mathbf{A}\| = \sqrt{4^2 + 1^2 + 5^2} = \sqrt{42}, \quad \|\mathbf{B}\| = \sqrt{1^2 + 5^2 + 2^2} = \sqrt{30}
\end{equation*}

Evaluating similarity arrays:
\begin{equation}
\text{Sim}(\mathbf{U}, \mathbf{A}) = \frac{(5\times4) + (1\times1) + (4\times5)}{\sqrt{42} \times \sqrt{42}} = \frac{41}{42} \approx \mathbf{0.9762}
\end{equation}
\begin{equation}
\text{Sim}(\mathbf{U}, \mathbf{B}) = \frac{(5\times1) + (1\times5) + (4\times2)}{\sqrt{42} \times \sqrt{30}} = \frac{18}{\sqrt{1260}} \approx \mathbf{0.5071}
\end{equation}

\subsection{Downstream Recommender Mechanics}
User A demonstrates a highly aligned trajectory ($\theta \approx 12.5^\circ$), making them a critical neighbor for User U within a User-Based Collaborative Filtering engine. The recommender will construct a K-Nearest Neighbors (KNN) subgraph to generate missing rating projections:
\begin{equation}
\hat{R}_{u,i} = \mu_u + \frac{\sum_{v \in N} \text{Sim}(u,v) \cdot (R_{v,i} - \mu_v)}{\sum_{v \in N} |\text{Sim}(u,v)|}
\end{equation}
Unseen items scoring high within User A's profile will be prioritised and recommended to User U.

\end{document}
