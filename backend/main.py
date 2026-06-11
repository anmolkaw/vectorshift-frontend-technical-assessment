from collections import deque
from typing import Any

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _as_list(value: Any) -> list[Any]:
    return value if isinstance(value, list) else []


def _get_node_ids(nodes: list[Any]) -> set[str]:
    node_ids: set[str] = set()
    for node in nodes:
        if isinstance(node, dict) and node.get("id") is not None:
            node_ids.add(str(node["id"]))
    return node_ids


def _is_dag(nodes: list[Any], edges: list[Any]) -> bool:
    node_ids = _get_node_ids(nodes)
    adjacency: dict[str, list[str]] = {node_id: [] for node_id in node_ids}
    indegree: dict[str, int] = {node_id: 0 for node_id in node_ids}

    for edge in edges:
        if not isinstance(edge, dict):
            continue

        source = edge.get("source")
        target = edge.get("target")

        if source is None or target is None:
            continue

        source_id = str(source)
        target_id = str(target)

        if source_id not in node_ids or target_id not in node_ids:
            continue

        adjacency[source_id].append(target_id)
        indegree[target_id] += 1

    queue = deque(node_id for node_id, degree in indegree.items() if degree == 0)
    visited_count = 0

    while queue:
        node_id = queue.popleft()
        visited_count += 1

        for neighbor in adjacency[node_id]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)

    return visited_count == len(node_ids)


@app.get('/')
def read_root():
    return {'Ping': 'Pong'}


@app.post('/pipelines/parse')
async def parse_pipeline(request: Request):
    try:
        payload = await request.json()
    except Exception:
        payload = {}

    if not isinstance(payload, dict):
        payload = {}

    nodes = _as_list(payload.get("nodes"))
    edges = _as_list(payload.get("edges"))

    return {
        'num_nodes': len(nodes),
        'num_edges': len(edges),
        'is_dag': _is_dag(nodes, edges),
    }
