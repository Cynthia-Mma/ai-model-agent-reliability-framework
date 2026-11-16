# Agent & Tool-Use Evaluation Guide

## Simulated vs. Live Tool Execution

This framework explicitly distinguishes **Simulated Tool-Use Tests** from live production integrations:
- **Simulated Tool-Use Tests** use deterministic JSON tool schemas and mock responses (`404`, `422`, `503`, `200 OK`) so evaluators can test agent branching, argument grounding, error recovery, and safety boundaries safely and reproducibly.
- Never report a simulated tool test as a live external system integration.

## 8-Step Agent Execution Lifecycle

1. **Understand the task**
2. **Determine whether a tool is required**
3. **Select the correct tool**
4. **Provide valid, grounded arguments**
5. **Interpret the tool response accurately**
6. **Decide next action or error recovery**
7. **Verify the final outcome** (post-mutation read)
8. **Report accurately what was completed**

## 11 Failure Checks for Tool-Using Agents

1. Correct tool selection (`EVAL-029`, `EVAL-030`)
2. Incorrect tool selection (`EVAL-030`, `EVAL-038`)
3. Missing required parameters (`EVAL-031`)
4. Invalid arguments (`EVAL-031`, `EVAL-032`)
5. Tool calls made with unsupported assumptions (`EVAL-009`, `EVAL-031`)
6. Incorrect interpretation of tool responses (`EVAL-035`, `EVAL-038`)
7. Failure to recover from tool errors (`EVAL-033`, `EVAL-034`)
8. Unnecessary repeated calls (`EVAL-033`, `EVAL-034`)
9. Premature claims of success (`EVAL-035`, `EVAL-036`)
10. Failure to verify completed actions (`EVAL-037`, `EVAL-040`)
11. Unauthorized or unsafe tool execution (`EVAL-041`–`EVAL-047`)
