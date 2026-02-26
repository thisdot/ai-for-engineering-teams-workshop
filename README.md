# AI for Engineering Teams Workshop

This is the workshop repository for **AI for Engineering Teams: Practical Tools & Workflows for Modern Development**. Students will build a Customer Intelligence Dashboard using spec-driven development with AI agents.

## Getting Started

### Using VS Code Dev Containers (Recommended)
Prerequisite: [Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers)

1. Open this repository in VS Code
2. When prompted, click "Reopen in Container" (or use Command Palette: "Dev Containers: Reopen in Container")
3. The dev container will automatically set up the environment with Node.js LTS
4. Run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Local Development (Alternative)

Requires Node.js LTS. Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

## Project Structure

```
├── src/                  # Next.js application source
│   ├── app/             # App Router pages and layouts
│   └── data/            # Mock data and API integration
├── public/              # Static assets
├── exercises/           # Workshop exercises
├── requirements/        # Feature requirements and specifications
├── specs/               # Generated specifications (AI output)
└── templates/           # Specification templates
```

## Workshop Methodology

This workshop teaches **spec-driven development** with AI agents:

1. **Write clear specifications** using templates in `/templates/`
2. **Store generated specs** in `/specs/` for reference
3. **Work through exercises** in `/exercises/` directory
4. **Build iteratively** with AI assistance

## Tech Stack

- **Frontend**: Next.js 15+ (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS
- **Data**: Mock customer data, API Ninjas integration
- **Development**: VS Code Dev Containers, Node LTS

## Workshop Exercises

Complete exercises progressively through 8 focused sessions:

1. **Effective Prompting Techniques** - Practice refining prompts for better AI output
2. **Thinking in Specs** - Create your first CustomerCard specification
3. **Expanding Dashboard Specs** - Generate additional component specifications
4. **Advanced Spec Integration** - Build complex multi-component features
5. **Implementing from Specs** - Transform specs into working React components
6. **Building Custom Slash Commands** - Create workflow automation commands
7. **Introduction to Subagents** - Define specialized AI agents
8. **Advanced Subagent Orchestration** - Batch implementation patterns

## Key Learning Objectives

- Master effective prompting techniques for AI collaboration
- Transform ideas into AI-ready specifications
- Implement spec-driven development workflows
- Build custom slash commands for workflow automation
- Create and orchestrate specialized AI subagents
- Apply iterative refinement and verification patterns
- Build production-ready applications with AI assistance

## Support

During the workshop, instructors will guide you through each exercise. Focus on understanding the methodology rather than just completing tasks.
