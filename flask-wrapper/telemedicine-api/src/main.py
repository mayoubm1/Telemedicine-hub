import os
import requests
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app, origins="*")

# Node.js backend URL
NODE_BACKEND_URL = "http://localhost:3000"

@app.route('/api/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH'])
def proxy_to_node(path):
    """Proxy all API requests to the Node.js backend"""
    try:
        # Construct the full URL for the Node.js backend
        url = f"{NODE_BACKEND_URL}/api/{path}"
        
        # Forward the request method, headers, and data
        headers = dict(request.headers)
        # Remove host header to avoid conflicts
        headers.pop('Host', None)
        
        # Handle different content types
        if request.content_type and 'application/json' in request.content_type:
            data = request.get_json()
            response = requests.request(
                method=request.method,
                url=url,
                headers=headers,
                json=data,
                params=request.args
            )
        else:
            # Handle form data, files, etc.
            response = requests.request(
                method=request.method,
                url=url,
                headers=headers,
                data=request.get_data(),
                params=request.args
            )
        
        # Create Flask response with the same status code and headers
        flask_response = Response(
            response.content,
            status=response.status_code,
            headers=dict(response.headers)
        )
        
        return flask_response
        
    except requests.exceptions.ConnectionError:
        return jsonify({
            "error": "Backend service unavailable",
            "message": "The Node.js backend is not running or unreachable"
        }), 503
    except Exception as e:
        return jsonify({
            "error": "Proxy error",
            "message": str(e)
        }), 500

@app.route('/health')
def health_check():
    """Health check endpoint"""
    try:
        # Check if Node.js backend is reachable
        response = requests.get(f"{NODE_BACKEND_URL}/api/health", timeout=5)
        backend_status = "healthy" if response.status_code == 200 else "unhealthy"
    except:
        backend_status = "unreachable"
    
    return jsonify({
        "status": "healthy",
        "proxy": "running",
        "backend": backend_status,
        "message": "Flask proxy for Telemedicine Hub"
    })

@app.route('/')
def index():
    """Root endpoint with API information"""
    return jsonify({
        "service": "Telemedicine Hub API Proxy",
        "version": "1.0.0",
        "description": "Flask proxy for Node.js backend",
        "endpoints": {
            "health": "/health",
            "api": "/api/*"
        },
        "backend": NODE_BACKEND_URL
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)

