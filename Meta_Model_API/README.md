# Build with Meta Model API and Muse Code

Your next build starts with Muse. Meta Model API is the inference platform for the latest models from Meta including Muse Spark, and 
[Muse Code](https://dev.meta.ai/install.ps1) is a coding agent built for Muse Spark. Call the API to build your own app or agent, or run Muse Code for a ready-made agent in your terminal — same models, same auth, same billing.

[Muse Spark](https://api.meta.ai/v1) is served through Model API, with agent-ready primitives and no extra setup: parallel tool calls, streamed tool-call arguments, reasoning that carries across turns, and a 1M-token context window.

[Muse Image](https://api.meta.ai/v1/images/generations) is served through Model API too. It generates and edits images from a text prompt and refines them across turns.

[Muse Voice Transcribe](https://api.meta.ai/v1/muse-voice-transcribe-1.0) is a speech-to-text model on Model API. It transcribes streaming and non-streaming audio, with speaker attribution and turn detection in the model.

[Segment Anything Model 3.1 (SAM 3.1)](https://api.meta.ai/POST/v1/responses), an open-weight model from Meta, is now available on Model API. It finds and outlines objects in images and video from a short text prompt, returning boxes and masks.

**Muse Glimmer** takes a different path: you download the open weights and run it on your own hardware instead of calling it through Model API. It delivers strong performance for its size class under a permissive [Apache 2.0 license](https://www.apache.org/licenses/LICENSE-2.0.txt).

**Muse Code** is a coding agent from Meta for the terminal and CI, built for Muse Spark and powered by Model API. Install it, sign in, and run it in a project. It plans, edits, and runs commands to do tasks, with approvals and an OS sandbox on from the first run.

# Build with Muse Code 
Install the CLI on macOS or Linux:
```bash
curl -fsSL https://dev.meta.ai/install.sh | sh
```
Or install it on Windows with PowerShell:
`powershell
irm https://dev.meta.ai/install.ps1 | iex`

Start building:
```bash
muse   # start Muse Code; on first run, choose a browser sign-in or paste an API key
```
> [!NOTE]
> Muse Code or the API.
> Muse Code and the API are two ways to use the same model. Run Muse Code for a ready-made agent at the command line or in CI; call the API directly when you build your own agent or app.

Learn more in the **Muse Code overview**.

# Build with Muse Spark
Call Model API directly, run Muse Code, or connect the coding agent you already use. All three drive the same model over the same auth and billing.
