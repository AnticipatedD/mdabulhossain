## Problem 1: Greedy Decoding (Deep Dive & Advanced Strategies)
To make your application stand out, you must contrast greedy decoding with globally optimal search strategies, evaluating the time-complexity vs. optimality trade-off.

       [Root]
      /   |   \
   0.5   0.4   0.1
   /      |      \
"sat"   "ran"   "hid"
 (0.3)   (0.9)   (...)
  = 0.15  = 0.36

## 1. Mathematical Formalization of the Search Space
Language generation can be framed as finding a sequence $\mathbf{Y} = (y_1, y_2, \dots, y_T)$ that maximizes the joint conditional probability over a vocabulary $V$:
$$P(\mathbf{Y} \mid \mathbf{X}) = \prod_{t=1}^{T} P(y_t \mid y_{<t}, \mathbf{X})$$ 

* Greedy Decoding Strategy: At each step $t$, the algorithm makes an irreversible local choice:
$$y_t = \arg\max_{w \in V} P(w \mid y_{<t}, \mathbf{X})$$ 
* Complexity: Linear, $\mathcal{O}(\vert{}V\vert{} \cdot T)$.
   * Flaw: Sub-optimal search. Choosing $P(\text{"sat"}) = 0.5$ prunes the highly probable path starting with $\text{"ran"}$ ($0.4 \times 0.9 = 0.36$), yielding an overall sequence probability of just $0.15$.

## 2. Advanced Mitigation Frameworks
To achieve global or near-global optimality, advanced architectures utilize alternative decoding algorithms:

| Strategy | Algorithmic Mechanism | Pros | Cons |
|---|---|---|---|
| Beam Search | Maintains $B$ (beam width) active candidate sequences at each step, maximizing $\sum_{t=1}^T \log P(y_t \mid y_{<t})$. | Solves local trapping; discovers the $0.36$ path if $B \geq 2$. | Can cause repetitive, generic outputs in open-ended text. |
| Top-$k$ / Top-$p$ (Nucleus) | Samples from a truncated vocabulary distribution based on count ($k$) or cumulative probability ($p$). | Introduces high-quality linguistic variance and creativity. | Non-deterministic; occasionally choices can lose factual coherence. |

------------------------------
## Problem 2: Fine-Tuning vs. Retrieval-Augmented Generation (RAG)
An expert implementation often pairs these architectures. Below is a structured architectural comparison tailored to the school's monthly shifting, 200-page handbook.
## 1. Architectural Matrix

| Metric | Fine-Tuning (Parametric Memory) | RAG (Non-Parametric Memory) |
|---|---|---|
| Knowledge Type | Internalized via weight updates ($\Delta W$). | Externalized vector database lookups. |
| Data Latency | High (Requires pipeline retraining/epochs). | Near-Zero (Instantaneous vector index updates). |
| Hallucination Risk | High (Model generates plausible-sounding text). | Low (Strictly grounded in retrieved source context). |
| Auditability | Black Box (Hard to pinpoint why a weight fired). | Clear lineage (Provides exact document source/page citations). |

## 2. Deep Technical Justifications

* Catastrophic Forgetting & Drift: Monthly fine-tuning risks "catastrophic forgetting," where the model degrades its underlying reasoning capabilities or base knowledge while trying to overwrite specific factual details.
* Vector Pipeline Efficiency: A 200-page document converts to approximately $60,000 \text{ tokens}$. This easily fits into standard embedding indexes like HNSW (Hierarchical Navigable Small World) or frameworks like FAISS. Updating the knowledge base requires a single script to recalculate vector embeddings, running at near-zero compute cost.

## 3. Propose an "Above and Beyond" Hybrid Solution (RAFT Strategy)
To truly make your solution exceptional, recommend Retrieval-Augmented Fine-Tuning (RAFT). Fine-tune the LLM once on historical school document formatting styles so it learns the desired conversational tone, behavioral constraints, and markdown structure. Then, deploy a RAG pipeline over it to inject the live, changing factual text chunks on a monthly basis.
------------------------------
## Problem 3: Recommender Similarity Optimization
Go beyond standard arithmetic to address data normalize constraints and scalability vectors.
## 1. Geometric Interpretation of Cosine Similarity
Cosine similarity evaluates the orientation of vectors in an $N$-dimensional space, independent of scale:
$$\text{Sim}(\mathbf{U}, \mathbf{A}) = \cos(\theta) = \frac{\mathbf{U} \cdot \mathbf{A}}{\Vert{}\mathbf{U}\Vert{} \Vert{}\mathbf{A}\Vert{}}$$ 
As $\theta \to 0^\circ$, $\cos(\theta) \to 1$, indicating identical preference alignments along the feature rays.

* $\theta_{UA} = \arccos(0.976) \approx 12.5^\circ$ (Highly aligned)
* $\theta_{UB} = \arccos(0.507) \approx 59.5^\circ$ (Weakly aligned)

## 2. Addressing a Core Vulnerability: Rating Bias
A fatal flaw of pure cosine similarity in production is its inability to handle user rating bias (e.g., User A is an easy rater who gives 4s and 5s, while User B is strict but shares the same relative preference order).
To make your application exceptional, propose Pearson Correlation Coefficient (Centered Cosine Similarity) as a robust production alternative. This centers vectors by subtracting each user's mean rating ($\mu_u$), converting raw preferences into variation vectors:
$$\text{Sim}_{\text{Pearson}}(u, v) = \frac{\sum_{i \in I} (R_{u,i} - \mu_u)(R_{v,i} - \mu_v)}{\sqrt{\sum_{i \in I} (R_{u,i} - \mu_u)^2} \sqrt{\sum_{i \in I} (R_{v,i} - \mu_v)^2}}$$ 
## 3. Production Deployment: User-Based vs. Item-Based Scalability
Explain how a recommender acts on this similarity matrix via K-Nearest Neighbors (KNN):

User U ---> Find K-Nearest Neighbors (User A) ---> Aggregate Unseen Items ---> Rank & Recommend


   1. Prediction Equation: Predict User $U$'s score for a new movie $i$ using a similarity-weighted average of their closest neighbors $N$:
   $$\hat{R}_{u,i} = \mu_u + \frac{\sum_{v \in N} \text{Sim}(u,v) \cdot (R_{v,i} - \mu_v)}{\sum_{v \in N} \vert{}\text{Sim}(u,v)\vert{}}$$ 
   2. Scalability Note: User-based filtering scales poorly as user count ($M$) grows, requiring $\mathcal{O}(M^2)$ similarity evaluations. For production-scale deployment, suggest moving to Item-to-Item Collaborative Filtering or Matrix Factorization (ALS/SVD) to pre-compute dense embeddings offline.
