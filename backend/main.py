from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
async def parse_pipeline(request: Request):
    data = await request.json()
    nodes = data.get("nodes", [])
    edges = data.get("edges", [])

    num_nodes = len(nodes)
    num_edges = len(edges)

    # Build adjacency list
    adj = {node['id']: [] for node in nodes}
    for edge in edges:
        source = edge.get('source')
        target = edge.get('target')
        if source in adj:
            adj[source].append(target)

    # Detect cycle using DFS
    def is_dag():
        visited = set()
        rec_stack = set()

        def dfs(v):
            visited.add(v)
            rec_stack.add(v)
            for neighbor in adj.get(v, []):
                if neighbor not in visited:
                    if dfs(neighbor):
                        return True
                elif neighbor in rec_stack:
                    return True
            rec_stack.remove(v)
            return False

        for node in adj:
            if node not in visited:
                if dfs(node):
                    return False
        return True

    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": is_dag()
    }