from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import re
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from restack_ai import Restack
import os
import time

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

@app.route('/get_sites', methods=['POST'])
def get_sites():
    if request.method == "OPTIONS":
        response = app.response_class()
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
        return response, 200
    
    data = request.json
    url = data.get('url')
    if not url:
        return jsonify({"error": "URL is required"}), 400

    sites = []
    try:
        # Fetch webpage content
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        # Find the JSON-LD script for event description
        json_ld_script = soup.find('script', type="application/ld+json")
        if json_ld_script:
            event_data = json.loads(json_ld_script.string)
            description = event_data.get("description", "Description not found")
        else:
            return jsonify({"error": "Event JSON-LD script not found"}), 404

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        # Generate project ideas
        data = {
            "messages": [
                {
                    "role": "system",
                    "content": "**System Message for LLM Hackathon Idea Generator (List-Only Format):** *Role*: You are an expert hackathon idea generator, specialized in providing a focused list of hackathon ideas based directly on user prompts. *Output*: When given a prompt, respond with a **numbered list** of specific hackathon project ideas. Do not include any additional text, explanations, or context—only a numbered list of ideas. Each idea should be concise, with a focus on innovative themes, tools, or unique approaches relevant to the prompt. *Guidelines*: 1. **Relevance**: Generate ideas that directly align with the users prompt. 2. **Variety**: Include diverse ideas covering different applications or interpretations of the topic to suit various skill levels and interests. 3. **Clarity**: Each idea should be short, specific, and actionable. *Example Output*: If prompted with smart cities: 1. Real-Time Traffic Prediction App 2. IoT-Based Waste Management System 3. Community Safety Monitoring Dashboard 4. Energy Consumption Optimization Platform 5. Citizen Feedback Collection Bot Only output a numbered list of hackathon ideas, with no additional information.",
                },
                {"role": "user", "content": description}
            ],
            "model": "llama-3.2-3b-preview"
        }

        response = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=data)

        if response.status_code == 200:
            response_json = response.json()
            if 'choices' in response_json and response_json['choices']:
                # Extract project ideas from response
                res = response_json['choices'][0].get('message', {}).get('content', "")
                ai_projects = [line.split(". ", 1)[1] for line in res.strip().splitlines() if ". " in line]
            else:
                return jsonify({"error": "Empty 'choices' in response from project idea generation"}), 500
        else:
            return jsonify({"error": f"Failed to generate project ideas, status code: {response.status_code}"}), response.status_code

        # Generate HTML for each project idea
        for project in ai_projects:
            data = {
                "messages": [
                    {
                        "role": "system",
                        "content": "**System Message:** Generate one single HTML file that includes all HTML, CSS, and JavaScript code needed to bring a hackathon idea to life. Ensure the output only includes the `<html>`, `<head>`, and `<body>` tags, with no additional explanations or comments inside and outside of the code itself. The HTML file should contain: 1. **Inline CSS**: - Use `<style>` tags for modern, 2024 CSS styling within the HTML. - Apply design trends like minimalistic layouts, gradients, smooth animations, and responsive design. - Include CSS variables and flexbox or grid for layout structure. 2. **Inline JavaScript**: - Use `<script>` tags to add interactivity and functionality that enhances the user experience. - Ensure code is efficient and organized within this single file. The output should include only the HTML code without any extra text or explanations."
                    },
                    {"role": "user", "content": project}
                ],
                "model": "llama-3.2-11b-text-preview"
            }

            response = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=data)
            response_data = response.json()

            # Check response data structure for the HTML generation
            if 'choices' in response_data and response_data['choices']:
                html_content = response_data['choices'][0].get('message', {}).get('content', "")
                #print(html_content)
                html_match = re.search(r"<html\b[^>]*>(.*?)</html>", html_content, re.DOTALL)
                if html_match:
                    html_content_only = html_match.group(1).strip()
                    sites.append({
                        "project_idea": project,
                        "source_code": f"<html>{html_content_only}</html>"
                    })
                else:
                    print(f"No HTML found for project: {project}")
            else:
                print(f"Empty 'choices' or unexpected format in response for project: {project}")
                
            time.sleep(2)  # Avoiding rate limits

        return jsonify(sites)
    
    except Exception as e:
        return jsonify({"error": f"Exception occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
